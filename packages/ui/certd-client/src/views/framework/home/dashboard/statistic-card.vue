<template>
  <div class="statistic-card">
    <a-card>
      <div class="data-item">
        <div class="header">
          <div class="title">{{ title }}</div>
          <div class="more"></div>
        </div>
        <div class="content">
          <div class="statistic">
            <div class="value">80</div>
          </div>
        </div>
        <div class="footer">
          <div class="icon-text"><fs-icon icon="ion:settings-outline" /> 管理流水线</div>
        </div>
      </div>
    </a-card>
  </div>
</template>
<script setup lang="ts">
import { FsIcon } from "@fast-crud/fast-crud";
const props = defineProps<{
  title: string;
}>();
</script>
<style lang="less">
.statistic-card {
  .icon-text {
    display: inline-flex;
    justify-content: left;
    align-items: center;
    .fs-icon {
      margin-right: 5px;
      font-size: 14px;
    }
  }
  .data-item {
    display: flex;
    flex-direction: column;

    .header {
      display: flex;
      justify-content: space-between;
      //padding-bottom: 10px;
      color: #8077a4;
    }
    .content {
      display: flex;
      flex-direction: column;
      height: 100px;
      .statistic {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .value {
          font-size: 50px;
          font-weight: 700;
          color: #2c254e;
        }
      }
    }
    .footer {
      color: #8077a4;
      font-size: 12px;
      text-align: right;
      display: flex;
      justify-content: right;
      align-items: center;
      border-color: #e8e8e8;
      border-style: dashed;
      border-width: 1px 0 0;
      padding-top: 15px;
      > * {
        cursor: pointer;
      }
      margin-bottom: -10px;
    }
  }
}
</style>
