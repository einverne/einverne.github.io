---
layout: post
title: "使用 Beancount 记账篇二：各类账单导入"
aliases: "使用 Beancount 记账篇二：各类账单导入"
tagline: ""
description: ""
category: [ Beancount, 经验总结 ]
tags: [ beancount, accounting, bookkeeping, double-entry, bill-import, linux, wechat, alipay ]
last_updated:
---


在上一篇[如何给 Beancount 账户命名](/post/2021/02/beancount-account-name-template.html) 的文章中，我们已经迈出了 Beancount 使用的第一步，建立一套属于自己的账户系统，之后所有的资金就会在这些账户之间流转。复式记账讲求账户的流入与流出。

那接下来就是 Beancount 真正关键的地方，熟悉并导入以前的帐本。使用 Beancount 就会想着如何将之前的账单导入到 Beancount。

但人的惰性总是让我们不会每一笔交易都事无巨细的记录下来，所以我的方式便是固定一个时间，然后对上一个周期内的账单进行一次性批量处理，比如在信用卡账单日对信用卡消费做处理，或者在月末对微信账单进行处理。

这样就使得我需要有地方可以直接导出我的账单，下面就是我经常使用的账单导出整理的方式。因为微信，京东等日常消费的账户绑定了信用卡，其中还涉及到了信用卡负债账户的部分，所以我的选择可以分成两个部分。一个就是从源头上，导出并处理信用卡账单，另一部分就是消费账户的账单，比如微信，京东的账单。

这两部分的优缺点都非常明显：

- 微信，京东的账单可以将账单的具体明细列举的非常清晰，而信用卡账单则比较简陋
- 但是信用卡账单可以方便地和 Liabilities 账户关联起来，而微信和京东则需要提取付款账户来进行判断，才能合理地将账单划分到账户

正因为这两个的区别，目前我还在混合使用这两个方法，不过以信用卡账单为主。


## 交行信用卡账单导入 Beancount
我目前主要使用的卡片是交通银行的，所以这里整理了一下交通银行账单的处理过程。不过大体思路都是相差不多的。

交通银行每个月的账单日都会发一份电子邮件到邮箱，在邮件中列出了记账周期中的消费记录，利用 [Download table as csv](https://chrome.google.com/webstore/detail/jgeonblahchgiadgojdjilffklaihalj) 这个开源的 Chrome 插件，或者也可以使用 [Table capture](https://chrome.google.com/webstore/detail/table-capture/iebpjdmgckacbodjpijphcplhebcmeop)，可以将账单导出成 CSV 格式，然后用 vim 简单处理一下，比如把第一列删除，可以得到如下格式的文件：
 
    "交易日期","记账日期","卡末四位","交易说明","交易金额","入账金额"
    "2011/01/16","2011/01/17","2987","消费 支付宝 - xxx科技有限公司","RMB 6.30","RMB 6.30"
    "2011/01/18","2011/01/19","2987","消费 支付宝 - xxx科技有限公司","RMB 0.90","RMB 0.90"
    "2011/01/19","2011/01/20","2987","消费 食堂","RMB 100.00","RMB 100.00"

然后批量将金额中的 RMB 去掉。`%s/RMB //g`，然后保存到 `datas/comm-2021.01.csv` 文件中。随后执行：

    export PYTHONPATH=.
    bean-extract config.py datas/comm-2021.01.csv > beans/comm-2021.01.bean

只要 `config.py` 中设置的账户分类能够覆盖账单中的关键字，基本上就完工了。如果有些账单分入了错误的账户，那么手动的调整一下 `config.py` 再执行一次。

在文件夹 `importers` 中创建文件 `beanmaker.py` 填入如下内容:

```
"""CSV importer.
"""

import collections
import csv
import datetime
import enum
import io
import os
import re
from os import path
from typing import Union, Dict, Callable, Optional

import dateutil.parser
from beancount.core import data
from beancount.core.amount import Amount
from beancount.core.number import D
from beancount.core.number import ZERO
from beancount.ingest import importer
from beancount.utils.date_utils import parse_date_liberally

DEFAULT = "DEFAULT"


# The set of interpretable columns.
class Col(enum.Enum):
    # The settlement date, the date we should create the posting at.
    DATE = '[DATE]'

    # The date at which the transaction took place.
    TXN_DATE = '[TXN_DATE]'

    # The time at which the transaction took place.
    # Beancount does not support time field -- just add it to metadata.
    TXN_TIME = '[TXN_TIME]'

    # The payee field.
    PAYEE = '[PAYEE]'

    # The narration fields. Use multiple fields to combine them together.
    NARRATION = NARRATION1 = '[NARRATION1]'
    NARRATION2 = '[NARRATION2]'
    REMARK = '[REMARK]'

    # The amount being posted.
    AMOUNT = '[AMOUNT]'

    # Debits and credits being posted in separate, dedicated columns.
    AMOUNT_DEBIT = '[DEBIT]'
    AMOUNT_CREDIT = '[CREDIT]'

    # The balance amount, after the row has posted.
    BALANCE = '[BALANCE]'

    # A field to use as a tag name.
    TAG = '[TAG]'

    # A column which says DEBIT or CREDIT (generally ignored).
    DRCR = '[DRCR]'

    # Last 4 digits of the card.
    LAST4 = '[LAST4]'

    # An account name.
    ACCOUNT = '[ACCOUNT]'

    # Transaction status
    STATUS = '[STATUS]'

    # Transcatin type.
    TYPE = "[TYPE]"


# The set of status which says DEBIT or CREDIT
class Drcr(enum.Enum):
    DEBIT = '[DEBIT]'

    CREDIT = '[CREDIT]'

    UNCERTAINTY = '[UNCERTAINTY]'


def cast_to_decimal(amount):
    """Cast the amount to either an instance of Decimal or None.

    Args:
        amount: A string of amount. The format may be '¥1,000.00', '5.20', '200'
    Returns:
        The corresponding Decimal of amount.
    """
    if amount is None:
        return None
    amount = ''.join(amount.split(','))
    numbers = re.findall(r"\d+\.?\d*", amount)
    assert len(numbers) >= 1
    return D(numbers[0])


def strip_blank(contents):
    """
    strip the redundant blank in file contents.
    """
    with io.StringIO(contents) as csvfile:
        csvreader = csv.reader(csvfile, delimiter=",", quotechar='"')
        rows = []
        for row in csvreader:
            rows.append(",".join(['"{}"'.format(x.strip()) for x in row]))
        return "\n".join(rows)


def get_amounts(iconfig: Dict[Col, str], row, DRCR_status: Drcr,
    allow_zero_amounts: bool = False):
    """Get the amount columns of a row.

    Args:
        iconfig: A dict of Col to row index.
        row: A row array containing the values of the given row.
        allow_zero_amounts: Is a transaction with amount D('0.00') okay? If not,
            return (None, None).
    Returns:
        A pair of (debit-amount, credit-amount), both of which are either an
        instance of Decimal or None, or not available.
    """
    debit, credit = None, None
    if Col.AMOUNT in iconfig:
        amount = row[iconfig[Col.AMOUNT]]
        # Distinguish debit or credit
        if DRCR_status == Drcr.CREDIT:
            credit = amount
        else:
            debit = amount
    else:
        debit, credit = [row[iconfig[col]] if col in iconfig else None
                         for col in [Col.AMOUNT_DEBIT, Col.AMOUNT_CREDIT]]

    # If zero amounts aren't allowed, return null value.
    is_zero_amount = (
            (credit is not None and cast_to_decimal(credit) == ZERO) and
            (debit is not None and cast_to_decimal(debit) == ZERO))
    if not allow_zero_amounts and is_zero_amount:
        return None, None

    return (
        -cast_to_decimal(debit) if debit else None,
        cast_to_decimal(credit) if credit else None
    )


def get_debit_or_credit_status(iconfig: [Col, str], row, DRCR_dict):
    """Get the status which says DEBIT or CREDIT of a row.
    """

    try:
        if Col.AMOUNT in iconfig:
            DRCR = DRCR_dict[row[iconfig[Col.DRCR]]]
            return DRCR
        else:
            if Col.AMOUNT_CREDIT in iconfig and row[iconfig[Col.AMOUNT_CREDIT]]:
                return Drcr.CREDIT
            elif Col.AMOUNT_DEBIT in iconfig and row[iconfig[Col.AMOUNT_DEBIT]]:
                return Drcr.DEBIT
            else:
                return Drcr.UNCERTAINTY
    except KeyError:
        return Drcr.UNCERTAINTY


class Importer(importer.ImporterProtocol):
    """Importer for CSV files."""

    def __init__(self,
        config,
        default_account,
        currency,
        file_name_prefix: str,
        skip_lines: int = 0,
        last4_map: Optional[Dict] = None,
        categorizer: Optional[Callable] = None,
        institution: Optional[str] = None,
        debug: bool = False,
        csv_dialect: Union[str, csv.Dialect] = 'excel',
        dateutil_kwds: Optional[Dict] = None,
        narration_sep: str = '; ',
        close_flag: str = '',
        DRCR_dict: Optional[Dict] = None,
        assets_account: Optional[Dict] = None,
        debit_account: Optional[Dict] = None,
        credit_account: Optional[Dict] = None):
        """Constructor.

        Args:
            config: A dict of Col enum types to the names or indexes of the
                columns.
            default_account: An account string, the default account to post
                this to.
            currency: A currency string, the currency of this account.
            skip_lines: Skip first x (garbage) lines of file.
            last4_map: A dict that maps last 4 digits of the card to a friendly
                string.
            categorizer: A callable that attaches the other posting (usually
                expenses) to a transaction with only single posting.
            institution: An optional name of an institution to rename the files
                to.
            debug: Whether or not to print debug information.
            dateutil_kwds: An optional dict defining the dateutil parser kwargs.
            csv_dialect: A `csv` dialect given either as string or as instance
                or subclass of `csv.Dialect`.
            close_flag: A string show the garbage transaction from the STATUS
                column.
            DRCR_dict: An optional dict of Debit_or_credit.DEBIT or
                Debit_or_credit.CREDIT to user-defined debit or credit string
                occurs in the DRCR column. If DRCR column is revealed and
                DRCR_dict is None, the status of trasaction will be uncertain.
            assets_account: An optional dict of user-defined.
        """

        assert isinstance(config, dict)
        self.config = config

        self.default_account = default_account
        self.currency = currency
        self.file_name_prefix = file_name_prefix
        assert isinstance(skip_lines, int)
        self.skip_lines = skip_lines
        self.last4_map = last4_map or {}
        self.debug = debug
        self.dateutil_kwds = dateutil_kwds
        self.csv_dialect = csv_dialect
        self.narration_sep = narration_sep
        self.close_flag = close_flag

        # Reverse the key and value of the DRCR_dict.
        self.DRCR_dict = dict(
            zip(DRCR_dict.values(), DRCR_dict.keys())) if isinstance(DRCR_dict,
                                                                     dict) else {}
        self.assets_account = assets_account if isinstance(assets_account,
                                                           dict) else {}
        self.debit_account = debit_account if isinstance(debit_account,
                                                         dict) else {}
        self.credit_account = credit_account if isinstance(credit_account,
                                                           dict) else {}
        if DEFAULT not in self.assets_account:
            self.assets_account[DEFAULT] = self.default_account
        if DEFAULT not in self.debit_account:
            self.debit_account[DEFAULT] = self.default_account
        if DEFAULT not in self.credit_account:
            self.credit_account[DEFAULT] = self.default_account

        # FIXME: This probably belongs to a mixin, not here.
        self.institution = institution
        self.categorizer = categorizer

    def name(self):
        """Generate an importer name printed out.

        This method provides a unique id for each importer instance. It’s
        convenient to be able to refer to your importers with a unique name;
        it gets printed out by the identification process, for instance.

        Returns:
            A name str.
        """
        return '{}: "{}"'.format(super().name(), self.file_account(None))

    def identify(self, file):
        """Whether the importer can handle the given file.
        
        This method just returns true if this importer can handle the given
        file. You must implement this method, and all the tools invoke it to
        figure out the list of (file, importer) pairs. This function is used
        by bean-identity and bean-extract tools.
        
        Returns:
            A bool to identity whether or not.
        """
        if file.mimetype() != 'text/csv':
            return False
        if not os.path.basename(file.name).startswith(self.file_name_prefix):
            return False

        iconfig, has_header = normalize_config(self.config, file.head(-1),
                                               self.skip_lines)
        if len(iconfig) != len(self.config):
            return False
        return True

    def file_account(self, _):
        """Provide the root account.
        
        This method returns the root account associated with this importer.
        This is where the downloaded file will be moved by the filing script.
        This function is used by bean-file tool.
        
        Returns:
            A root acount name str.
        """
        return self.default_account

    def file_name(self, file):
        """Rename the given file.
        
         It’s most convenient not to bother renaming downloaded files.
         Oftentimes, the files generated from your bank either all have a
         unique name and they end up getting renamed by your browser when you
         download multiple ones and the names collide. This function is used
         for the importer to provide a “nice” name to file the download under.
        
        Returns:
            A new file name str.
        """

        filename = path.splitext(path.basename(file.name))[0]
        if self.institution:
            filename = '{}.{}'.format(self.institution, filename)
        return '{}.csv'.format(filename)

    def file_date(self, file):
        """Get the maximum date from the file.
        
        If a date can be extracted from the statement’s contents, return it
        here. This is useful for dated PDF statements… it’s often possible
        using regular expressions to grep out the date from a PDF converted to
        text. This allows the filing script to prepend a relevant date instead
        of using the date when the file was downloaded (the default).
        
        """
        iconfig, has_header = normalize_config(self.config, file.head(-1),
                                               self.skip_lines)
        if Col.DATE in iconfig:
            reader = iter(csv.reader(open(file.name)))
            for _ in range(self.skip_lines):
                next(reader)
            if has_header:
                next(reader)
            max_date = None
            for row in reader:
                if not row:
                    continue
                if row[0].startswith('#'):
                    continue
                date_str = row[iconfig[Col.DATE]]
                date = parse_date_liberally(date_str, self.dateutil_kwds)
                if max_date is None or date > max_date:
                    max_date = date
            return max_date

    def extract(self, file):
        """Parse and extract Beanount contents from the given file.
        
        This is called to attempt to extract some Beancount directives from the
        file contents. It must create the directives by instantiating the
        objects defined in beancount.core.data and return them. This function
        is used by bean-extract tool.

        Returns:
            A list of beancount.core.data object, and each of them can be
            converted into a command-line accounting.
        """
        entries = []

        # Normalize the configuration to fetch by index.
        iconfig, has_header = normalize_config(self.config, file.head(-1),
                                               self.skip_lines)

        reader = iter(csv.reader(open(file.name), dialect=self.csv_dialect))

        # Skip garbage lines
        for _ in range(self.skip_lines):
            next(reader)

        # Skip header, if one was detected.
        if has_header:
            next(reader)

        def get(row, ftype):
            try:
                return row[iconfig[ftype]] if ftype in iconfig else None
            except IndexError:  # FIXME: this should not happen
                return None

        # Parse all the transactions.
        first_row = last_row = None
        for index, row in enumerate(reader, 1):
            if not row:
                continue
            if row[0].startswith('#'):
                continue
            if row[0].startswith("-----------"):
                break

            # If debugging, print out the rows.
            if self.debug:
                print(row)

            if first_row is None:
                first_row = row
            last_row = row

            # Extract the data we need from the row, based on the configuration.
            status = get(row, Col.STATUS)
            # When the status is CLOSED, the transaction where money had not been paid should be ignored.
            if isinstance(status, str) and status == self.close_flag:
                continue

            # Distinguish debit or credit
            DRCR_status = get_debit_or_credit_status(iconfig, row,
                                                     self.DRCR_dict)

            date = get(row, Col.DATE)
            txn_date = get(row, Col.TXN_DATE)
            txn_time = get(row, Col.TXN_TIME)

            account = get(row, Col.ACCOUNT)
            tx_type = get(row, Col.TYPE)
            tx_type = tx_type or ""

            payee = get(row, Col.PAYEE)
            if payee:
                payee = payee.strip()

            fields = filter(None, [get(row, field)
                                   for field in (Col.NARRATION1,
                                                 Col.NARRATION2)])
            narration = self.narration_sep.join(
                field.strip() for field in fields)

            remark = get(row, Col.REMARK)

            tag = get(row, Col.TAG)
            tags = {tag} if tag is not None else data.EMPTY_SET

            last4 = get(row, Col.LAST4)

            balance = get(row, Col.BALANCE)

            # Create a transaction
            meta = data.new_metadata(file.name, index)
            if txn_date is not None:
                meta['date'] = parse_date_liberally(txn_date,
                                                    self.dateutil_kwds)
            if txn_time is not None:
                meta['time'] = str(dateutil.parser.parse(txn_time).time())
            if balance is not None:
                meta['balance'] = D(balance)
            if last4:
                last4_friendly = self.last4_map.get(last4.strip())
                meta['card'] = last4_friendly if last4_friendly else last4
            date = parse_date_liberally(date, self.dateutil_kwds)
            # flag = flags.FLAG_WARNING if DRCR_status == Debit_or_credit.UNCERTAINTY else self.FLAG
            txn = data.Transaction(
                meta,
                date,
                self.FLAG,
                payee,
                "{}({})".format(narration, remark),
                tags,
                data.EMPTY_SET,
                []
            )

            # Attach one posting to the transaction
            amount_debit, amount_credit = get_amounts(iconfig, row, DRCR_status)

            # Skip empty transactions
            if amount_debit is None and amount_credit is None:
                continue

            for amount in [amount_debit, amount_credit]:
                if amount is None:
                    continue
                units = Amount(amount, self.currency)

                # Uncertain transaction, maybe capital turnover
                if DRCR_status == Drcr.UNCERTAINTY:
                    if remark and len(remark.split("-")) == 2:
                        remarks = remark.split("-")
                        primary_account = mapping_account(self.assets_account,
                                                          remarks[1])
                        secondary_account = mapping_account(self.assets_account,
                                                            remarks[0])
                        txn.postings.append(
                            data.Posting(primary_account, -units, None, None,
                                         None, None))
                        txn.postings.append(
                            data.Posting(secondary_account, None, None, None,
                                         None, None))
                    else:
                        txn.postings.append(
                            data.Posting(self.default_account, units, None,
                                         None, None, None))


                # Debit or Credit transaction
                else:
                    # Primary posting
                    # Rename primary account if remark field matches one of assets account
                    primary_account = mapping_account(self.assets_account,
                                                      remark)
                    txn.postings.append(
                        data.Posting(primary_account, units, None, None, None,
                                     None))

                    # Secondary posting
                    # Rename secondary account by credit account or debit account based on DRCR status
                    payee_narration = payee + narration
                    _account = self.credit_account if DRCR_status == Drcr.CREDIT else self.debit_account
                    secondary_account = mapping_account(_account,
                                                        payee_narration)
                    #                    secondary_account = _account[DEFAULT]
                    #                    for key in _account.keys():
                    #                        if key == DEFAULT:
                    #                            continue
                    #                        if re.search(key, payee_narration):
                    #                            secondary_account = _account[key]
                    #                            break
                    txn.postings.append(
                        data.Posting(secondary_account, None, None, None, None,
                                     None))

            # Attach the other posting(s) to the transaction.
            if isinstance(self.categorizer, collections.Callable):
                txn = self.categorizer(txn)

            # Add the transaction to the output list
            entries.append(txn)

        # Figure out if the file is in ascending or descending order.
        first_date = parse_date_liberally(get(first_row, Col.DATE),
                                          self.dateutil_kwds)
        last_date = parse_date_liberally(get(last_row, Col.DATE),
                                         self.dateutil_kwds)
        is_ascending = first_date < last_date

        # Reverse the list if the file is in descending order
        if not is_ascending:
            entries = list(reversed(entries))

        # Add a balance entry if possible
        if Col.BALANCE in iconfig and entries:
            entry = entries[-1]
            date = entry.date + datetime.timedelta(days=1)
            balance = entry.meta.get('balance', None)
            if balance:
                meta = data.new_metadata(file.name, index)
                entries.append(
                    data.Balance(meta, date,
                                 self.default_account,
                                 Amount(balance, self.currency),
                                 None, None))

        # Remove the 'balance' metadta.
        for entry in entries:
            entry.meta.pop('balance', None)

        return entries


def normalize_config(config, head, skip_lines: int = 0):
    """Using the header line, convert the configuration field name lookups to int indexes.

    Args:
      config: A dict of Col types to string or indexes.
      head: A string, some decent number of bytes of the head of the file.
      skip_lines: Skip first x (garbage) lines of file.
    Returns:
      A pair of
        A dict of Col types to integer indexes of the fields, and
        a boolean, true if the file has a header.
    Raises:
      ValueError: If there is no header and the configuration does not consist
        entirely of integer indexes.
    """
    assert isinstance(skip_lines, int)
    assert skip_lines >= 0
    for _ in range(skip_lines):
        head = head[head.find("\n") + 1:]

    strip_blank(head)
    has_header = csv.Sniffer().has_header(head)
    if has_header:
        header = next(csv.reader(io.StringIO(head)))
        field_map = {field_name.strip(): index
                     for index, field_name in enumerate(header)}
        index_config = {}
        for field_type, field in config.items():
            if isinstance(field, str):
                try:
                    field = field_map[field]
                except KeyError as e:
                    print(e)
                    break
            index_config[field_type] = field
    else:
        if any(not isinstance(field, int)
               for field_type, field in config.items()):
            raise ValueError("CSV config without header has non-index fields: "
                             "{}".format(config))
        index_config = config
    return index_config, has_header


def mapping_account(account_map, keyword):
    """Finding which key of account_map contains the keyword, return the corresponding value.

    Args:
      account_map: A dict of account keywords string (each keyword separated by "|") to account name.
      keyword: A keyword string.
    Return:
      An account name string.
    Raises:
      KeyError: If "DEFAULT" keyword is not in account_map.
    """
    if DEFAULT not in account_map:
        raise KeyError("DEFAULT is not in " + account_map.__str__)
    account_name = account_map[DEFAULT]
    for account_keywords in account_map.keys():
        if account_keywords == DEFAULT:
            continue
        if re.search(account_keywords, keyword):
            account_name = account_map[account_keywords]
            break
    return account_name
```


然后创建 `config.py` 如下：

```
#!/usr/bin/env python3
import sys

from beancount.core.data import Transaction

sys.path.append("./importers")
from importers.beanmaker import Drcr, Col, Importer

# Col为枚举类型，预定义了每笔交易记录所需要的内容，_config_alipay负责定义枚举内容与csv表头之间的对应关系

_config_alipay = {
    Col.DATE: "交易创建时间",
    Col.PAYEE: "交易对方",
    Col.NARRATION: "商品名称",
    Col.REMARK: "备注",
    Col.AMOUNT: "金额（元）",
    Col.DRCR: "收/支",
    Col.STATUS: "资金状态",
    Col.TXN_TIME: "交易创建时间",
    Col.TXN_DATE: "交易创建时间",
    Col.TYPE: "类型",
}

_config_wechat = {
    Col.DATE: "交易时间",
    Col.PAYEE: "交易对方",
    Col.NARRATION: "商品",
    Col.REMARK: "支付方式",
    Col.AMOUNT: "金额(元)",
    Col.DRCR: "收/支",
    Col.STATUS: "当前状态",
    Col.TXN_TIME: "交易时间",
    Col.TXN_DATE: "交易时间",
    Col.TYPE: "交易类型",
}

# _default_account负责定义默认账户
_default_account_alipay = "Assets:Alipay:Balance"

_default_account_wechat = "Assets:WeChat:Balance"

_default_account_comm = "Liabilities:CreditCard:BOC:CN"

# _currency定义货币单位
_currency = "CNY"

# Debit_or_credit也是枚举类型，预定义了支出和收入两类，_DRCR_dict负责定义这两类与csv中能够表明该状态的文本之间的对应关系
_DRCR_dict = {
    Drcr.DEBIT: "支出",
    Drcr.CREDIT: "收入"
}

common_assets_account = {
    "交通银行|2222": "Liabilities:CreditCard:BOC"
}

# _assets_account负责保存账户信息，key为手工对账时在备注中输入的关键词；
# 关键词中，"DEFAULT"为非必选项，不提供时将以"_default_account_xxx"的属性值作为"DEFAULT"对应的值；
# 多个关键词用竖线分割，只要备注中出现该关键词，就把该交易分类到对应账户下。
_wechat_assets_account = {
    "DEFAULT": "Assets:WeChat:Balance",
    "招行信用卡|0000": "Liabilities:CreditCard:CMB",
    "招商银行": "Assets:DebitCard:CMB",
    "交通信用卡银行|2222": "Liabilities:CreditCard:BOC:CN",
    "中信银行": "Liabilities:CreditCard:CITIC",
    "汇丰银行": "Liabilities:CreditCard:HSBC:CN",
    "支付宝": "Assets:VirtualCard:Alipay",
    "余额宝": "Assets:MoneyFund:Yuebao",
    "零钱|微信": "Assets:WeChat:Balance"
}
_wechat_assets_account.update(common_assets_account)

# _debit_account负责保存支出账户信息，key为与该账户相关的关键词；
# 关键词中，"DEFAULT"为非必选项，不提供时将以"_default_account_xxx"的属性值作为"DEFAULT"对应的值；
# 多个关键词用竖线分割，只要当交易为“支出”，且交易对方名称和商品名称中出现该关键词，就把该交易分类为对应支出。
_debit_account = {
    "DEFAULT": "Expenses:Food:Other",
    "iCloud|腾讯云|阿里云|Plex": "Expenses:Fun:Subscription",
    "滴滴|司机": "Expenses:Transport:Taxi",
    "天和亿|单车": "Expenses:Transport:Bike",
    "中国铁路": "Expenses:Transport:Railway",
    "卡表充值|燃气": "Expenses:House:Gas",
    "友宝|芬达|雪碧|可乐|送水|怡宝|饮料|美年达|售货机": "Expenses:Food:Drinks",
    "水果": "Expenses:Food:Fruits",
    "买菜|叮咚|美团买菜": "Expenses:Food:Cooking",
    "泰餐": "Expenses:Food:Restaurant",
    "App Store|Steam|会员": "Expenses:Fun:Software",
    "全时|华联|家乐福|超市|红旗|WOWO|百货|伊藤|永旺|全家": "Expenses:Daily:Commodity",
    "汽车票|蒜芽信息科技|优步|火车|动车|空铁无忧网|滴滴|汽车|运输|机场|航空|机票|高铁|出行|车费|打车": "Expenses:Travel",
    "捐赠": "Expenses:PublicWelfare",
    "话费|流量|手机|中国移动": "Expenses:Daily:PhoneCharge",
    "电影|大麦网|演出|淘票票": "Expenses:Fun:Amusement",
    "地铁|轨道交通": "Expenses:Transport:Public",
    "青桔|骑安": "Expenses:Transport:Bike",
    "衣|裤|鞋": "Expenses:Dressup:Clothing",
    "造型|美发|理发": "Expenses:Dressup:Hair",
    "化妆品": "Expenses:Dressup:Cosmetic",
    "医院|药房": "Expenses:Health:Hospital",
    "酒店|airbnb": "Expenses:Travel:Hotel",
    "机票|高铁|票务|特快|火车票|飞机票": "Expenses:Travel:Fare",
    "借款": "Assets:Receivables",
    "蚂蚁财富": "Assets:MoneyFund:BondFund",
    '签证': "Expenses:Travel:Visa",
    "门票": "Expenses:Travel:Ticket",
    "gopro|键盘|电脑|手机|SD卡|相机|MacBook|boox|ipad|apple|oneplus": "Expenses:Digital",
    "快递": "Expenses:Daily",
    'PLAYSTATION': "Expenses:Fun:Game",
}

# _credit_account负责保存收入账户信息，key为与该账户相关的关键词
# 关键词中，"DEFAULT"为非必选项，不提供时将以"_default_account_xxx"的属性值作为"DEFAULT"对应的值；
# 多个关键词用竖线分割，只要当交易为“收入”，且交易对方名称和商品名称中出现该关键词，就把该交易分类为对应收入。
_credit_account = {"DEFAULT": "Income:RedPacket", "借款": "Assets:Receivables"}

wechat_config = Importer(
    config=_config_wechat,
    default_account=_default_account_wechat,
    currency=_currency,
    file_name_prefix='微信支付账单',
    skip_lines=0,
    DRCR_dict=_DRCR_dict,
    assets_account=_wechat_assets_account,
    debit_account=_debit_account,
    credit_account=_credit_account
)

_alipay_assets_account = {
    "DEFAULT": "Assets:Alipay:Balance",
    "花呗": "Liabilities:VirtualCard:Huabei",
}
_alipay_assets_account.update(common_assets_account)

alipay_config = Importer(
    config=_config_alipay,
    default_account=_default_account_alipay,
    currency=_currency,
    file_name_prefix='alipay_record',
    skip_lines=0,
    DRCR_dict=_DRCR_dict,
    assets_account=_alipay_assets_account,
    debit_account=_debit_account,
    credit_account=_credit_account
)

_comm_assets_account = {
    "DEFAULT": "Liabilities:CreditCard:BOC:CN"
}
_comm_assets_account.update(common_assets_account)

from beancount.ingest.importers import csv

# 信用卡
_config_com = {
    csv.Col.DATE: "记账日期",
    csv.Col.PAYEE: "交易说明",
    csv.Col.NARRATION: "交易说明",
    csv.Col.AMOUNT_DEBIT: "交易金额",
    csv.Col.TXN_DATE: "交易日期",
    csv.Col.LAST4: "卡末四位",
}


def comm_categorizer(txn: Transaction):
    # At this time the txn has only one posting
    try:
        posting1 = txn.postings[0]
    except IndexError:
        return txn

    from importers.beanmaker import mapping_account
    account_name = mapping_account(_debit_account, txn.narration)

    posting2 = posting1._replace(
        account=account_name,
        units=-posting1.units
    )
    # Insert / Append the posting into the transaction
    if posting1.units < posting2.units:
        txn.postings.append(posting2)
    else:
        txn.postings.insert(0, posting2)

    return txn


comm_config = csv.Importer(
    config=_config_com,
    account=_default_account_comm,
    currency=_currency,
    last4_map={"2222": "优逸白"},
    categorizer=comm_categorizer
)

CONFIG = [
    wechat_config,
    alipay_config,
    comm_config,
]
```

文件结构：

```
├── README.md
├── account
│   ├── assets.bean
│   ├── crypto.bean
│   ├── equity.bean
│   ├── expenses.bean
│   ├── income.bean
│   ├── liabilities.bean
│   ├── securities.bean
│   └── vesting.bean
├── beans
│   ├── 2020.bean
│   ├── 2021
│   │   ├── 01.bean
│   │   ├── 02.bean
│   │   ├── 03.bean
│   │   └── 04.bean
│   ├── 2021.bean
│   ├── alipay_record_20190101_20191231.bean
│   ├── alipay_record_20200101_20201231.bean
│   ├── assets-broker.bean
│   ├── comm-2021.01.bean
│   ├── comm-2021.02.bean
│   ├── comm-2021.03.bean
│   ├── 微信支付账单(20200701-20200930).bean
│   └── 微信支付账单(20201001-20201231).bean
├── config.py
├── datas
│   ├── alipay_record_20190101_20191231.csv
│   ├── alipay_record_20200101_20201231.csv
│   ├── comm-2021.01.csv
│   ├── comm-2021.02.csv
│   ├── comm-2021.03.csv
│   ├── 微信支付账单(20200701-20200930).csv
│   └── 微信支付账单(20201001-20201231).csv
├── importers
│   └── beanmaker.py
├── main.bean
├── processing.sh
├── requirements.txt
└── strip_blank.py
```

其中，`account` 目录是定义了各类的账户，下面的账单整理主要涉及的目录是 `datas` 和 `beans` 目录。我将账单的原始文件放在 `datas` 目录中，而 `beans` 则存放处理过后的 bean 文件。



## 微信账单的导入 Beancount
微信的账单可以通过，钱包 -> 账单 -> 常见问题 -> 账单下载导出，但是需要注意的是，每次导出只能跨 3 个月。导出的账单会发送到邮箱中。账单格式是 CSV。在邮件附件中下载的压缩包需要密码，解压的密码会通过官方的账号发送到微信通知。

解压之后会得到如下格式的文件：

```
微信支付账单明细,,,,,,,,
微信昵称：[xxx],,,,,,,,
起始时间：[2018-01-01 00:00:00] 终止时间：[2018-03-31 23:59:59],,,,,,,,
导出类型：[全部],,,,,,,,
导出时间：[2020-02-28 12:59:49],,,,,,,,
,,,,,,,,
共207笔记录,,,,,,,,
收入：137笔 xxxx.34元,,,,,,,,
支出：66笔 xxxx.60元,,,,,,,,
中性交易：4笔 xxxx.13元,,,,,,,,
注：,,,,,,,,
1. 充值/提现/理财通购买/零钱通存取/信用卡还款等交易，将计入中性交易,,,,,,,,
2. 本明细仅展示当前账单中的交易，不包括已删除的记录,,,,,,,,
3. 本明细仅供个人对账使用,,,,,,,,
,,,,,,,,
----------------------微信支付账单明细列表--------------------,,,,,,,,
交易时间,交易类型,交易对方,商品,收/支,金额(元),支付方式,当前状态,交易单号,商户单号,备注
2018-03-31 21:35:09,微信红包,/,"/",支出,¥100.00,零钱,支付成功,1000039501180331000xxxxxxxxxxxxxxxxx	,10000395012018033xxxxxxxxxxxxxx	,"/"
```

可以看到前16行都是一些注释信息，并不是正式的交易数据。真正的交易数据从 17 行开始。有这样一份数据就可以使用脚本到入成 Beancount 文件。

Vim 下将文件格式转换成 UTF-8 避免不必要的麻烦：

    :set fileencoding=utf-8
    :w

## 支付宝账单的导入 Beancount
支付宝的账单可以通过网页端，在[我的账单](https://consumeprod.alipay.com/record/standard.htm)页面选择时间范围，单次跨度不能超过 1 年，然后在页面底部点击「下载查询结果」，导出的格式为 CSV 格式。


```
支付宝交易记录明细查询
账号:[xxxxxxxx@xxxxx.com]
起始日期:[2019-01-01 00:00:00]    终止日期:[2020-01-01 00:00:00]
---------------------------------交易记录明细列表------------------------------------
交易号                  ,商家订单号               ,交易创建时间              ,付款时间                ,最近修改时间              ,交易来源地     ,类型              ,交易对方            ,商品名称                ,金额（元）   ,收/支     ,交易状态    ,服务费（元）   ,成功退款（元）  ,备注                  ,资金状态     ,
2019123122001456xxxxxxxxxxxx	,M201912317xxxxxxx   	,2019-12-31 13:26:28 ,2019-12-31 13:26:29 ,2019-12-31 13:26:29 ,其他（包括阿里巴巴和外部商家）,即时到账交易          ,中国铁路网络有限公司      ,火车票                 ,493.50  ,支出      ,交易成功    ,0.00     ,0.00     ,                    ,已支出      ,
20191231343073829431 	,                    	,2019-12-31 05:39:17 ,                    ,2019-12-31 05:39:17 ,支付宝网站     ,即时到账交易          ,博时基金管理有限公司      ,余额宝-2019.12.30-收益发放 ,2.83    ,        ,交易成功    ,0.00     ,0.00     ,                    ,已收入      ,
```

## 京东账单导出及导入 Beancount
京东不提供历史交易记录的导出，这就使得我们得从京东后台的我的订单中手动的将账单导出。

受到 [zsxsoft](https://github.com/zsxsoft/my-beancount-scripts/) 使用 userscript 脚本的启发。经过一定的修改

- [导出京东账单到 Beancount](https://github.com/einverne/userscripts/tree/master/jd-beancount)

到订单页面直接在浏览器自动生成 Beancount，粘贴即可。


## reference

- [个人 Beancount 模板](https://github.com/einverne/beancount-sample)