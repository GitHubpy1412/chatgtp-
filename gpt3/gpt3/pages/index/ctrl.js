"use strict";
var common_vendor = require("../../common/vendor.js");
var common_config = require("../../common/config.js");
const _sfc_main = {
  data() {
    return {
      adjinfo: "",
      manavx: "",
      addkeynum: "",
      openid: "",
      sup: 0,
      showlist: [],
      choicecoll: null,
      keystatu: 1,
      allusernum: 2,
      dayadduser: 3,
      allanswnum: 4,
      daynum: 0,
      sharenum: 0,
      sharemaxnum: 0,
      videonum: 0,
      videomaxnum: 0,
      isadj: false,
      addnumid: "",
      addnumcount: 0,
      keylist: []
    };
  },
  onLoad() {
    this.init();
    console.log("load");
    this.getuserinfo();
  },
  methods: {
    open() {
      console.log("pop");
      this.$refs.addkeypop.open("center");
    },
    close() {
      this.$refs.addkeypop.close("center");
    },
    adjset(e) {
      console.log(e.detail.value);
      this.isadj = e.detail.value;
    },
    init() {
      this.sup = 1;
    },
    wxcode() {
      let that = this;
      common_vendor.index.login({
        provider: "weixin",
        success: function(loginRes) {
          console.log(loginRes.code);
          let data = JSON.stringify({
            code: loginRes.code
          });
          common_vendor.index.request({
            url: common_config.config.apiurl + "/login",
            data,
            method: "POST",
            success: (res) => {
              console.log(res);
              that.openid = res.data.resmsg.openid;
              if (res.data.resmsg.openid == res.data.mana) {
                that.sup = 1;
              } else {
                common_vendor.index.navigateTo({
                  url: "/pages/index/index"
                });
              }
            },
            fail: (err) => {
              this.toast(err);
            }
          });
        }
      });
    },
    toast(msg) {
      common_vendor.index.showToast({
        title: msg,
        duration: 2e3,
        icon: "none"
      });
    },
    collchange(e) {
      console.log(e);
      switch (e) {
        case "0":
          console.log("\u53C2\u6570\u914D\u7F6E");
          this.getsetinfo();
          break;
        case "1":
          console.log("\u4F1A\u5458\u5145\u503C");
          break;
        case "2":
          console.log("key\u914D\u7F6E");
          this.getapilist();
          break;
        case "3":
          console.log("\u5E7F\u544A\u914D\u7F6E");
          this.getadjinfo();
          break;
      }
    },
    getadjinfo() {
      common_vendor.index.request({
        url: common_config.config.apiurl,
        method: "GET",
        success: (res) => {
          console.log(res);
          this.adjinfo = res.data.adj;
        }
      });
    },
    getuserinfo() {
      common_vendor.index.request({
        url: common_config.config.apiurl + "/userinfo",
        method: "GET",
        success: (res) => {
          console.log(res);
          this.allusernum = res.data.allusernum;
          this.dayadduser = res.data.dayadduser;
          this.allanswnum = res.data.allanswnum;
        },
        fail: (err) => {
          this.toast(err);
        }
      });
    },
    getsetinfo() {
      console.log("\u83B7\u53D6\u914D\u7F6E\u4FE1\u606F");
      common_vendor.index.request({
        url: common_config.config.apiurl + "/getsetinfo",
        method: "GET",
        success: (res) => {
          console.log(res);
          this.daynum = res.data.daynum;
          this.sharenum = res.data.sharenum;
          this.videonum = res.data.videonum;
          this.sharemaxnum = res.data.sharemaxnum;
          this.videomaxnum = res.data.videomaxnum;
          this.isadj = res.data.isadj;
          this.manavx = res.data.manavx;
        },
        fail: (err) => {
          this.toast(err);
        }
      });
    },
    setenter() {
      console.log("\u83B7\u53D6\u914D\u7F6E\u4FE1\u606F");
      let data = JSON.stringify({
        daynum: this.daynum,
        sharenum: this.sharenum,
        videonum: this.videonum,
        sharemaxnum: this.sharemaxnum,
        videomaxnum: this.videomaxnum,
        isadj: this.isadj,
        manavx: this.manavx
      });
      common_vendor.index.request({
        url: common_config.config.apiurl + "/setinfo",
        data,
        method: "POST",
        success: (res) => {
          console.log(res);
          this.daynum = res.data.daynum;
          this.sharenum = res.data.sharenum;
          this.videonum = res.data.videonum;
          this.sharemaxnum = res.data.sharemaxnum;
          this.videomaxnum = res.data.videomaxnum;
          this.isadj = res.data.isadj;
          this.manavx = res.data.manavx;
          if (res.data.code == 200) {
            this.toast("\u4FEE\u6539\u6210\u529F");
            this.choicecoll = "";
          }
        },
        fail: (err) => {
          this.toast(err);
        }
      });
    },
    enteraddnum() {
      let that = this;
      common_vendor.index.login({
        provider: "weixin",
        success: function(loginRes) {
          console.log(loginRes.code);
          let data = JSON.stringify({
            code: loginRes.code,
            userid: that.addnumid,
            num: that.addnumcount
          });
          common_vendor.index.request({
            url: common_config.config.apiurl + "/manaaddnum",
            data,
            method: "POST",
            success: (res) => {
              if (res.data.code == 200) {
                console.log(res.data);
                that.toast("\u5145\u503C\u6210\u529F\uFF0C\u6B21\u6570\uFF1A" + res.data.num);
              }
            }
          });
        }
      });
    },
    editadjinfo() {
      let that = this;
      common_vendor.index.login({
        provider: "weixin",
        success: function(loginRes) {
          console.log(loginRes.code);
          let data = JSON.stringify({
            code: loginRes.code,
            adjinfo: that.adjinfo
          });
          common_vendor.index.request({
            url: common_config.config.apiurl + "/setadj",
            data,
            method: "POST",
            success: (res) => {
              if (res.data.code == 200) {
                console.log(res.data);
                that.toast("\u5E7F\u544A\u8BBE\u7F6E\u6210\u529F");
              }
            }
          });
        }
      });
    },
    getapilist() {
      common_vendor.index.request({
        url: common_config.config.apiurl + "/getapilist",
        method: "GET",
        success: (res) => {
          console.log(res);
          this.keylist = res.data.apilist;
        },
        fail: (err) => {
          this.toast(err);
        }
      });
    },
    addkey() {
      this.open();
    },
    apikeyadd() {
      let data = JSON.stringify({
        apikey: this.addkeynum
      });
      common_vendor.index.request({
        url: common_config.config.apiurl + "/editapi",
        data,
        method: "POST",
        success: (res) => {
          console.log(res);
          this.keylist = res.data.apilist;
          this.toast("\u65B0\u589E\u6210\u529F");
        },
        fail: (err) => {
          this.toast(err);
        }
      });
      this.close();
    },
    delkey(key) {
      let data = JSON.stringify({
        apikey: key
      });
      common_vendor.index.request({
        url: common_config.config.apiurl + "/delkey",
        data,
        method: "POST",
        success: (res) => {
          console.log(res);
          this.keylist = res.data.apilist;
          this.toast("\u5220\u9664\u6210\u529F");
        },
        fail: (err) => {
          this.toast(err);
        }
      });
    },
    checkkey(key) {
      let data = JSON.stringify({
        apikey: key
      });
      common_vendor.index.request({
        url: common_config.config.apiurl + "/checkapi",
        data,
        method: "POST",
        success: (res) => {
          console.log(res);
          this.keylist = res.data.apilist;
          this.toast("\u68C0\u6D4B\u5B8C\u6210");
        },
        fail: (err) => {
          this.toast(err);
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_collapse_item2 = common_vendor.resolveComponent("uni-collapse-item");
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _easycom_uni_collapse2 = common_vendor.resolveComponent("uni-collapse");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_easyinput2 + _easycom_uni_collapse_item2 + _easycom_uni_tag2 + _easycom_uni_collapse2 + _easycom_uni_popup2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_collapse_item = () => "../../uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.js";
const _easycom_uni_tag = () => "../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_uni_collapse = () => "../../uni_modules/uni-collapse/components/uni-collapse/uni-collapse.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_collapse_item + _easycom_uni_tag + _easycom_uni_collapse + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.sup
  }, $data.sup ? {
    b: common_vendor.t($data.allusernum),
    c: common_vendor.t($data.dayadduser),
    d: common_vendor.t($data.allanswnum),
    e: common_vendor.o(($event) => $data.daynum = $event),
    f: common_vendor.p({
      trim: "all",
      type: "number",
      modelValue: $data.daynum
    }),
    g: common_vendor.o(($event) => $data.sharenum = $event),
    h: common_vendor.p({
      trim: "all",
      type: "number",
      modelValue: $data.sharenum
    }),
    i: common_vendor.o(($event) => $data.sharemaxnum = $event),
    j: common_vendor.p({
      trim: "all",
      type: "number",
      modelValue: $data.sharemaxnum
    }),
    k: common_vendor.o(($event) => $data.videonum = $event),
    l: common_vendor.p({
      trim: "all",
      type: "number",
      modelValue: $data.videonum
    }),
    m: common_vendor.o(($event) => $data.videomaxnum = $event),
    n: common_vendor.p({
      trim: "all",
      type: "number",
      modelValue: $data.videomaxnum
    }),
    o: common_vendor.o(($event) => $data.manavx = $event),
    p: common_vendor.p({
      trim: "all",
      modelValue: $data.manavx
    }),
    q: $data.isadj,
    r: common_vendor.o((...args) => $options.adjset && $options.adjset(...args)),
    s: common_vendor.o((...args) => $options.setenter && $options.setenter(...args)),
    t: common_vendor.p({
      title: "\u53C2\u6570\u914D\u7F6E:"
    }),
    v: common_vendor.o(($event) => $data.addnumid = $event),
    w: common_vendor.p({
      trim: "all",
      modelValue: $data.addnumid
    }),
    x: common_vendor.o(($event) => $data.addnumcount = $event),
    y: common_vendor.p({
      trim: "all",
      type: "number",
      modelValue: $data.addnumcount
    }),
    z: common_vendor.o((...args) => $options.enteraddnum && $options.enteraddnum(...args)),
    A: common_vendor.p({
      title: "\u4F1A\u5458\u5145\u503C"
    }),
    B: common_vendor.f($data.keylist, (item, k0, i0) => {
      return {
        a: "1eaad2c1-12-" + i0 + ",1eaad2c1-11",
        b: common_vendor.o(($event) => item.key = $event),
        c: common_vendor.p({
          trim: "all",
          disabled: true,
          modelValue: item.key
        }),
        d: "1eaad2c1-13-" + i0 + ",1eaad2c1-11",
        e: common_vendor.p({
          text: item.usernum,
          type: ""
        }),
        f: "1eaad2c1-14-" + i0 + ",1eaad2c1-11",
        g: common_vendor.p({
          text: item.keystatu == 1 ? "\u6B63\u5E38" : "\u5F02\u5E38",
          type: item.keystatu == 1 ? "success" : "error"
        }),
        h: common_vendor.o(($event) => $options.checkkey(item.key)),
        i: "1eaad2c1-15-" + i0 + ",1eaad2c1-11",
        j: common_vendor.o(($event) => $options.delkey(item.key)),
        k: "1eaad2c1-16-" + i0 + ",1eaad2c1-11"
      };
    }),
    C: common_vendor.p({
      text: "\u68C0\u6D4B",
      type: "primary"
    }),
    D: common_vendor.p({
      text: "\u5220\u9664",
      type: "error"
    }),
    E: common_vendor.o((...args) => $options.addkey && $options.addkey(...args)),
    F: common_vendor.p({
      title: "key\u914D\u7F6E"
    }),
    G: common_vendor.o(($event) => $data.adjinfo = $event),
    H: common_vendor.p({
      trim: "all",
      modelValue: $data.adjinfo
    }),
    I: common_vendor.o((...args) => $options.editadjinfo && $options.editadjinfo(...args)),
    J: common_vendor.p({
      title: "\u5E7F\u544A\u914D\u7F6E"
    }),
    K: common_vendor.o($options.collchange),
    L: common_vendor.o(($event) => $data.choicecoll = $event),
    M: common_vendor.p({
      accordion: true,
      modelValue: $data.choicecoll
    }),
    N: $data.addkeynum,
    O: common_vendor.o(($event) => $data.addkeynum = $event.detail.value),
    P: common_vendor.o((...args) => $options.apikeyadd && $options.apikeyadd(...args)),
    Q: common_vendor.sr("addkeypop", "1eaad2c1-19"),
    R: common_vendor.p({
      type: "center"
    })
  } : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1eaad2c1"], ["__file", "F:/VUEobj/wxchat1/pages/index/ctrl.vue"]]);
wx.createPage(MiniProgramPage);
