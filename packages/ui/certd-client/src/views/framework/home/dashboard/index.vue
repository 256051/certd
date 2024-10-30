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
      <a-row gutter="20">
        <a-col span="6">
          <statistic-card title="流水线数量"></statistic-card>
        </a-col>
        <a-col span="6">
          <statistic-card title="授权数量"></statistic-card>
        </a-col>
        <a-col span="6">
          <statistic-card title="运行次数"></statistic-card>
        </a-col>
        <a-col span="6">
          <statistic-card title="下次触发时间"></statistic-card>
        </a-col>
        <a-col span="6">
          <statistic-card title="下次证书更新时间"></statistic-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FsIcon } from "@fast-crud/fast-crud";

defineOptions({
  name: "DashboardUser"
});
import { useUserStore } from "/@/store/modules/user";
import { computed, ref } from "vue";
import dayjs from "dayjs";
import StatisticCard from "/@/views/framework/home/dashboard/statistic-card.vue";

const userStore = useUserStore();
const now = computed(() => {
  return dayjs().format("YYYY-MM-DD HH:mm:ss");
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
}
</style>
