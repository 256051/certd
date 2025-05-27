<template>
  <div class="site-ip-dialog" style="height: 60vh">
    <fs-crud ref="crudRef" v-bind="crudBinding"> </fs-crud>
  </div>
</template>

<script lang="ts" setup>
import { onActivated, onMounted } from "vue";
import { useFs } from "@fast-crud/fast-crud";
import createCrudOptions from "./crud";
import { siteIpApi } from "./api";
import { Modal, notification } from "ant-design-vue";
defineOptions({
  name: "SiteIpCertMonitor",
});
const props = defineProps<{
  siteId: number;
}>();
const { crudBinding, crudRef, crudExpose } = useFs({
  createCrudOptions,
  context: {
    props,
  },
});
function checkAll() {
  Modal.confirm({
    title: "确认",
    content: "确认触发检查全部站点证书吗?",
    onOk: async () => {
      await siteIpApi.CheckAll();
      notification.success({
        message: "检查任务已提交",
        description: "请稍后刷新页面查看结果",
      });
    },
  });
}

// 页面打开后获取列表数据
onMounted(() => {
  crudExpose.doRefresh();
});
onActivated(() => {
  crudExpose.doRefresh();
});
</script>
