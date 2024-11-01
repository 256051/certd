<template>
  <a-steps :current="3" class="mt-10" size="small" :items="steps" @click="goPipeline"></a-steps>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

type Step = {
  title: string;
  description?: string;
};

import { ref } from "vue";

const steps = ref<Step[]>([
  {
    title: "创建证书流水线"
  },
  {
    title: "添加部署任务"
  },
  {
    title: "定时运行"
  }
]);

const router = useRouter();
function goPipeline() {
  router.push({ path: "/certd/pipeline" });
}
</script>
