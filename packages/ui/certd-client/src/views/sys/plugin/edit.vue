<template>
  <fs-page class="page-plugin-edit">
    <template #header>
      <div class="title">
        插件编辑
        <span class="sub">
          <span class="name">{{ plugin.title }} 【{{ plugin.author }}/{{ plugin.name }}】 </span>
        </span>
      </div>
      <div class="more">
        <a-button class="mr-1" type="primary" :loading="saveLoading" @click="doSave">保存</a-button>
        <a-button type="primary" @click="doTest">测试运行</a-button>
      </div>
    </template>
    <div class="pi-plugin-editor">
      <div class="metadata">
        <a-tabs type="card">
          <a-tab-pane key="editor" tab="元数据"> </a-tab-pane>
        </a-tabs>
        <div class="metadata-body">
          <code-editor id="metadata" v-model:model-value="plugin.metadata" language="yaml"></code-editor>
        </div>
      </div>
      <div class="script">
        <a-tabs type="card">
          <a-tab-pane key="script" tab="脚本"> </a-tab-pane>
        </a-tabs>
        <code-editor id="content" v-model:model-value="plugin.content" language="javascript"></code-editor>
      </div>
    </div>
  </fs-page>
</template>
<script lang="ts" setup>
import { onMounted, provide, ref } from "vue";
import { useRoute } from "vue-router";
import * as api from "./api";
import yaml from "js-yaml";
import { notification } from "ant-design-vue";

const CertApplyPluginNames = ["CertApply", "CertApplyLego", "CertApplyUpload"];
defineOptions({
  name: "SysPluginEdit",
});
const route = useRoute();

const plugin = ref<any>({});

async function getPlugin() {
  const id = route.query.id;
  const pluginObj = await api.GetObj(id);
  if (!pluginObj.metadata) {
    pluginObj.metadata = yaml.dump({
      input: {
        cert: {
          title: "前置任务生成的证书",
          component: {
            name: "output-selector",
            from: [...CertApplyPluginNames],
          },
        },
      },
      output: {},
    });
  }
  plugin.value = pluginObj;
}

onMounted(async () => {
  getPlugin();
});

provide("get:plugin", () => {
  return plugin;
});

const saveLoading = ref(false);
async function doSave() {
  saveLoading.value = true;
  try {
    await api.UpdateObj(plugin.value);
    notification.success({
      message: "保存成功",
    });
  } finally {
    saveLoading.value = false;
  }
}

async function doTest() {
  await doSave();
  const result = await api.DoTest({
    id: plugin.value.id,
    input: {},
  });
  notification.success({
    message: "测试已开始",
    description: result,
  });
}
</script>

<style lang="less">
.page-plugin-edit {
  .pi-plugin-editor {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    padding: 20px;
    .fs-editor-code {
      height: 100%;
      flex: 1;
    }

    .metadata {
      width: 600px;
      max-width: 50%;
      margin-right: 20px;
      display: flex;
      flex-direction: column;
      height: 100%;
      .metadata-body {
        height: 100%;
        flex: 1;
      }

      .metadata-editor {
        height: 100%;
        flex: 1;
        .ant-tabs-content {
          height: 100%;
        }
      }
      .metadata-source {
        height: 100%;
      }
    }
    .script {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  }
}
</style>
