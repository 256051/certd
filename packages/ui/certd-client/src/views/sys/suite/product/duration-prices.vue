<template>
  <div class="cd-suite-value-edit flex-o">
    <div class="flex- 1"><a-checkbox :checked="modelValue === -1" @update:checked="onCheckedChange">无限制</a-checkbox><span class="ml-5"></span></div>
    <div class="ml-10 w-50%">
      <a-input-number v-if="modelValue >= 0" :value="modelValue" class="ml-5" @update:value="onValueChange">
        <template v-if="unit" #addonAfter>{{ unit }}</template>
      </a-input-number>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Form } from "ant-design-vue";
import { dict } from "@fast-crud/fast-crud";

const props = defineProps<{
  modelValue?: number;
}>();

const durationDict = dict({
  data: [
    { label: "1年", value: 365 },
    { label: "2年", value: 730 },
    { label: "3年", value: 1095 },
    { label: "4年", value: 1460 },
    { label: "5年", value: 1825 },
    { label: "6年", value: 2190 },
    { label: "7年", value: 2555 },
    { label: "8年", value: 2920 },
    { label: "9年", value: 3285 },
    { label: "10年", value: 3650 },
    { label: "永久", value: -1 }
  ]
});
const formItemContext = Form.useInjectFormItemContext();

const emit = defineEmits(["update:modelValue"]);

const onCheckedChange = (checked: boolean) => {
  const value = checked ? -1 : 1;
  onValueChange(value);
};

function onValueChange(value: number) {
  emit("update:modelValue", value);
  formItemContext.onFieldChange();
}
</script>
