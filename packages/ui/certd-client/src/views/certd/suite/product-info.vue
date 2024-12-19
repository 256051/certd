<template>
  <a-card :title="product.title" class="product-card">
    <template #extra>
      <a-tag>{{ product.type }}</a-tag>
    </template>

    <div>{{ product.intro }}</div>
    <div class="hr">
      <div class="flex-between mt-5">
        <div class="flex-o"><fs-icon icon="ant-design:check-outlined" class="color-green mr-5" /> 流水线条数：</div>
        <suite-value :model-value="product.content.maxPipelineCount" unit="条" />
      </div>
      <div class="flex-between mt-5">
        <div class="flex-o"><fs-icon icon="ant-design:check-outlined" class="color-green mr-5" />域名数量：</div>
        <suite-value :model-value="product.content.maxDomainCount" unit="个" />
      </div>
      <div class="flex-between mt-5">
        <div class="flex-o"><fs-icon icon="ant-design:check-outlined" class="color-green mr-5" /> 部署次数：</div>
        <suite-value :model-value="product.content.maxDeployCount" unit="次" />
      </div>
      <div class="flex-between mt-5">
        <div class="flex-o"><fs-icon icon="ant-design:check-outlined" class="color-green mr-5" /> 证书监控：</div>
        <a-tag v-if="product.content.sproductonitor" color="green" class="m-0">支持</a-tag>
        <a-tag v-else color="gray" class="m-0">不支持</a-tag>
      </div>
    </div>

    <div class="duration flex-between mt-5 hr">
      <div class="flex-o">时长</div>
      <div class="duration-list">
        <div
          v-for="dp of product.durationPrices"
          :key="dp.duration"
          class="duration-item"
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
      <a-button type="primary" @click="doOrder">立即购买</a-button>
    </template>
  </a-card>
</template>
<script setup lang="ts">
import { durationDict } from "/@/views/certd/suite/api";
import SuiteValue from "/@/views/sys/suite/product/suite-value.vue";
import PriceInput from "/@/views/sys/suite/product/price-input.vue";
import { ref } from "vue";

const props = defineProps<{
  product: any;
}>();
const selected = ref(props.product.durationPrices[0]);

const emit = defineEmits(["order"]);
async function doOrder() {
  emit("order", { product: props.product, productId: props.product.id, duration: selected.value.duration });
}
</script>

<style lang="less">
.product-card {
  .duration-list {
    display: flex;
    .duration-item {
      width: 50px;
      border: 1px solid #cdcdcd;
      text-align: center;
      padding: 2px;
      margin: 2px;
      cursor: pointer;

      &:hover {
        border-color: #1890ff;
      }
      &.active {
        border-color: #a6fba3;
        background-color: #c1eafb;
      }
    }
  }
}
</style>
