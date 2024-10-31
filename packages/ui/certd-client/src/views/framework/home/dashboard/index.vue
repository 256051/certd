<template>
  <div class="dashboard-user">
    <div class="header-profile">
      <div class="avatar">
        <a-avatar size="large" :src="userStore?.userInfo?.avatar"></a-avatar>
      </div>
      <div class="text">
        <div class="left">
          <div>
            <span>您好，{{ userStore?.userInfo?.nickName || userStore?.userInfo?.username }}。 欢迎使用 {{ siteInfo.title }} </span>
          </div>
          <div>
            <a-tag color="green" class="flex-inline"> <fs-icon icon="ion:time-outline" class="mr-5"></fs-icon> {{ now }}</a-tag>
          </div>
        </div>
      </div>
      <div class="suggest">
        <div>
          <tutorial-button class="flex-center">
            <a-tag color="blue" class="flex-center">
              仅需3步，让你的证书永不过期 <fs-icon class="font-size-16 ml-5" icon="mingcute:question-line"></fs-icon
            ></a-tag>
          </tutorial-button>
          <simple-steps></simple-steps>
        </div>
      </div>
    </div>
    <div v-if="!settingStore.isComm" class="warning">
      <a-alert type="warning" show-icon>
        <template #message>
          证书和授权为敏感信息，不要使用来历不明的在线Certd服务和镜像，请务必私有化部署使用，保护数据安全，认准官方版本发布渠道：
          <a class="ml-5 flex-inline" href="https://gitee.com/certd/certd" target="_blank">gitee</a>、
          <a class="ml-5 flex-inline" href="https://github.com/certd/certd" target="_blank">github</a>、
          <a class="ml-5 flex-inline" href="https://certd.docmirror.cn" target="_blank">帮助文档</a>
        </template>
      </a-alert>
    </div>

    <div class="statistic-data m-20">
      <a-row :gutter="20">
        <a-col :span="6">
          <statistic-card title="提醒"> </statistic-card>
        </a-col>
        <a-col :span="6">
          <statistic-card title="流水线数量"></statistic-card>
        </a-col>
        <a-col :span="6">
          <statistic-card title="最近运行"></statistic-card>
        </a-col>
        <a-col :span="6">
          <statistic-card title="最近到期证书"></statistic-card>
        </a-col>
        <!--        <a-col :span="12">-->
        <!--          <statistic-card title="3步自动部署">-->
        <!--            <simple-steps></simple-steps>-->
        <!--          </statistic-card>-->
        <!--        </a-col>-->
      </a-row>
    </div>

    <div v-if="pluginGroups" class="plugin-list">
      <a-card>
        <template #title>
          支持的部署任务列表 <a-tag color="green">{{ pluginGroups.groups.all.plugins.length }}</a-tag>
        </template>
        <a-row :gutter="10">
          <a-col v-for="item of pluginGroups.groups.all.plugins" class="plugin-item-col" :span="4">
            <a-card>
              <div class="plugin-item">
                <div class="icon">
                  <fs-icon :icon="item.icon" class="font-size-16 color-blue" />
                </div>
                <div class="text">
                  <div class="title">{{ item.title }}</div>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FsIcon } from "@fast-crud/fast-crud";
import SimpleSteps from "./simple-steps.vue";
defineOptions({
  name: "DashboardUser"
});
import { useUserStore } from "/@/store/modules/user";
import { computed, onMounted, Ref, ref } from "vue";
import dayjs from "dayjs";
import StatisticCard from "/@/views/framework/home/dashboard/statistic-card.vue";
import * as pluginApi from "/@/views/certd/pipeline/api.plugin";
import { PluginGroups } from "/@/views/certd/pipeline/pipeline/type";
import TutorialButton from "/@/components/tutorial/index.vue";
import { useSettingStore } from "/@/store/modules/settings";
import { SiteInfo } from "/@/api/modules/api.basic";

const version = ref(import.meta.env.VITE_APP_VERSION);
const settingStore = useSettingStore();
const siteInfo: Ref<SiteInfo> = computed(() => {
  return settingStore.siteInfo;
});

const userStore = useUserStore();
const now = computed(() => {
  return dayjs().format("YYYY-MM-DD HH:mm:ss");
});

async function getPluginGroups() {
  const groups = await pluginApi.GetGroups({});
  return new PluginGroups(groups);
}

const pluginGroups = ref();
onMounted(async () => {
  pluginGroups.value = await getPluginGroups();
});
</script>

<style lang="less">
.dashboard-user {
  .warning {
    .ant-alert {
      border-left: 0;
      border-right: 0;
      border-radius: 0;
    }
  }
  .header-profile {
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: #fff;

    .avatar {
      margin-right: 20px;
    }
    .text {
      flex: 1;
      display: flex;
      flex-direction: row;
      .left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        > div {
          margin: 2px;
        }
      }
    }
  }
  .notice {
    padding: 20px;
  }
  .plugin-list {
    margin: 0 20px;

    .plugin-item-col {
      margin-bottom: 10px;
      .plugin-item {
        display: flex;
        justify-items: center;
        line-height: 20px;
        .icon {
          display: flex;
          justify-items: center;
          font-size: 20px;
          margin-right: 8px;
        }
        .text {
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: keep-all;
        }
      }
    }
  }
}
</style>
