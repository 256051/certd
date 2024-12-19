<template>
  <a-card :title="product.title">
    <template #extra>
      <a-tag>{{ product.type }}</a-tag>
    </template>

    <div>{{ product.intro }}</div>
    <div class="hr">
      <div class="flex-between mt-5">流水线条数：<suite-value :model-value="product.content.maxPipelineCount" /></div>
      <div class="flex-between mt-5">域名数量： <suite-value :model-value="product.content.maxDomainCount" /></div>
      <div class="flex-between mt-5">部署次数： <suite-value :model-value="product.content.maxDeployCount" /></div>
      <div class="flex-between mt-5">
        证书监控：
        <span v-if="product.content.sproductonitor">支持</span>
        <span v-else>不支持</span>
      </div>
    </div>

    <div class="duration flex-between mt-5 hr">
      <div class="flex-o">时长</div>
      <div class="duration-list">
        <div
          v-for="dp of product.durationPrices"
          :key="dp.duration"
          class="duration-product"
          :class="{ active: selected.duration === dp.duration }"
          @click="selected = dp"
        >
          {{ durationDict.dataMap[dp.duration]?.label }}
        </div>
      </div>
    </div>

    <div class="price flex-between mt-5 hr">
      <div class="flex-o">价格</div>
      <div class="flex-o price-text">
        <price-input style="font-size: 18px; color: red" :model-value="selected?.price" :edit="false" />
        <span class="ml-5" style="font-size: 12px"> / {{ durationDict.dataMap[selected.duration]?.label }}</span>
      </div>
    </div>

    <template #actions>
      <setting-outlined key="setting" />
      <a-button type="primary" @click="doOrder">立即购买</a-button>
    </template>
  </a-card>
</template>
<script setup lang="ts">
import { durationDict } from "/@/views/certd/suite/api";
import SuiteValue from "/@/views/sys/suite/product/suite-value.vue";
import PriceInput from "/@/views/sys/suite/product/price-input.vue";
import { ref } from "vue";
import * as api from "./api";
const props = defineProps<{
  product: any;
}>();
const selected = ref(props.product.durationPrices[0]);
async function doOrder() {
  console.log("doOrder", selected.value);
  const res = await api.OrderCreate({
    productId: props.product.id,
    duration: selected.value.duration
  });
}
</script>
