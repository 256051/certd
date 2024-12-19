<template>
  <a-modal class="order-modal">
    <div class="order-box"></div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { OrderModalOpenReq } from "/@/views/certd/suite/api";

const openRef = ref(false);

async function open(opts: OrderModalOpenReq) {
  openRef.value = true;

  const productDetail = api.ProductInfo(opts.productId);
}

defineExpose({
  open
});
</script>
