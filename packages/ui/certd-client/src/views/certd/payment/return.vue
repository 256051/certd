<template>
  <div class="cd-payment-return">
    <a-card title="支付结果" class="mt-10">
      <div class="flex-o">
        <div class="flex-1">
          <a-tag v-if="payResult" color="green" class="m-0">支付成功</a-tag>
          <a-tag v-else color="red" class="m-0">支付失败</a-tag>
        </div>
        <div class="m-10">
          <a-button type="primary" @click="goHome">回首页</a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as api from "./api";
const route = useRoute();
const type = route.params.type as string;

const query = route.query;

async function checkNotify() {
  const res = await api.Notify(type, query);
  if (res === "success") {
    return true;
  }
  return false;
}

const payResult: Ref = ref(null);
async function check() {
  const pass = await checkNotify();
  if (!pass) {
    payResult.value = false;
  } else {
    payResult.value = true;
  }
}

const router = useRouter();
function goHome() {
  router.push({
    path: "/"
  });
}
</script>
