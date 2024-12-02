<template>
  <div class="notification-selector">
    <div class="flex-o w-100">
      <fs-dict-select
        class="flex-1"
        :value="modelValue"
        :dict="optionsDictRef"
        :disabled="disabled"
        :render-label="renderLabel"
        :slots="selectSlots"
        :allow-clear="true"
        @update:value="onChange"
      />
      <fs-table-select
        ref="tableSelectRef"
        class="flex-0"
        :model-value="modelValue"
        :dict="optionsDictRef"
        :create-crud-options="createCrudOptions"
        :crud-options-override="{
          search: { show: false },
          table: {
            scroll: {
              x: 540
            }
          }
        }"
        :show-current="false"
        :show-select="false"
        :dialog="{ width: 960 }"
        :destroy-on-close="false"
        @update:model-value="onChange"
      >
        <template #default="scope">
          <fs-button class="ml-5" :disabled="disabled" :size="size" type="primary" icon="ant-design:edit-outlined" @click="scope.open"></fs-button>
        </template>
      </fs-table-select>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { inject, ref, Ref, watch } from "vue";
import { createApi } from "../api";
import { message } from "ant-design-vue";
import { dict } from "@fast-crud/fast-crud";
import createCrudOptions from "../crud";

defineOptions({
  name: "NotificationSelector"
});

const props = defineProps<{
  modelValue?: number | string;
  type?: string;
  placeholder?: string;
  size?: string;
  disabled?: boolean;
}>();

const onChange = async (value: number) => {
  await emitValue(value);
};

const emit = defineEmits(["update:modelValue", "selectedChange", "change"]);

const api = createApi();

// const types = ref({});
// async function loadNotificationTypes() {
//   const types = await api.GetDefineTypes();
//   const map: any = {};
//   for (const item of types) {
//     map[item.type] = item;
//   }
//   types.value = map;
// }
// loadNotificationTypes();
const tableSelectRef = ref();
const optionsDictRef = dict({
  url: "/pi/notification/options",
  value: "id",
  label: "name",
  onReady: ({ dict }) => {
    const data = [
      {
        id: 0,
        name: "使用默认通知",
        icon: "ion:notifications"
      },
      ...dict.data
    ];
    dict.setData(data);
  }
});
const renderLabel = (option: any) => {
  return <span>{option.name}</span>;
};

async function openTableSelectDialog(e: any) {
  e.preventDefault();
  await tableSelectRef.value.open();
  await tableSelectRef.value.crudExpose.openAdd({});
}
const selectSlots = ref({
  dropdownRender({ menuNode }: any) {
    const res = [];
    res.push(menuNode);
    res.push(<a-divider style="margin: 4px 0" />);
    res.push(<a-space style="padding: 4px 8px" />);
    res.push(<fs-button class="w-100" type="text" icon="plus-outlined" text="新建通知渠道" onClick={openTableSelectDialog}></fs-button>);
    return res;
  }
});

const target: Ref<any> = ref({});

function clear() {
  if (props.disabled) {
    return;
  }
  emitValue(null);
}

async function emitValue(value: any) {
  const target = optionsDictRef.dataMap[value];
  if (value !== 0 && pipeline?.value && target && pipeline.value.userId !== target.userId) {
    message.error("对不起，您不能修改他人流水线的通知");
    return;
  }
  emit("change", value);
  emit("update:modelValue", value);
  emit("selectedChange", target);
}

watch(
  () => {
    return props.modelValue;
  },
  async (value) => {
    await optionsDictRef.loadDict();
    target.value = optionsDictRef.dataMap[value];
  },
  {
    immediate: true
  }
);

//当不在pipeline中编辑时，可能为空
const pipeline = inject("pipeline", null);
</script>
<style lang="less">
.notification-selector {
  width: 100%;
}
</style>
