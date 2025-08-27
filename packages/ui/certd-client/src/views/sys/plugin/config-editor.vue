<template>
  <div class="plugin-config">
    <div class="origin-metadata w-100%">
      <div class="block-title">
        自定义插件参数配置
        <div class="helper">1111</div>
      </div>
      <div class="p-10">
        <div ref="formRef" class="config-form w-full" :label-col="labelCol" :wrapper-col="wrapperCol">
          <template v-for="(item, key) in originInputs" :key="key">
            <div>
              <div :label="item.title">
                <label class="flex mt-5">
                  <span class="w-20 flex-shrink-0">默认值</span>
                  <rollbackable :value="configForm[key].value" @set="configForm[key].value = item.value ?? null" @clear="unset(configForm, `${key}.value`)"></rollbackable>
                </label>
                <label class="flex mt-5">
                  <span class="w-20 flex-shrink-0">是否显示</span>
                  <rollbackable :value="configForm[key].show" @set="set(configForm, `${key}.show`, item.show ?? null)" @clear="unset(configForm, `${key}.show`)"></rollbackable>
                </label>
                <label class="flex mt-5">
                  <span class="w-20 flex-shrink-0">帮助说明</span>
                  {{ configForm[key].helper }}
                  <rollbackable :value="configForm[key].helper" @setter="configForm[key].helper = item.helper" @clear1="delete configForm[key].helper"></rollbackable>
                </label>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, Ref, unref } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as api from "./api";
import { usePluginStore } from "/@/store/plugin";
import { cloneDeep, get, merge, set, unset } from "lodash-es";
import Rollbackable from "./rollbackable.vue";
const route = useRoute();
const router = useRouter();
const pluginStore = usePluginStore();
const props = defineProps<{
  plugin: any;
}>();

const pluginMetadata = ref<any>("");
const currentPlugin = ref();
console.log("111111111111111111111");
const labelCol = ref({
  span: null,
  style: {
    width: "145px",
  },
});
const wrapperCol = ref({ span: 16 });
const configForm: any = reactive({});

function getScope() {
  return {
    form: configForm,
  };
}
function getScopeFunc() {
  return getScope;
}
function getForm() {
  return configForm;
}

const editableKeys = ref([
  { key: "value", label: "默认值" },
  { key: "show", label: "是否显示", component: { name: "a-switch", vModel: "checked" } },
  { key: "helper", label: "帮助说明", component: { name: "a-textarea", vModel: "value", rows: 4 } },
]);

const originInputs = computed(() => {
  if (!currentPlugin.value) {
    return;
  }
  const input = cloneDeep(currentPlugin.value.input);
  const newInputs: any = {};

  for (const key in input) {
    const value = input[key];
    value.key = key;
    const newInput: any = cloneDeep(value);
    newInputs[key] = newInput;
  }
  return newInputs;
});

function clearFormValue(key: string) {
  unset(configForm, key);
  console.log(key, configForm);
}

async function loadPluginSetting() {
  currentPlugin.value = await pluginStore.getPluginDefine(props.plugin.name);
  for (const key in currentPlugin.value.input) {
    configForm[key] = {};
  }
  const setting = props.plugin.sysSetting;
  if (setting) {
    const settingJson = JSON.parse(setting);
    merge(configForm, settingJson.metadata);
  }
}

onMounted(async () => {
  await loadPluginSetting();
});

function doSave() {}
</script>

<style lang="less">
.plugin-config {
  pre {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  }
}
</style>
