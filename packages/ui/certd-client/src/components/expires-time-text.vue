<template>
  <span class="cd-expires-time-text">
    <component :is="wrapperComp" :color="color">
      <template v-if="label != null">
        {{ label }}
      </template>
      <template v-else>
        <FsTimeHumanize :model-value="value" :use-format-greater="1000000000000" :options="{ units: ['d'] }"></FsTimeHumanize>
      </template>
    </component>
  </span>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import { computed } from "vue";

defineOptions({
  name: "ExpiresTimeText"
});

const props = defineProps<{
  value?: number;
  mode?: "tag" | "text";
}>();

const wrapperComp = computed(() => {
  if (props.mode === "tag") {
    return "a-tag";
  }
  return "span";
});

const color = computed(() => {
  if (props.value == null) {
    return "";
  }
  if (props.value === -1) {
    return "green";
  }

  //小于3天 红色
  if (dayjs().add(3, "day").valueOf() > props.value) {
    return "red";
  }

  return "blue";
});

const label = computed(() => {
  if (props.value == null) {
    return "";
  }
  if (props.value === -1) {
    return "永久";
  }
  return null;
});
</script>
