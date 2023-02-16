"use strict";
var common_vendor = require("../../common/vendor.js");
var common_uniCopy = require("../../common/uni-copy.js");
var common_config = require("../../common/config.js");
const ourLoading = () => "../../components/our-loading/our-loading.js";
var videoAd = null;
const _sfc_main = {
  components: {
    ourLoading
  },
  data() {
    return {
      isadj: false,
      apiurl: "",
      contactperson: "xytx_000",
      loadset: true,
      userid: "",
      manaaddnum: null,
      loading: true,
      show: "",
      adj1: "",
      adjvideo: "",
      adj: "",
      managerstatu: false,
      modetype: 2,
      openid: "",
      range: [
        {
          value: 2,
          text: "\u4E00\u95EE\u4E00\u7B54\u6A21\u5F0F"
        },
        {
          value: 3,
          text: "\u4E0A\u4E0B\u6587\u6A21\u5F0F"
        }
      ],
      scrollInto: "",
      sentext: "\u53D1\u9001",
      msgLoad: false,
      msgList: [{
        "msg": "\u4F60\u597D\uFF0C\u6B22\u8FCE\u6765\u5230AI\u4E16\u754C\uFF0C\u6211\u4F1A\u5C3D\u53EF\u80FD\u5E2E\u52A9\u89E3\u7B54\u4F60\u7684\u95EE\u9898",
        "my": false
      }],
      msgContent: "",
      msg: "",
      sendmsgcache: [],
      num: 0,
      informs: ""
    };
  },
  onLoad() {
    this.apiurl = common_config.config.apiurl;
    console.log(this.apiurl);
    this.sentext = "\u52A0\u8F7D\u4E2D";
    this.msgLoad = true;
    this.wxcode();
    this.getsetinfo();
    this.adLoad();
  },
  methods: {
    addnumcopy() {
      this.copy(this.openid);
      this.closeaddnumpop();
    },
    openaddnumpop() {
      this.$refs.addnumpop.open("center");
    },
    closeaddnumpop() {
      this.$refs.addnumpop.close("center");
    },
    getsetinfo() {
      console.log("\u83B7\u53D6\u914D\u7F6E\u4FE1\u606F");
      common_vendor.index.request({
        url: common_config.config.apiurl + "/getsetinfo",
        method: "GET",
        success: (res) => {
          console.log(res);
          this.isadj = res.data.isadj;
          if (res.data.manavx != null) {
            this.contactperson = res.data.manavx;
          }
        },
        fail: (err) => {
          this.toast(err);
        }
      });
    },
    onChooseAvatar(e) {
      console.log(e.detail);
      this.avatar = e.detail.avatarUrl;
      common_vendor.index.setStorage({
        key: "avat",
        data: apikey,
        success: function(res) {
          console.log("success", res);
        }
      });
    },
    toindex() {
      common_vendor.index.navigateTo({
        url: "/pages/index/index"
      });
    },
    togpt() {
      common_vendor.index.navigateTo({
        url: "/pages/gpt/gpt"
      });
    },
    onShareAppMessage(res) {
      if (res.from === "button") {
        console.log(res.target);
      }
      return {
        title: "AI\u667A\u80FD\u95EE\u7B54",
        path: "/pages/index/index"
      };
    },
    onShareTimeline(res) {
      if (res.from === "button") {
        console.log(res.target);
      }
      return {
        title: "AI\u667A\u80FD\u95EE\u7B54",
        path: "/pages/index/index"
      };
    },
    neterr(err) {
      this.msgList[this.msgList.length - 1].msg = "\u670D\u52A1\u5668\u6709\u70B9\u5FD9\uFF0C\u91CD\u65B0\u95EE\u95EE\u8BD5\u8BD5\uFF0C\u4E00\u76F4\u4E0D\u597D\u7528\u7684\u8BDD\u8BF7\u8054\u7CFB\u5FAE\u4FE1\uFF1A" + this.contactperson + "  \u6545\u969C\u539F\u56E0:" + String(err);
      let that = this;
      setTimeout(function() {
        that.msgLoad = false;
        that.sentext = "\u53D1\u9001";
      }, 3e3);
    },
    toast(msg) {
      common_vendor.index.showToast({
        title: msg,
        duration: 2e3,
        icon: "none"
      });
    },
    chioceuse() {
      this.toast("\u6682\u672A\u5F00\u653E");
      common_vendor.index.getUserProfile({
        desc: "\u7372\u53D6\u60A8\u7684\u6635\u7A31\u3001\u982D\u50CF\u3001\u5730\u5340\u53CA\u6027\u5225",
        success: (infoRes) => {
          console.log(infoRes);
        },
        fail: (err) => {
          console.log("userInfo-err", JSON.stringify(err));
        }
      });
    },
    manaadd() {
      common_vendor.index.navigateTo({
        url: "/pages/index/ctrl"
      });
    },
    manaset() {
      common_vendor.index.navigateTo({
        url: "/pages/index/ctrl"
      });
      this.closeDrawer();
    },
    addnum(ty) {
      let data = JSON.stringify({
        openid: this.openid,
        type: ty
      });
      common_vendor.index.request({
        url: this.apiurl + "/addnum",
        data,
        method: "POST",
        success: (res) => {
          console.log("\u589E\u52A0\u6B21\u6570", res);
          if (res.data.code == 200) {
            this.num = res.data.num;
            this.toast("\u4EFB\u52A1\u5B8C\u6210\uFF0C\u6B21\u6570\u589E\u52A0");
            this.msgList[this.msgList.length - 1].msg = "\u6B21\u6570\u589E\u52A0\uFF0C\u6B22\u8FCE\u56DE\u6765";
            this.close();
          }
          if (res.data.code == 201) {
            this.msgList[this.msgList.length - 1].msg = res.data.msg;
            this.toast(res.data.msg);
            this.close();
          }
        },
        fail: (err) => {
          this.neterr(err);
        }
      });
    },
    adLoad: function() {
      if (wx.createRewardedVideoAd) {
        videoAd = wx.createRewardedVideoAd({
          adUnitId: this.adjvideo
        });
        videoAd.onError((err) => {
        });
        videoAd.onClose((status) => {
          if (status && status.isEnded || status === void 0) {
            videoAd.offClose();
            console.log("\u64AD\u653E\u5B8C\u6210");
            this.addnum("v");
          } else {
            console.log("\u9000\u51FA\u64AD\u653E");
          }
        });
      }
    },
    showAd() {
      if (videoAd) {
        videoAd.show().catch((err) => {
          videoAd.load().then(() => videoAd.show());
        });
      }
    },
    shar() {
      this.addnum("s");
    },
    open() {
      console.log("pop");
      this.$refs.popup.open("bottom");
    },
    close() {
      this.$refs.popup.close("bottom");
    },
    setPageScrollTo() {
      let len = this.msgList.length;
      this.scrollInto = "id" + (len - 1);
    },
    sendmsg() {
      console.log(this.msg.length);
      if (this.sentext == "\u6545\u969C" || this.sentext == "\u91CD\u8BD5") {
        this.checkserve();
        return 0;
      }
      if (this.num < 1 && this.sentext != "\u6545\u969C") {
        console.log("\u9700\u5145\u503C");
        this.msgList.push({
          "msg": "\u53EF\u7528\u6B21\u6570\u4E0D\u8DB3",
          "my": false
        });
        this.open();
        return 0;
      }
      if (this.msg == "") {
        console.log("msg\u4E3A\u7A7A");
        this.toast("\u8BF7\u5148\u8F93\u5165\u95EE\u9898");
        return 0;
      }
      if (this.msgLoad == true) {
        console.log("load\u4E2D");
        return 0;
      }
      this.sentext = "\u8BF7\u6C42\u4E2D";
      this.msgList.push({
        "msg": this.msg,
        "my": true
      });
      this.msgList.push({
        "msg": "\u7B54\u6848\u751F\u6210\u4E2D......",
        "my": false
      });
      let data = "";
      switch (this.modetype) {
        case 3:
          console.log(this.modetype, "3");
          this.sendmsgcache.push("YOU:" + this.msg + "\n");
          this.msgContent = "";
          this.sendmsgcache.forEach((info) => {
            console.log("info", info);
            this.msgContent += info;
          });
          data = JSON.stringify({
            msg: this.msgContent,
            maxtoken: 3700 - this.msgContent.length * 2,
            openid: this.openid
          });
          break;
        case 2:
          console.log(this.modetype, "2");
          data = JSON.stringify({
            msg: this.msg,
            maxtoken: 3700 - this.msg.length * 2,
            openid: this.openid
          });
          break;
      }
      console.log(data);
      this.msgLoad = true;
      this.msg = "";
      this.setPageScrollTo();
      let count = 0;
      let timer = setInterval(() => {
        count++;
        if (count == 30) {
          this.msgList[this.msgList.length - 1].msg = "\u56DE\u7B54\u5185\u5BB9\u8D8A\u957F\uFF0C\u53CD\u5E94\u65F6\u95F4\u8D8A\u6162\uFF0C\u8BF7\u8010\u5FC3\u7B49\u5F85,\u9A6C\u4E0A\u5C31\u597D....";
        }
        if (count == 60) {
          this.msgList[this.msgList.length - 1].msg = "\u56DE\u7B54\u4E00\u5B9A\u662F\u4E2A\u8D85\u7EA7\u957F\u7684\u5185\u5BB9,\u9A6C\u4E0A\u5C31\u597D....";
        }
      }, 1e3);
      common_vendor.index.request({
        url: this.apiurl + "/message",
        data,
        method: "POST",
        timeout: 18e4,
        success: (res) => {
          if (res.data.code == 200) {
            let text = res.data.resmsg.choices[0].text.replace("openai:", "").replace("openai\uFF1A", "").replace(/^\n|\n$/g, "");
            console.log(text);
            let msglen = res.data.resmsg.usage.total_tokens;
            let msgcomplen = res.data.resmsg.usage.completion_tokens;
            if (msglen + msgcomplen > 1500) {
              for (let msg in this.sendmsgcache) {
                this.sendmsgcache.shift();
                if (this.msgContent.length * 1.6 + msglen < 800) {
                  console.log("ok");
                  break;
                }
              }
            }
            clearInterval(timer);
            timer = null;
            if (text != "") {
              this.msgList[this.msgList.length - 1].msg = text;
            }
            if (text == "") {
              this.msgList[this.msgList.length - 1].msg = "\u4F60\u597D\u50CF\u6CA1\u6709\u95EE\u95EE\u9898\uFF0C\u52A0\u4E0A\u4F60\u60F3\u95EE\u7684\u95EE\u9898\u6216\u8005\u6362\u4E2A\u95EE\u6CD5\u518D\u8BD5\u8BD5";
            }
            this.setPageScrollTo();
            console.log("su", this.msgList);
            this.sendmsgcache.push(text + "\n");
            this.num = res.data.num;
            this.msgLoad = false;
            this.sentext = "\u53D1\u9001";
          } else {
            clearInterval(timer);
            timer = null;
            this.neterr(res.data.errinfo);
          }
        },
        fail: (res) => {
          this.neterr(res);
        }
      });
    },
    topupnum() {
      console.log("\u6B21\u6570\u70B9\u51FB");
    },
    copy(info) {
      common_uniCopy.uniCopy({
        content: info,
        success: (res) => {
          common_vendor.index.showToast({
            title: res,
            icon: "none"
          });
        },
        error: (e) => {
          common_vendor.index.showToast({
            title: e,
            icon: "none",
            duration: 3e3
          });
        }
      });
    },
    checkserve() {
      this.msgLoad = true;
      this.sentext = "\u8FDE\u63A5\u4E2D";
      common_vendor.index.request({
        url: this.apiurl,
        method: "GET",
        success: (res) => {
          console.log("\u8054\u901A\u6D4B\u8BD5", res);
          if (res.data.code == 200) {
            console.log(res);
            this.sentext = "\u53D1\u9001";
            this.msgLoad = false;
            this.adj = res.data.adj;
          } else {
            this.msgList.push({
              "msg": "\u670D\u52A1\u5668\u6545\u969C\uFF0C\u8BF7\u8054\u7CFB\u5FAE\u4FE1\uFF1A" + this.contactperson + "  \u6545\u969C\u539F\u56E0:" + res.data.resmsg,
              "my": false
            });
            this.sentext = "\u6545\u969C";
            setTimeout(function() {
              this.msgLoad = true;
            }, 1e4);
          }
        },
        fail: (err) => {
          this.neterr(err);
        }
      });
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
            url: that.apiurl + "/login",
            data,
            method: "POST",
            success: (res) => {
              if (res.data.code == 200) {
                console.log(res);
                that.sentext = "\u53D1\u9001";
                that.msgLoad = false;
                console.log(res);
                that.openid = res.data.resmsg.openid;
                that.num = res.data.num;
                if (res.data.resmsg.openid == res.data.mana) {
                  that.managerstatu = true;
                }
                that.loadset = false;
                that.checkserve();
              } else {
                that.msgList.push({
                  "msg": "\u670D\u52A1\u5668\u6545\u969C\uFF0C\u8BF7\u8054\u7CFB\u5FAE\u4FE1\uFF1A" + that.contactperson + "  \u6545\u969C\u539F\u56E0:" + res.data.resmsg,
                  "my": false
                });
                that.sentext = "\u6545\u969C";
                setTimeout(function() {
                  that.msgLoad = true;
                }, 1e4);
              }
            },
            fail: (err) => {
              this.neterr(err);
            }
          });
        }
      });
    },
    change(e) {
      console.log("e:", e);
      this.sendmsgcache = [];
      this.toast("\u6A21\u5F0F\u53D8\u66F4\u540E\uFF0C\u5BF9\u8BDD\u903B\u8F91\u4F1A\u4ECE\u65B0\u5F00\u59CB");
      switch (e) {
        case 3:
          this.informs = "\u5F53\u524D\u9009\u62E9\u6A21\u5F0F\u4E3A\u4E0A\u4E0B\u6587\u6A21\u5F0F\uFF0C\u4ECE\u73B0\u5728\u5F00\u59CB\u7684\u95EE\u7B54\u4F1A\u5F71\u54CDAI\u56DE\u590D\u7684\u903B\u8F91\uFF0C\u9700\u8981\u6E05\u7A7A\u903B\u8F91\u91CD\u65B0\u5F00\u59CB\u7684\u8BDD\uFF0C\u76F4\u63A5\u91CD\u65B0\u9009\u62E9\u6A21\u5F0F\u5C31\u53EF\u4EE5";
          break;
        case 2:
          this.informs = "\u5F53\u524D\u9009\u62E9\u6A21\u5F0F\u4E3A\u4E00\u95EE\u4E00\u7B54\u6A21\u5F0F\uFF0C\u6BCF\u6B21\u7684\u95EE\u7B54\u65E0\u4E0A\u4E0B\u6587\u5173\u8054\uFF0C\u53EF\u4EE5\u4E00\u6B21\u6027\u5C06\u95EE\u9898\u63CF\u8FF0\u8BE6\u7EC6\uFF0CAI\u56DE\u7B54\u7684\u5185\u5BB9\u8D8A\u591A\uFF0C\u9700\u8981\u7B49\u5F85\u7684\u65F6\u95F4\u8D8A\u957F";
          break;
      }
      this.msgList.push({
        "msg": this.informs,
        "my": false
      });
    },
    showDrawer() {
      this.$refs.showRight.open();
    },
    closeDrawer() {
      this.$refs.showRight.close();
    }
  }
};
if (!Array) {
  const _component_ourLoading = common_vendor.resolveComponent("ourLoading");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_drawer2 = common_vendor.resolveComponent("uni-drawer");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_component_ourLoading + _easycom_uni_data_select2 + _easycom_uni_notice_bar2 + _easycom_uni_icons2 + _easycom_uni_drawer2 + _easycom_uni_popup2)();
}
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_notice_bar = () => "../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_drawer = () => "../../uni_modules/uni-drawer/components/uni-drawer/uni-drawer.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_data_select + _easycom_uni_notice_bar + _easycom_uni_icons + _easycom_uni_drawer + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loadset,
    b: common_vendor.p({
      isFullScreen: true,
      active: true,
      text: "\u4F60\u60F3\u77E5\u9053\u7684,\u5B83\u90FD\u4F1A\u544A\u8BC9\u4F60...."
    }),
    c: common_vendor.o($options.change),
    d: common_vendor.o(($event) => $data.modetype = $event),
    e: common_vendor.p({
      localdata: $data.range,
      modelValue: $data.modetype
    }),
    f: $data.num > 0
  }, $data.num > 0 ? {
    g: common_vendor.t($data.num)
  } : {}, {
    h: $data.num <= 0
  }, $data.num <= 0 ? {} : {}, {
    i: common_vendor.o((...args) => $options.openaddnumpop && $options.openaddnumpop(...args)),
    j: common_vendor.p({
      showClose: true,
      text: $data.adj
    }),
    k: common_vendor.f($data.msgList, (x, i, i0) => {
      return common_vendor.e({
        a: x.my
      }, x.my ? {
        b: common_vendor.t(x.msg),
        c: "id" + i,
        d: common_vendor.o(($event) => $options.copy(x.msg))
      } : {}, {
        e: !x.my
      }, !x.my ? {
        f: common_vendor.t(x.msg),
        g: "id" + i,
        h: common_vendor.o(($event) => $options.copy(x.msg))
      } : {}, {
        i
      });
    }),
    l: $data.scrollInto,
    m: common_vendor.o($options.showDrawer),
    n: common_vendor.p({
      type: "settings-filled",
      size: "30"
    }),
    o: common_vendor.o((...args) => $options.sendmsg && $options.sendmsg(...args)),
    p: $data.msg,
    q: common_vendor.o(($event) => $data.msg = $event.detail.value),
    r: common_vendor.t($data.sentext),
    s: common_vendor.o((...args) => $options.sendmsg && $options.sendmsg(...args)),
    t: $data.msgLoad,
    v: common_vendor.t($data.openid),
    w: common_vendor.o(($event) => $options.copy($data.openid)),
    x: $data.managerstatu
  }, $data.managerstatu ? {
    y: common_vendor.o((...args) => $options.manaset && $options.manaset(...args))
  } : {}, {
    z: common_vendor.t($data.adj),
    A: $data.adj1,
    B: common_vendor.sr("showRight", "57280228-4"),
    C: common_vendor.p({
      mode: "left"
    }),
    D: $data.isadj
  }, $data.isadj ? {
    E: common_vendor.o((...args) => $options.showAd && $options.showAd(...args))
  } : {}, {
    F: common_vendor.o((...args) => $options.shar && $options.shar(...args)),
    G: common_vendor.t($data.contactperson),
    H: common_vendor.o((...args) => $options.openaddnumpop && $options.openaddnumpop(...args)),
    I: common_vendor.sr("popup", "57280228-5"),
    J: common_vendor.p({
      type: "bottom"
    }),
    K: common_vendor.o(($event) => $options.addnumcopy($data.openid)),
    L: common_vendor.t($data.contactperson),
    M: common_vendor.sr("addnumpop", "57280228-6"),
    N: common_vendor.p({
      type: "center"
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-57280228"], ["__file", "F:/VUEobj/wxchat1/pages/index/index.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
