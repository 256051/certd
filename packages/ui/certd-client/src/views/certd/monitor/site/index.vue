<template>
  <fs-page>
    <template #header>
      <div class="title">
        站点证书监控
        <span class="sub">监控网站证书的过期时间，并发出提醒</span>
      </div>
    </template>
    <fs-crud ref="crudRef" v-bind="crudBinding"> </fs-crud>
  </fs-page>
</template>

<script lang="ts" setup>
import { defineComponent, onActivated, onMounted } from "vue";
import { useFs } from "@fast-crud/fast-crud";
import createCrudOptions from "./crud";
import { createApi } from "./api";
defineOptions({
  name: "SiteCertMonitor"
});
const { crudBinding, crudRef, crudExpose } = useFs({ createCrudOptions, context: {} });

// 页面打开后获取列表数据
onMounted(() => {
  crudExpose.doRefresh();
});
onActivated(() => {
  crudExpose.doRefresh();
});
</script>
