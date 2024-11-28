<template>
  <fs-page class="page-sys-settings">
    <!--    <template #header>-->
    <!--      <div class="title">系统设置</div>-->
    <!--    </template>-->
    <div class="sys-settings-body">
      <a-tabs type="card" class="sys-settings-tabs">
        <a-tab-pane key="site" tab="基本设置">
          <SettingBase />
        </a-tab-pane>
        <a-tab-pane key="register" tab="注册设置">
          <SettingRegister />
        </a-tab-pane>
      </a-tabs>
    </div>
  </fs-page>
</template>

<script setup lang="tsx">
import { SysSettings } from "./api";
import SettingBase from "/@/views/sys/settings/tabs/base.vue";
import SettingRegister from "/@/views/sys/settings/tabs/register.vue";

defineOptions({
  name: "SysSettings"
});
</script>

<style lang="less">
.page-sys-settings {
  .sys-settings-form {
    width: 500px;
    margin: 20px;
  }

  .sys-settings-body {
    height: 100%;
    padding-top: 20px;
    padding-left: 20px;
    .sys-settings-tabs {
      height: 100%;
      display: flex;
      flex-direction: column;
      .ant-tabs-content-holder {
        flex: 1;
        overflow: auto;
      }
    }
  }
}
</style>
