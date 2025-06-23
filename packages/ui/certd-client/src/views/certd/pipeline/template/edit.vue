<template>
  <fs-page>
    <template #header>
      <div class="title flex flex-1">
        <fs-button class="back" icon="ion:chevron-back-outline" @click="goBack"></fs-button>
        <text-editable v-if="detail?.template" v-model="detail.template.title" class="ml-10" :hover-show="false"></text-editable>
      </div>

      <div class="more flex items-center flex-1 justify-end">
        <loading-button type="primary" @click="doSave">保存</loading-button>
      </div>
    </template>
    <div class="page-template-edit">
      <div class="base"></div>
      <div class="props flex p-10">
        <div class="task-list w-50%">
          <div class="block-title">
            原始任务参数
            <div class="helper">点击加号，将字段作为模版变量</div>
          </div>
          <a-collapse v-model:active-key="activeKey">
            <a-collapse-panel v-for="(step, stepId) in steps" :key="stepId" class="step-item" :header="step.title">
              <div class="step-inputs flex flex-wrap">
                <div v-for="(input, key) of step.input" :key="key" class="hover:bg-gray-100 p-5 w-full xl:w-[50%]">
                  <div class="flex flex-between" :title="input.define.helper">
                    <div class="flex flex-1 overflow-hidden mr-5">
                      <span style="min-width: 140px" class="bas">
                        <a-tag color="green">{{ input.define.title }}</a-tag>
                      </span>
                      <span :title="input.value" class="ellipsis flex-1 text-nowrap">= {{ input.value }}</span>
                    </div>
                    <fs-button v-if="!templateProps.input[stepId + '.' + key]" size="small" type="primary" icon="ion:add" title="添加为模版变量" @click="addToProps(step.id, key)"></fs-button>
                    <fs-button v-else size="small" danger icon="ion:close" title="删除模版变量" @click="removeToProps(step.id, key)" />
                  </div>
                </div>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>

        <div class="template-props w-50%">
          <div class="block-title">
            模版变量
            <div class="helper">根据模版创建流水线时，只需要输入以下这些字段，其他字段将使用左侧的值</div>
          </div>
          <div class="p-10">
            <!--          <fs-form v-bind="templateFormOptions"></fs-form>-->
            <template-form :input="templateProps.input" :pipeline="detail?.pipeline"></template-form>
          </div>
        </div>
      </div>
    </div>
  </fs-page>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { templateApi } from "./api";
import { usePluginStore } from "/@/store/plugin";
import { useStepHelper } from "./utils";
import TemplateForm from "./form.vue";

const route = useRoute();
const templateId = route.query.templateId as string;

const router = useRouter();

function goBack() {
  router.back();
}

type TemplateDetail = {
  template: any;
  pipeline: any;
};
const templateProps: Ref = ref({
  input: {},
});
const detail: Ref<TemplateDetail> = ref();
async function getTemplateDetail() {
  const res = await templateApi.GetDetail(parseInt(templateId));
  detail.value = res;
  templateProps.value = JSON.parse(res.template.content ?? "{input:{}}");
}

const pluginStore = usePluginStore();

const activeKey = ref([]);
onMounted(async () => {
  await pluginStore.init();
  await getTemplateDetail();
  nextTick(() => {
    const keys = Object.keys(steps.value);
    if (keys.length > 0) {
      activeKey.value = [keys[0]];
    }
  });
});

const { getStepsMap } = useStepHelper(pluginStore);
const steps = computed(() => {
  if (!detail.value) {
    return {};
  }

  return getStepsMap(detail.value.pipeline);
});

function addToProps(stepId: string, key: any) {
  if (!templateProps.value.input) {
    templateProps.value.input = {};
  }
  const inputKey = stepId + "." + key;
  templateProps.value.input[inputKey] = true;
}

function removeToProps(stepId: string, key: any) {
  const inputKey = stepId + "." + key;
  delete templateProps.value.input[inputKey];
}

async function doSave() {
  await templateApi.UpdateObj({
    id: detail.value.template.id,
    title: detail.value.template.title,
    content: JSON.stringify(templateProps.value),
  });
}
</script>
