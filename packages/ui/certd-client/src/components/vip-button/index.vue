<template>
  <div v-if="!settingStore.isComm || userStore.isAdmin" class="layout-vip isPlus" @click="openUpgrade">
    <contextHolder />
    <fs-icon icon="mingcute:vip-1-line" :title="text.title" />

    <div v-if="mode !== 'icon'" class="text">
      <a-tooltip>
        <template #title> {{ text.title }}</template>
        <span>{{ text.name }}</span>
      </a-tooltip>
    </div>
  </div>
</template>
<script lang="tsx" setup>
import { computed, onMounted, reactive } from "vue";
import dayjs from "dayjs";
import { message, Modal } from "ant-design-vue";
import * as api from "./api";
import { useSettingStore } from "/@/store/modules/settings";
import { useRouter } from "vue-router";
import { useUserStore } from "/@/store/modules/user";
import { mitter } from "/@/utils/util.mitt";

const settingStore = useSettingStore();
const props = withDefaults(
  defineProps<{
    mode?: "comm" | "button" | "nav" | "icon";
  }>(),
  {
    mode: "button"
  }
);
type Text = {
  name: string;
  title?: string;
};
const text = computed<Text>(() => {
  const vipLabel = settingStore.vipLabel;
  const map = {
    isComm: {
      comm: {
        name: `${vipLabel}已开通`,
        title: "到期时间：" + expireTime.value
      },
      button: {
        name: `${vipLabel}已开通`,
        title: "到期时间：" + expireTime.value
      },
      icon: {
        name: "",
        title: `${vipLabel}已开通`
      },
      nav: {
        name: `${vipLabel}`,
        title: "到期时间：" + expireTime.value
      }
    },
    isPlus: {
      comm: {
        name: "商业版功能",
        title: "升级商业版，获取商业授权"
      },
      button: {
        name: `${vipLabel}已开通`,
        title: "到期时间：" + expireTime.value
      },
      icon: {
        name: "",
        title: `${vipLabel}已开通`
      },
      nav: {
        name: `${vipLabel}`,
        title: "到期时间：" + expireTime.value
      }
    },
    free: {
      comm: {
        name: "商业版功能",
        title: "升级商业版，获取商业授权"
      },
      button: {
        name: "专业版功能",
        title: "升级专业版，享受更多VIP特权"
      },
      icon: {
        name: "",
        title: "专业版功能"
      },
      nav: {
        name: "基础版",
        title: "升级专业版，享受更多VIP特权"
      }
    }
  };
  if (settingStore.isComm) {
    return map.isComm[props.mode];
  } else if (settingStore.isPlus) {
    return map.isPlus[props.mode];
  } else {
    return map.free[props.mode];
  }
});

const expireTime = computed(() => {
  if (settingStore.isPlus) {
    return dayjs(settingStore.plusInfo.expireTime).format("YYYY-MM-DD");
  }
  return "";
});

const expiredDays = computed(() => {
  if (settingStore.plusInfo?.isPlus && !settingStore.isPlus) {
    //已过期多少天
    const days = dayjs().diff(dayjs(settingStore.plusInfo.expireTime), "day");
    return `${settingStore.vipLabel}已过期${days}天`;
  }
  return "";
});

const formState = reactive({
  code: "",
  inviteCode: ""
});

const router = useRouter();
async function doActive() {
  if (!formState.code) {
    message.error("请输入激活码");
    throw new Error("请输入激活码");
  }
  const res = await api.doActive(formState);
  if (res) {
    await settingStore.init();
    const vipLabel = settingStore.vipLabel;
    Modal.success({
      title: "激活成功",
      content: `您已成功激活${vipLabel},有效期至：${dayjs(settingStore.plusInfo.expireTime).format("YYYY-MM-DD")}`,
      onOk() {
        if (!(settingStore.installInfo.bindUserId > 0)) {
          //未绑定账号
          Modal.confirm({
            title: "是否绑定袖手账号",
            content: "绑定账号后，可以避免License丢失，强烈建议绑定",
            onOk() {
              router.push("/sys/account");
            }
          });
        }
      }
    });
  }
}

const computedSiteId = computed(() => settingStore.installInfo?.siteId);
const [modal, contextHolder] = Modal.useModal();
const userStore = useUserStore();

function goAccount() {
  Modal.destroyAll();
  router.push("/sys/account");
}

async function getVipTrial() {
  const res = await api.getVipTrial();
  message.success(`恭喜，您已获得专业版${res.duration}天试用`);
  await settingStore.init();
}

function openTrialModal() {
  Modal.destroyAll();

  modal.confirm({
    title: "7天专业版试用获取",
    okText: "立即获取",
    onOk() {
      getVipTrial();
    },
    width: 600,
    content: () => {
      return (
        <div class="flex-col mt-10 mb-10">
          <div>感谢您对开源项目的支持</div>
          <div>点击确认，即可获取7天专业版试用</div>
        </div>
      );
    }
  });
}

function openStarModal() {
  Modal.destroyAll();
  const goGithub = () => {
    window.open("https://github.com/certd/certd/");
  };

  modal.confirm({
    title: "7天专业版试用获取",
    okText: "立即去Star",
    onOk() {
      goGithub();
      openTrialModal();
    },
    width: 600,
    content: () => {
      return (
        <div class="flex mt-10 mb-10">
          <div>可以先请您帮忙点个star吗？感谢感谢</div>
          <img class="ml-5" src="https://img.shields.io/github/stars/certd/certd?logo=github" />
        </div>
      );
    }
  });
}

function openUpgrade() {
  if (!userStore.isAdmin) {
    message.info("仅限管理员操作");
    return;
  }
  const placeholder = "请输入激活码";
  const isPlus = settingStore.isPlus;
  let title = "激活专业版/商业版";
  if (settingStore.isComm) {
    title = "续期商业版";
  } else if (settingStore.isPlus) {
    title = "续期专业版/升级商业版";
  }

  const vipTypeDefine = {
    free: {
      title: "基础版",
      desc: "免费使用",
      type: "free",
      privilege: ["证书申请功能无限制", "证书流水线数量10条", "常用的主机、cdn等部署插件"]
    },
    plus: {
      title: "专业版",
      desc: "功能增强，适用于个人企业内部使用",
      type: "plus",
      privilege: ["可加VIP群，需求优先实现", "证书流水线数量无限制", "免配置发邮件功能", "支持宝塔、易盾、群晖、1Panel、cdnfly等部署插件"],
      trial: {
        title: "7天试用",
        click: () => {
          openStarModal();
        }
      }
    },
    comm: {
      title: "商业版",
      desc: "商业授权，可对外运营",
      type: "comm",
      privilege: ["拥有专业版所有特权", "允许商用，可修改logo、标题", "数据统计", "插件管理", "多用户无限制", "支持用户支付（敬请期待）"]
    }
  };

  const modalRef = modal.confirm({
    title,
    async onOk() {
      return await doActive();
    },
    maskClosable: true,
    okText: "激活",
    width: 900,
    content: () => {
      let activationCodeGetWay: any = null;
      if (settingStore.siteEnv.agent.enabled != null) {
        const agent = settingStore.siteEnv.agent;
        if (agent.enabled === false) {
          activationCodeGetWay = (
            <span>
              <a href="https://afdian.com/a/greper" target="_blank">
                爱发电赞助“VIP会员（¥29.9）”后获取一年期专业版激活码
              </a>
              <span> 商业版请直接联系作者</span>
            </span>
          );
        } else {
          activationCodeGetWay = (
            <a href={agent.contactLink} target="_blank">
              {agent.contactText}
            </a>
          );
        }
      }
      const vipLabel = settingStore.vipLabel;
      const slots = [];
      for (const key in vipTypeDefine) {
        // @ts-ignore
        const item = vipTypeDefine[key];
        const vipBlockClass = `vip-block ${key === settingStore.plusInfo.vipType ? "current" : ""}`;
        slots.push(
          <a-col span={8}>
            <div class={vipBlockClass}>
              <h3 class="block-header">
                <span>{item.title}</span>
                {item.trial && (
                  <span class="trial">
                    <a-tooltip title={item.trial.message}>
                      <a onClick={item.trial.click}>{item.trial.title}</a>
                    </a-tooltip>
                  </span>
                )}
              </h3>
              <div>{item.desc}</div>
              <ul>
                {item.privilege.map((p: string) => (
                  <li>
                    <fs-icon class="color-green" icon="ion:checkmark-sharp" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </a-col>
        );
      }
      return (
        <div class="mt-10 mb-10 vip-active-modal">
          <div class="vip-type-vs">
            <a-row gutter={20}>{slots}</a-row>
          </div>
          <div class="mt-10">
            <h3 class="block-header">{isPlus ? "续期" : "立刻激活"}</h3>
            <div>{isPlus ? `当前${vipLabel}已激活，到期时间` + dayjs(settingStore.plusInfo.expireTime).format("YYYY-MM-DD") : ""}</div>
            <div class="mt-10">
              <div class="flex-o w-100">
                <span>站点ID：</span>
                <fs-copyable class="flex-1" v-model={computedSiteId.value}></fs-copyable>
              </div>
              <a-input class="mt-10" v-model:value={formState.code} placeholder={placeholder} />
              <a-input class="mt-10" v-model:value={formState.inviteCode} placeholder={"邀请码【选填】，可额外获得专业版30天/商业版15天时长"} />
            </div>

            <div class="mt-10">
              没有激活码？
              {activationCodeGetWay}
            </div>
            <div class="mt-10">
              激活码使用过一次之后，不可再次使用，如果要更换站点，请<a onClick={goAccount}>绑定账号</a>，然后"转移VIP"即可
            </div>
          </div>
        </div>
      );
    }
  });
}
onMounted(() => {
  mitter.on("openVipModal", () => {
    if (props.mode === "nav" && !settingStore.isPlus) {
      openUpgrade();
    }
  });
});
</script>

<style lang="less">
.layout-vip {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;

  &.isPlus {
    color: #c5913f;
  }

  .text {
    margin-left: 5px;
  }
}

.vip-active-modal {
  .vip-block {
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 5px;
    height: 195px;
    //background-color: rgba(250, 237, 167, 0.79);
    &.current {
      border-color: green;
    }
    .block-header {
      padding: 0px;
      display: flex;
      justify-content: space-between;
      .trial {
        font-size: 12px;
        font-wight: 400;
      }
    }
  }

  ul {
    list-style-type: unset;
    margin-left: 0px;
    padding: 0;
  }
  .color-green {
    color: green;
  }
  .vip-type-vs {
    .fs-icon {
      margin-right: 5px;
      color: green;
    }
  }
}
</style>
