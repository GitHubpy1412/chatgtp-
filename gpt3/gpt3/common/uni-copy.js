"use strict";
var common_vendor = require("./vendor.js");
function uniCopy({ content, success, error }) {
  if (!content)
    return error("\u590D\u5236\u7684\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A !");
  content = typeof content === "string" ? content : content.toString();
  common_vendor.index.setClipboardData({
    data: content,
    success: function() {
      success("\u590D\u5236\u6210\u529F~");
      console.log("success");
    },
    fail: function() {
      success("\u590D\u5236\u5931\u8D25~");
    }
  });
}
exports.uniCopy = uniCopy;
