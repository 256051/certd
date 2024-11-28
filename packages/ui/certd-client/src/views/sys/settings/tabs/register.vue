<template>
  <div class="sys-settings-form sys-settings-register">
    <a-form :model="formState" name="register" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off" @finish="onFinish">
      <a-form-item label="开启自助注册" :name="['public', 'registerEnabled']">
        <a-switch v-model:checked="formState.public.registerEnabled" />
      </a-form-item>

      <a-form-item label="限制用户流水线数量" :name="['public', 'limitUserPipelineCount']">
        <a-input-number v-model:value="formState.public.limitUserPipelineCount" />
        <div class="helper">0为不限制</div>
      </a-form-item>
      <a-form-item label="管理其他用户流水线" :name="['public', 'managerOtherUserPipeline']">
        <a-switch v-model:checked="formState.public.managerOtherUserPipeline" />
      </a-form-item>

      <template v-if="formState.public.registerEnabled">
        <a-form-item label="开启用户名注册" :name="['public', 'usernameRegisterEnabled']">
          <a-switch v-model:checked="formState.public.usernameRegisterEnabled" />
        </a-form-item>
        <a-form-item label="开启邮箱注册" :name="['public', 'emailRegisterEnabled']">
          <a-switch v-model:checked="formState.public.emailRegisterEnabled" />
          <div class="helper">需要<router-link to="/sys/settings/email">设置邮箱服务器</router-link></div>
        </a-form-item>
        <a-form-item label="开启密码登录" :name="['public', 'passwordLoginEnabled']">
          <a-switch v-model:checked="formState.public.passwordLoginEnabled" />
        </a-form-item>
        <a-form-item label="开启手机号登录、注册" :name="['public', 'smsLoginEnabled']">
          <a-switch v-model:checked="formState.public.smsLoginEnabled" />
        </a-form-item>
        <template v-if="formState.public.smsLoginEnabled">
          <a-form-item label="短信提供商" :name="['private', 'sms', 'type']">
            <a-select v-model:value="formState.private.sms.type">
              <a-select-option value="aliyun">阿里云</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="阿里云授权" :name="['private', 'sms', 'config', 'accessId']">
            <access-selector v-model="formState.private.sms.config.accessId" />
          </a-form-item>

          <a-form-item label="短信签名" :name="['private', 'sms', 'config', 'signName']">
            <a-input v-model:value="formState.private.sms.config.signName" />
          </a-form-item>

          <a-form-item label="验证码模版ID" :name="['private', 'sms', 'config', 'codeTemplateId']">
            <a-input v-model:value="formState.private.sms.config.codeTemplateId" />
            <div class="helper">需要配置一个变量为{code}的验证码模版</div>
          </a-form-item>
        </template>
      </template>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button :loading="saveLoading" type="primary" html-type="submit">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import { SysSettings } from "/@/views/sys/settings/api";
import * as api from "/@/views/sys/settings/api";
import { merge } from "lodash-es";
import { useSettingStore } from "/@/store/modules/settings";
import { notification } from "ant-design-vue";
import { util } from "/@/utils";
import AccessSelector from "/@/views/certd/access/access-selector/index.vue";

defineOptions({
  name: "SettingRegister"
});

const formState = reactive<Partial<SysSettings>>({
  public: {
    registerEnabled: false
  },
  private: {
    sms: {
      type: "aliyun",
      config: {}
    }
  }
});

async function loadSysSettings() {
  const data: any = await api.SysSettingsGet();
  merge(formState, data);
}

const saveLoading = ref(false);
loadSysSettings();
const settingsStore = useSettingStore();
const onFinish = async (form: any) => {
  try {
    saveLoading.value = true;
    await api.SysSettingsSave(form);
    await settingsStore.loadSysSettings();
    notification.success({
      message: "保存成功"
    });
  } finally {
    saveLoading.value = false;
  }
};
</script>
<style lang="less">
.sys-settings-site {
}
</style>
