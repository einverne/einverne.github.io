(function($){
  /* add _blank to each link */
  $(document).ready(function() {
    $('a[href]').each(function() {
      if (this.href.indexOf(window.location.host) == -1 && !$(this).hasClass("fancybox")){
        $(this).attr({target: '_blank' });
      }
    });
    $("iframe[src*='youtube.com']").wrap('<div class="videowrapper" />');
		anchors.options = {
			visible: 'always',
			icon: '¶'
		}
		anchors.add('.post-content h2, .post-content h3');
  });

  /* site search */
  $(document).ready(function() {
    var entries = null;
    function htmlEscape(s) {
      return String(s).replace(/[&<>"'\/]/g, function(s) {
        var entityMap = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': '&quot;',
          "'": '&#39;',
          "/": '&#x2F;'
        };
        return entityMap[s];
      });
    }
    function xmlDateToJavascriptDate(xmlDate) {
      var re = /^([0-9]{4,})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(\.[0-9]+)?(Z|([+-])([0-9]{2}):([0-9]{2}))?$/;
      var match = xmlDate.match(re);
      if (!match)
      return null;
      var all = match[0];
      var year = match[1];  var month = match[2];  var day = match[3];
      var hour = match[4];  var minute = match[5]; var second = match[6];
      var milli = match[7];
      var z_or_offset = match[8];  var offset_sign = match[9];
      var offset_hour = match[10]; var offset_minute = match[11];
      if (offset_sign) {
        var direction = (offset_sign == "+" ? 1 : -1);
        hour =   parseInt(hour)   + parseInt(offset_hour)   * direction;
        minute = parseInt(minute) + parseInt(offset_minute) * direction;
      }
      month = parseInt(month) - 1;
      var utcDate = Date.UTC(year, month, day, hour, minute, second, (milli || 0));
      return new Date(utcDate);
    }
    function formatDate(date) {
      return date.getFullYear()+"-"+ (date.getMonth()+1)+ '-' + date.getDate();
    }
    function findEntries(q) {
      var matches = [];
      var rq = new RegExp(q, 'im');
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var title = $(entry.getElementsByTagName('title')[0]).text();
        var link = $(entry.getElementsByTagName('link')[0]).attr('href');
        //var title_en = rl.exec(link)[1].replace(/-/g, ' ');
        var content = $(entry.getElementsByTagName('content')[0]).text();
        //if (rq.test(title) || rq.test(title_en) || rq.test(content)) {
        if (rq.test(title) || rq.test(content)) {
          var updated = formatDate(xmlDateToJavascriptDate($(entry.getElementsByTagName('updated')[0]).text()));
          matches.push({'title': title, 'link': link, 'date': updated, 'content': content});
        }
      }
      var html = '<h2>Search Result</h2>';
      for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        html += '<h3 class="title"><a href="' + match.link + '">' + htmlEscape(match.title) + '</a></h3>';
        html += '<section><p>' + htmlEscape(match.content) + '</p></section>';
        html += '<p>Update: ' + match.date + '</p>';
      }
      $('.searchresult').html(html);
      $('#search-loader').hide();
      $('.searchresult').show();
      }
      $('#search-form').submit(function() {
        var query = $('#query').val();
        //$('#query');.blur().attr('disabled', true);
        $('.searchresult').hide();
        $('#search-loader').append('<img src="/assets/themes/evjekylltheme/loading.gif" alt="loading">').show();
        if (entries == null) {
          $.ajax({url: '/search.xml?r=' + (Math.random() * 99999999999), dataType: 'xml', success: function(data) {
            entries = data.getElementsByTagName('entry');
            findEntries(query);
          }});
        } else {
          findEntries(query);
        }
        $('#query').blur().attr('disabled', false);
        return false;
      });

    });


  /* loading.png */
  (function() {
    LoadingImage = function(el, options){
      var self = this,
      img = el.children[0];
      this.interval = options.interval || 10;
      this.diameter = options.diameter || img.width;
      this.count = 0;
      this.el = el;
      img.setAttribute("style", "position:absolute");
      el.style.width = this.diameter+"px";
      el.style.height = this.diameter+"px";
      return this;
    };
    LoadingImage.prototype.start = function(){
      var self = this,
      count = 0,
      img = this.el.children[0];
      this.el.display = "block";
      self.loop = setInterval(function(){
        if(count == 19){
          count = 0;
        }
        img.style.top = (-self.diameter*count)+"px";
        count++;
      }, this.interval);
    };
    LoadingImage.prototype.stop = function(){
      clearInterval(this.loop);
      this.el.style.display = "none";
    };
    document.LoadingImage = LoadingImage;
  })();

  $(document).ready(function(){
    $(".loading").each(function(i){
      var s = new LoadingImage(this, {
        interval:50
      });
      s.start();
    });
  });

  // Function to resize Bilibili iframes
  function resizeBilibiliIframes() {
    const iframes = document.querySelectorAll('iframe[src*="player.bilibili.com"]');

    iframes.forEach(iframe => {
      const parent = iframe.parentElement;
      const parentWidth = parent.clientWidth;
      const aspectRatio = 16 / 9; // Assuming 16:9 aspect ratio for videos

      const newHeight = parentWidth / aspectRatio;

      iframe.style.width = '100%';
      iframe.style.height = `${newHeight}px`;

      // Append '&autoplay=0' to the src if it's not already present
      if (!iframe.src.includes('autoplay=0')) {
        iframe.src += (iframe.src.includes('?') ? '&' : '?') + 'autoplay=0';
      }

      // Append '&high_quality=1' to the src if it's not already present
      if (!iframe.src.includes('high_quality=1')) {
        iframe.src += (iframe.src.includes('?') ? '&' : '?') + 'high_quality=1';
      }

      // Add 'allowfullscreen' attribute to the iframe
      iframe.setAttribute('allowfullscreen', 'true');
    });
  }

// Run the function on page load
  window.addEventListener('load', resizeBilibiliIframes);

// Run the function on window resize
  window.addEventListener('resize', resizeBilibiliIframes);

// MutationObserver to handle dynamically added iframes
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        resizeBilibiliIframes();
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

})(jQuery);
