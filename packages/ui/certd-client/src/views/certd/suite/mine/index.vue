<template>
  <fs-page>
    <template #header>
      <div class="title">
        我的套餐
        <span class="sub">我的所有套餐</span>
      </div>
    </template>
    <fs-crud ref="crudRef" v-bind="crudBinding"> </fs-crud>
  </fs-page>
</template>

<script lang="ts" setup>
import { onActivated, onMounted, ref } from "vue";
import { useFs } from "@fast-crud/fast-crud";
import createCrudOptions from "./crud";
import api, { SuiteDetail } from "/@/views/certd/suite/mine/api";

defineOptions({
  name: "MySuites"
});
const detail = ref<SuiteDetail>({});
const { crudBinding, crudRef, crudExpose } = useFs({ createCrudOptions, context: { detail } });

async function loadSuiteDetail() {
  detail.value = await api.SuiteDetailGet();
}

// 页面打开后获取列表数据
onMounted(async () => {
  await loadSuiteDetail();
  await crudExpose.doRefresh();
});
onActivated(() => {
  crudExpose.doRefresh();
});
</script>
