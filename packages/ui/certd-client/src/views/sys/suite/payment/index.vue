<template>
  <fs-page>
    <template #header>
      <div class="title">
        支付方式管理
        <span class="sub">管理支付方式</span>
      </div>
    </template>
    <fs-crud ref="crudRef" v-bind="crudBinding"> </fs-crud>
  </fs-page>
</template>

<script lang="ts">
import { defineComponent, onActivated, onMounted } from "vue";
import { useFs } from "@fast-crud/fast-crud";
import createCrudOptions from "./crud";
import { createPaymentApi } from "./api";
import { notificationProvide } from "/@/views/certd/notification/common";

export default defineComponent({
  name: "PaymentManager",
  setup() {
    const api = createPaymentApi();
    notificationProvide(api);
    const { crudBinding, crudRef, crudExpose } = useFs({ createCrudOptions, context: { api } });

    // 页面打开后获取列表数据
    onMounted(() => {
      crudExpose.doRefresh();
    });
    onActivated(() => {
      crudExpose.doRefresh();
    });

    return {
      crudBinding,
      crudRef
    };
  }
});
</script>
