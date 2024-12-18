<template>
  <div v-if="target" class="cd-suite-value">
    <a-tag :color="target.color">{{ target.label }}</a-tag>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  modelValue: number;
}>();

const target = computed(() => {
  if (!props.modelValue) {
    return {};
  }
  if (props.modelValue === -1) {
    return {
      value: -1,
      label: "无限制",
      color: "green"
    };
  } else if (props.modelValue === 0) {
    return {
      value: 0,
      label: "-",
      color: "red"
    };
  } else {
    return {
      value: props.modelValue,
      label: props.modelValue,
      color: "blue"
    };
  }
});
</script>
