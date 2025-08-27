<script setup lang="ts">
import { cloneDeep, get, merge, set, unset } from "lodash-es";
import { defineProps } from "vue";
const props = defineProps<{ value: any }>();

const emits = defineEmits(["setter", "clear1"]);
function setValue() {
  console.log("33333");
  emits("setter");
}
function clearValue() {
  console.log("4444");
  emits("clear1");
}
</script>

<template>
  <div class="rollbackable">
    <div class="flex">
      <div>
        <slot v-if="value === undefined" name="default"></slot>
        <slot v-else name="edit"></slot>
      </div>
      <div>
        <div v-if="value === undefined" type="primary" size="small" @click.stop="setValue">自定义</div>
        <div v-else style="margin-left: 100px" type="primary" size="small" @click.stop="clearValue">还原</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less"></style>
