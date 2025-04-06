<template>
  <div class="plugin-inputs">
    <div class="actions mb-1">
      <a-button type="primary" @click="addNewField"> 添加 </a-button>
    </div>

    <div class="inputs">
      <div class="inputs-inner">
        <a-collapse v-model:active-key="activeKey">
          <a-collapse-panel v-for="(item, index) of inputs" :key="index">
            <template #header> {{ item.key }} ： {{ item.title }} </template>
            <a-form :label-col="{ style: { width: '80px' } }">
              <a-form-item label="字段名称">
                <a-input v-model:value="item.key" />
              </a-form-item>
              <a-form-item label="字段标题">
                <a-input v-model:value="item.title" />
              </a-form-item>
              <a-form-item label="字段说明">
                <a-input v-model:value="item.helper" />
              </a-form-item>
              <a-form-item label="默认值">
                <a-input v-model:value="item.value" />
              </a-form-item>
              <a-form-item label="必填">
                <a-switch v-model:checked="item.required" />
              </a-form-item>
              <a-form-item label="组件配置">
                <fs-editor-code v-model:model-value="item.component" language="yaml" />
              </a-form-item>
            </a-form>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref, inject, toRef } from "vue";
import { useFormWrapper } from "@fast-crud/fast-crud";

const activeKey = ref([]);

const getPlugin: any = inject("get:plugin");
const pluginRef = getPlugin();
const inputs = toRef(pluginRef.value.metadata, "input");
if (!inputs.value) {
  inputs.value = {};
}
function addNewField() {
  const { openCrudFormDialog } = useFormWrapper();

  openCrudFormDialog({
    crudOptions: {
      form: {
        labelCol: { style: { width: "80px" } },
        wrapperCol: { span: 18 },
        wrapper: {
          title: "添加输入",
        },
        doSubmit({ form }: any) {
          debugger;
          const key = form.key;
          const title = form.title;
          inputs.value[key] = {
            key,
            title,
            component: `
  name: a-input
    
    `,
            helper: "",
            value: undefined,
            required: false,
          };
        },
      },
      columns: {
        key: {
          title: "字段名称",
          type: "text",
          form: {
            helper: "英文字段名称",
          },
        },
        title: {
          title: "字段标题",
          type: "text",
          form: {
            helper: "字段标题",
          },
        },
      },
    },
  });
}
</script>

<style lang="less">
.plugin-inputs {
  display: flex;
  flex-direction: column;
  height: 100%;
  .actions {
  }
  .inputs {
    flex: 1;
    height: 100%;
    overflow: hidden;
    .inputs-inner {
      height: 100%;
      overflow-y: auto;
    }
  }
}
</style>
