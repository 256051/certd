<template>
  <fs-page class="fs-pipeline-detail">
    <pipeline-edit v-model:edit-mode="editMode" :pipeline-id="pipelineId" :options="pipelineOptionsRef"></pipeline-edit>
    <a-tour v-model:current="tourCurrent" :open="tourOpen" :steps="tourSteps" @close="tourHandleOpen(false)" />
  </fs-page>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, Ref, ref } from "vue";
import PipelineEdit from "./pipeline/index.vue";
import * as pluginApi from "./api.plugin";
import * as historyApi from "./api.history";
import * as api from "./api";
import { useRoute } from "vue-router";
import { PipelineDetail, PipelineOptions, PluginGroups, RunHistory } from "./pipeline/type";
import { TourProps } from "ant-design-vue";

defineOptions({
  name: "PipelineDetail"
});
const route = useRoute();
const pipelineId: Ref = ref(route.query.id);

const pipelineOptions: PipelineOptions = {
  async getPipelineDetail({ pipelineId }) {
    const detail = await api.GetDetail(pipelineId);
    onLoaded();
    return {
      pipeline: {
        id: detail.pipeline.id,
        stages: [],
        triggers: [],
        ...JSON.parse(detail.pipeline.content || "{}")
      }
    } as PipelineDetail;
  },

  async getHistoryList({ pipelineId }) {
    const list: RunHistory[] = await historyApi.GetList({ pipelineId });
    return list;
  },

  async getHistoryDetail({ historyId }): Promise<RunHistory> {
    const detail = await historyApi.GetDetail({ id: historyId });
    return detail;
  },

  async getPluginGroups() {
    const groups = await pluginApi.GetGroups({});
    return new PluginGroups(groups);
  },

  async doSave(pipelineConfig: any) {
    await api.Save({
      id: pipelineConfig.id,
      content: JSON.stringify(pipelineConfig)
    });
  },
  async doTrigger(options: { pipelineId: number; stepId?: string }) {
    const { pipelineId, stepId } = options;
    await api.Trigger(pipelineId, stepId);
  }
};

const pipelineOptionsRef: Ref<PipelineOptions> = ref(pipelineOptions);

const editMode = ref(false);
if (route.query.editMode !== "false") {
  editMode.value = true;
}

function useTour() {
  const tourOpen = ref<boolean>(false);

  const tourCurrent = ref(0);
  //@ts-ignore
  const tourSteps: TourProps["steps"] = ref([]);

  const tourHandleOpen = (val: boolean): void => {
    initSteps();
    tourOpen.value = val;
  };

  function initSteps() {
    //@ts-ignore
    tourSteps.value = [
      {
        title: "恭喜创建证书流水线成功",
        description: "这里就是我们刚创建的证书任务,点击可以修改证书申请参数",
        target: () => {
          return document.querySelector(".pipeline .stages .stage_0 .task");
        }
      },
      {
        title: "添加部署证书任务",
        description: "证书申请成功之后还需要部署证书，点击这里可以添加部署任务",
        target: () => {
          return document.querySelector(".pipeline .stages .last-stage .tasks .task");
        }
      },
      {
        title: "手动运行流水线",
        description: "点击此处可以手动运行流水线",
        target: () => {
          return document.querySelector(".pipeline .stages .first-stage .tasks .task");
        }
      }
    ];
  }

  return {
    tourOpen,
    tourCurrent,
    tourSteps,
    tourHandleOpen
  };
}

const { tourOpen, tourCurrent, tourSteps, tourHandleOpen } = useTour();

async function onLoaded() {
  await nextTick();
  tourHandleOpen(true);
}
</script>
<style lang="less">
.page-pipeline-detail {
}
</style>
