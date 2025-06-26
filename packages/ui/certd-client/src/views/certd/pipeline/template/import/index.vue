<template>
  <fs-page class="page-template-import">
    <template #header>
      <div class="title flex flex-1 items-center">
        <fs-button class="back" icon="ion:chevron-back-outline" @click="goBack"></fs-button>
        <div class="ml-10">从模版{{ detail?.template?.title }}批量创建流水线</div>
      </div>
    </template>
    <fs-form v-if="importFromOptions" ref="formRef" class="mt-10" v-bind="importFromOptions"> </fs-form>
    <div class="p-10">
      <a-button class="ml-20" type="primary" @click="doImport">确定导入 </a-button>
    </div>
  </fs-page>
</template>

<script setup lang="tsx">
import { onMounted, ref, Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { templateApi } from "../api";
import { createFormOptions } from "/@/views/certd/pipeline/template/import/form";
import { cloneDeep } from "lodash-es";
import { fillPipelineByDefaultForm } from "/@/views/certd/pipeline/certd-form/use";
import { eachSteps } from "/@/views/certd/pipeline/utils";

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

const detail: Ref<TemplateDetail> = ref();

async function getTemplateDetail() {
  if (!templateId) {
    return;
  }
  detail.value = await templateApi.GetDetail(parseInt(templateId));
}

const importFromOptions = ref();
onMounted(async () => {
  await getTemplateDetail();
  importFromOptions.value = createFormOptions(detail);
});

const formRef = ref();
async function doImport() {
  await formRef.value.validate();

  const form = formRef.value.getFormData();

  const importTableRef = formRef.value.getComponentRef("templateProps");

  const templateList = importTableRef.value.getData();

  for (let i = 0; i < templateList.length; i++) {
    const tempInputs = templateList[i];
    const title = tempInputs.title;
    delete tempInputs.title;

    let newPipeline = cloneDeep(detail.value.pipeline);
    newPipeline = fillPipelineByDefaultForm(newPipeline, form);
    //填充模版参数
    const steps: any = {};
    eachSteps(newPipeline, (step: any) => {
      steps[step.id] = step;
    });

    for (const inputKey in tempInputs) {
      const [stepId, key] = inputKey.split(".");
      const step = steps[stepId];
      if (step) {
        step.input[key] = tempInputs[inputKey];
      }
    }

    newPipeline.title = title;
    const groupId = form.groupId;

    await templateApi.CreatePipelineByTemplate({
      title,
      content: JSON.stringify(newPipeline),
      keepHistoryCount: 30,
      groupId,
      templateId: parseInt(templateId),
      pipeline: {
        title: form.title,
        templateProps: templateList,
      },
    });
  }
}
</script>

<style lang="less">
.page-template-import {
  .ant-table-container {
    .ant-select {
      width: 100%;
    }
  }
}
</style>
