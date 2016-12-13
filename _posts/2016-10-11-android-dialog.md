---
layout: post
title: "Android 提醒"
tagline: ""
description: "Android 对话框使用"
category: 学习笔记
tags: [Android, AndroidDev,]
last_updated: 
---

Android 对话框

实现对话框通常有三种方式：

- 使用 Dialog 类，或者其派生类
	每个类被用来提供特定功能，比如日期选择，单选等等
- 对话框主题的 Activity
	可以将对话框主题应用到 Activity 上，使 Activity 外观类似于对话框
- Toast
	特殊的，短暂的，非模态的消息对话，通常在 Broadcast Receiver 和 Service 中使用，来提示用户响应事件

以下重点考虑 Dialog 类的使用，其派生子类 DatePickerDialog，TimePickerDialog 以后扩展开讲。响应代码可以参考[此次](https://github.com/einverne/gravity-circle/commit/4e5bf18c657f4123728ff1405982ba0ae76759cb) 提交。

## 最常见的对话框 `AlertDialog`

    private void showNormalDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Title");
        builder.setMessage("your message here.");
        builder.setCancelable(true);

        /**
        * Typically, a dialog is dismissed when its job is finished
        * and it is being removed from the screen.
        * A dialog is canceled when the user wants to escape the dialog
        * and presses the Back button.
        * For example, you have a standard Yes/No dialog on the screen.
        * If the user clicks No, then the dialog is dismissed
        * and the value for No is returned to the caller.
        * If instead of choosing Yes or No, the user clicks Back to escape the dialog
        * rather than make a choice then the dialog is canceled
        * and no value is returned to the caller.
        */
        builder.setPositiveButton(
                "Yes",
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        Toast.makeText(DialogTestActivity.this, "Yes", Toast.LENGTH_SHORT).show();
                        dialog.dismiss();

                    }
                });

        builder.setNegativeButton(
                "No",
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        Toast.makeText(DialogTestActivity.this, "No", Toast.LENGTH_SHORT).show();
                        dialog.dismiss();
                    }
                });

        AlertDialog alert = builder.create();
        alert.show();
    }

## 三选对话框

    private void showThreeOptionsDialog() {
        Dialog dialog = new AlertDialog.Builder(this)
                .setIcon(android.R.drawable.btn_star)
                .setTitle("喜好调查")
                .setMessage("你喜欢李连杰的电影吗？")
                .setPositiveButton("很喜欢", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Toast.makeText(DialogTestActivity.this, "我很喜欢他的电影。",
                                Toast.LENGTH_LONG).show();
                    }
                })
                .setNegativeButton("不喜欢", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Toast.makeText(DialogTestActivity.this, "我不喜欢他的电影。", Toast.LENGTH_LONG).show();
                    }
                })
                .setNeutralButton("一般", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Toast.makeText(DialogTestActivity.this, "谈不上喜欢不喜欢。", Toast.LENGTH_LONG).show();
                    }
                }).create();
        dialog.show();
    }

## 带输入框的对话框

    private void showInputDialog() {
        final EditText editText = new EditText(this);
        Dialog dialog = new AlertDialog.Builder(this)
                .setIcon(android.R.drawable.ic_dialog_info)
                .setTitle("Input your message")
                .setView(editText)
                .setPositiveButton("Sure", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        String inputString = editText.getText().toString();
                        Toast.makeText(DialogTestActivity.this, inputString, Toast.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("No", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                }).create();
        dialog.show();
    }

## 单选对话框

    private void showSingleChoiceDialog() {
        Dialog dialog = new AlertDialog.Builder(this)
                .setTitle("Single Choice")
                .setSingleChoiceItems(new String[]{"item1", "item2"}, 0, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Toast.makeText(DialogTestActivity.this, "" + which, Toast.LENGTH_SHORT).show();
                        dialog.dismiss();
                    }
                }).setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                }).create();
        dialog.show();
    }

## 复选对话框

    private void showMultiChoiceDialog() {
        Dialog dialog = new AlertDialog.Builder(this)
                .setTitle("Multi Choice")
                .setMultiChoiceItems(new String[]{"item0", "item1"}, new boolean[]{false, true}, new DialogInterface.OnMultiChoiceClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which, boolean isChecked) {

                        Toast.makeText(DialogTestActivity.this, "" + which + " " + isChecked, Toast.LENGTH_SHORT).show();
                    }
                }).create();
        dialog.show();
    }

## 自定义布局对话框

    private void showCustomDialog() {
        LayoutInflater inflater = getLayoutInflater();
        View layout = inflater.inflate(R.layout.dialog_custom, null);
        final EditText editText = (EditText) layout.findViewById(R.id.editText);
        Dialog dialog = new AlertDialog.Builder(this)
                .setTitle("Custom")
                .setView(layout)
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Toast.makeText(DialogTestActivity.this, editText.getText().toString() + " ", Toast.LENGTH_SHORT).show();
                    }
                }).create();
        dialog.show();
    }



## reference

- <https://developer.android.com/guide/topics/ui/dialogs.html>