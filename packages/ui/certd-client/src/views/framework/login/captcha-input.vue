<template>
  <div ref="captchaRef" class="captcha_input"></div>
</template>
<script setup lang="ts">
import { onMounted, defineProps, defineEmits, ref } from "vue";
import { useSettingStore } from "/@/store/settings";
import { request } from "/src/api/service";
import { notification } from "ant-design-vue";
const props = defineProps<{
  modelValue?: any;
}>();
const emit = defineEmits(["update:modelValue", "change"]);

const captchaRef = ref(null);
// const addonApi = createAddonApi();
const settingStore = useSettingStore();

const api = {
  async getClientParams(): Promise<any> {
    const res = await request({
      url: "/captcha/getParams",
      method: "post",
    });
    return res;
  },
};

// async function getCaptchaAddonDefine() {
//   const type = settingStore.public.captchaType;
//   const define = addonApi.getDefineByType("captcha", type);
// }

const captchaInstanceRef = ref({});
async function init() {
  const params = await api.getClientParams();
  // @ts-ignore
  initGeetest4(
    {
      captchaId: params.captchaId,
    },
    (captcha: any) => {
      // captcha为验证码实例
      captcha.appendTo(captchaRef.value); // 调用appendTo将验证码插入到页的某一个元素中，这个元素用户可以自定义
      captchaInstanceRef.value.instance = captcha;
      captchaInstanceRef.value.captchaId = params.captchaId;
    }
  );
}

async function getValidatedForm() {
  if (!captchaInstanceRef.value?.instance) {
    notification.error({
      message: "验证码还未初始化",
    });
    return false;
  }
  const result = await captchaInstanceRef.value.instance.getValidate();
  if (!result) {
    notification.error({
      message: "请先完成验证码验证",
    });
    return false;
  }
  result.captcha_id = captchaInstanceRef.value.captchaId;

  return result;
}

function onChange(value: string) {
  emit("update:modelValue", value);
  emit("change", value);
}

defineExpose({
  getValidatedForm,
});

onMounted(async () => {
  await init();
});
</script>
<style lang="less">
.captcha_input {
  .geetest_captcha {
    .geetest_holder {
      width: 100%;
    }
  }
}
</style>
