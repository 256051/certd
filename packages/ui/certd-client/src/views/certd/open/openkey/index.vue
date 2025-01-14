<template>
  <fs-page>
    <template #header>
      <div class="title">开放接口密钥管理</div>
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
  name: "OpenKey"
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
