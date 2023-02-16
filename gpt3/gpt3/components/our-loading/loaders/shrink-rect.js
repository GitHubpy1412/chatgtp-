"use strict";
var common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "shrinkRect",
  props: {
    color: String,
    size: Number
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.color,
    b: $props.color,
    c: $props.color,
    d: $props.color,
    e: $props.color,
    f: $props.size + 20 + "px",
    g: $props.size + 20 + "px"
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-13f20dcc"], ["__file", "F:/VUEobj/wxchat1/components/our-loading/loaders/shrink-rect.vue"]]);
wx.createComponent(Component);
