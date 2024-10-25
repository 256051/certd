<template>
  <fs-page class="page-cert">
    <template #header>
      <div class="title">顶部菜单配置</div>
    </template>
    <fs-crud ref="crudRef" v-bind="crudBinding"> </fs-crud>
  </fs-page>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useFs } from "@fast-crud/fast-crud";
import createCrudOptions from "./crud";
import { useSettingStore } from "/@/store/modules/settings";
import { cloneDeep } from "lodash-es";
defineOptions({
  name: "SettingsHeaderMenus"
});
const { crudBinding, crudRef, crudExpose, context } = useFs({ createCrudOptions });

const settingStore = useSettingStore();
// 页面打开后获取列表数据
onMounted(() => {
  crudBinding.value.data = cloneDeep(settingStore.headerMenus.menus || []);
});
</script>
<style lang="less"></style>
