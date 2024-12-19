<template>
  <a-modal v-model:open="openRef" class="order-modal" title="订单确认" @ok="orderCreate">
    <div v-if="product" class="order-box">
      <div class="flex-o mt-5">套餐：{{ product.title }}</div>
      <div class="flex-o mt-5">说明：{{ product.intro }}</div>
      <div class="flex-o mt-5">
        <span class="flex-o">规格：</span>
        <span class="flex-o">流水线<suite-value class="ml-5" :model-value="product.content.maxPipelineCount" unit="条" />；</span>
        <span class="flex-o">域名<suite-value class="ml-5" :model-value="product.content.maxDomainCount" unit="个" />；</span>
        <span class="flex-o">部署次数<suite-value class="ml-5" :model-value="product.content.maxDeployCount" unit="次" />；</span>
      </div>

      <div class="flex-o mt-5">
        时长：
        <a-tag color="green"> {{ durationDict.dataMap[formRef.duration]?.label }}</a-tag>
      </div>
      <div class="flex-o mt-5">价格： <price-input :edit="false" :model-value="durationSelected.price"></price-input></div>

      <div class="flex-o mt-5">
        支付方式：
        <a-select v-model:value="formRef.payType">
          <a-select-option value="alipay">支付宝</a-select-option>
        </a-select>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { durationDict, OrderModalOpenReq, TradeCreate, TradeCreateReq } from "/@/views/certd/suite/api";
import SuiteValue from "/@/views/sys/suite/product/suite-value.vue";
import PriceInput from "/@/views/sys/suite/product/price-input.vue";

const openRef = ref(false);

const product = ref<any>(null);
const formRef = ref<any>({});
const durationSelected = ref<any>(null);
async function open(opts: OrderModalOpenReq) {
  openRef.value = true;

  product.value = opts.product;

  durationSelected.value = opts.product.durationPrices.find((dp: any) => dp.duration === opts.duration);
  formRef.value.productId = opts.product.id;
  formRef.value.duration = opts.duration;
  formRef.value.num = opts.num ?? 1;
  formRef.value.payType = "alipay";
}

async function orderCreate() {
  console.log("orderCreate", formRef.value);
  const res = await TradeCreate({
    productId: formRef.value.productId,
    duration: formRef.value.duration,
    num: formRef.value.num ?? 1,
    payType: formRef.value.payType
  });

  //跳转到对应的页面
}

defineExpose({
  open
});
</script>
