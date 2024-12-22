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
        <duration-value v-model="formRef.duration"></duration-value>
      </div>
      <div class="flex-o mt-5">价格： <price-input :edit="false" :model-value="durationSelected.price"></price-input></div>

      <div class="flex-o mt-5">
        支付方式：
        <fs-dict-select v-model:value="formRef.payType" :dict="paymentsDictRef" style="width: 200px"> </fs-dict-select>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { GetPaymentTypes, OrderModalOpenReq, TradeCreate } from "/@/views/certd/suite/api";
import SuiteValue from "/@/views/sys/suite/product/suite-value.vue";
import PriceInput from "/@/views/sys/suite/product/price-input.vue";
import modal from "/@/views/certd/notification/notification-selector/modal/index.vue";
import { dict } from "@fast-crud/fast-crud";
import { notification } from "ant-design-vue";
import DurationValue from "/@/views/sys/suite/product/duration-value.vue";

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
}
const paymentsDictRef = dict({
  async getData() {
    return await GetPaymentTypes();
  },
  onReady: ({ dict }) => {
    if (dict.data.length > 0) {
      formRef.value.payType = dict.data[0].value;
    }
  }
});

async function orderCreate() {
  console.log("orderCreate", formRef.value);
  if (!formRef.value.payType) {
    notification.error({
      message: "请选择支付方式"
    });
    return;
  }
  const paymentReq = await TradeCreate({
    productId: formRef.value.productId,
    duration: formRef.value.duration,
    num: formRef.value.num ?? 1,
    payType: formRef.value.payType
  });

  //跳转到对应的页面
  // http://pay.docmirror.cn/submit.php
  //易支付表单提交
  if (formRef.value.payType === "yizhifu") {
    doYizhifu(paymentReq);
  } else {
    //支付宝、微信支付
    window.open(paymentReq);
  }

  modal.open({
    title: "支付",
    content: "请在新页面完成支付",
    onOk: () => {
      openRef.value = false;
    },
    cancelText: "取消支付",
    onText: "已完成支付"
  });
}

function doYizhifu(paymentReq: any) {
  console.log("doYizhifu", paymentReq);
  /**
   * 商户ID	pid	是	Int	1001
   * 支付方式	type	否	String	alipay	支付方式列表
   * 商户订单号	out_trade_no	是	String	20160806151343349
   * 异步通知地址	notify_url	是	String	http://www.pay.com/notify_url.php	服务器异步通知地址
   * 跳转通知地址	return_url	是	String	http://www.pay.com/return_url.php	页面跳转通知地址
   * 商品名称	name	是	String	VIP会员	如超过127个字节会自动截取
   * 商品金额	money	是	String	1.00	单位：元，最大2位小数
   * 业务扩展参数	param	否	String	没有请留空	支付后原样返回
   * 签名字符串	sign	是	String	202cb962ac59075b964b07152d234b70	签名算法点此查看
   * 签名类型	sign_type	是	String	MD5	默认为MD5
   */
  const form = document.createElement("form");
  form.action = paymentReq.api;
  form.method = "post";
  form.target = "_blank";
  // form.style.display = "none";
  document.body.appendChild(form);

  function createInput(name: string, value: any) {
    const input = document.createElement("input");
    input.type = "input";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  const body = paymentReq.body;
  const keys = Object.keys(body);
  keys.forEach((key) => {
    createInput(key, body[key]);
  });

  form.submit();
  //delete form
  document.body.removeChild(form);
}

defineExpose({
  open
});
</script>
