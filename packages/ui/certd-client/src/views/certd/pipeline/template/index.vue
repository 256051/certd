<template>
  <fs-page>
    <template #header>
      <div class="title flex items-center">
        流水线模版
        <span class="ml-10 sub flex items-center">
          <span>可根据模版批量创建流水线 </span>
          <vip-button class="ml-10" mode="button" />
        </span>
      </div>
    </template>
    <fs-crud ref="crudRef" v-bind="crudBinding"> </fs-crud>
  </fs-page>
</template>

<script lang="ts" setup>
import { onActivated, onMounted } from "vue";
import { useFs } from "@fast-crud/fast-crud";
import createCrudOptions from "./crud";

defineOptions({
  name: "PipelineTemplate",
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
