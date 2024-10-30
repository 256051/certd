<template>
  <div class="dashboard-user">
    <div class="header-profile">
      <div class="avatar">
        <a-avatar size="large" :src="userStore?.userInfo?.avatar"></a-avatar>
      </div>
      <div class="text">
        <div>您好，{{ userStore?.userInfo?.nickName || userStore?.userInfo?.username }}</div>
        <div>
          <a-tag color="green" class="flex-inline"> <fs-icon icon="ion:time-outline" class="mr-5"></fs-icon> {{ now }}</a-tag>
        </div>
      </div>
      <div class="suggest"></div>
    </div>

    <div class="statistic-data m-20">
      <a-row :gutter="20">
        <a-col :span="6">
          <statistic-card title="流水线数量"></statistic-card>
        </a-col>
        <a-col :span="6">
          <statistic-card title="运行次数"></statistic-card>
        </a-col>
        <a-col :span="6">
          <statistic-card title="最近运行"></statistic-card>
        </a-col>
        <a-col :span="6">
          <statistic-card title="最近到期证书"></statistic-card>
        </a-col>
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

defineOptions({
  name: "DashboardUser"
});
import { useUserStore } from "/@/store/modules/user";
import { computed, onMounted, ref } from "vue";
import dayjs from "dayjs";
import StatisticCard from "/@/views/framework/home/dashboard/statistic-card.vue";
import * as pluginApi from "/@/views/certd/pipeline/api.plugin";
import { PluginGroups } from "/@/views/certd/pipeline/pipeline/type";

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
  .header-profile {
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: #fff;
    .avatar {
      margin-right: 20px;
    }
    .text {
      display: flex;
      flex-direction: column;
      div {
        margin-bottom: 10px;
      }
    }
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
