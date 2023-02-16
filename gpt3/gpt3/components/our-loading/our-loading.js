"use strict";
var common_vendor = require("../../common/vendor.js");
const shrinkRect = () => "./loaders/shrink-rect.js";
const _sfc_main = {
  name: "ourLoading",
  components: {
    shrinkRect
  },
  props: {
    active: Boolean,
    translateY: {
      type: Number,
      default: 150
    },
    text: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "#333"
    },
    textColor: {
      type: String,
      default: "#333"
    },
    isFullScreen: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: "rgba(255, 255, 255, .9)"
    },
    size: {
      type: Number,
      default: 40
    }
  },
  data() {
    return {
      isActive: this.active || false
    };
  },
  watch: {
    active(value) {
      this.isActive = value;
    }
  }
};
if (!Array) {
  const _component_shrinkRect = common_vendor.resolveComponent("shrinkRect");
  _component_shrinkRect();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      color: $props.color,
      size: $props.size
    }),
    b: $props.text.length
  }, $props.text.length ? {
    c: common_vendor.t($props.text),
    d: $props.textColor
  } : {}, {
    e: `translate(-50%, -${$props.translateY}%)`,
    f: $data.isActive,
    g: $props.isFullScreen ? 1 : "",
    h: $props.backgroundColor
  });
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bbe81308"], ["__file", "F:/VUEobj/wxchat1/components/our-loading/our-loading.vue"]]);
wx.createComponent(Component);
