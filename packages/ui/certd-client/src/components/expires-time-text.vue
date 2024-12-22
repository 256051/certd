<template>
  <span class="cd-expires-time-text">
    <template v-if="label != null">
      {{ label }}
    </template>
    <template v-else>
      <FsTimeHumanize :model-value="value" :use-format-greater="1000000000000" :options="{ units: ['d'] }"></FsTimeHumanize>
    </template>
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
}>();

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
