<template>
  <fs-page class="page-suite-buy">
    <template #header>
      <div class="title">套餐购买</div>
    </template>
    <div class="suite-buy-content">
      <a-row :gutter="12">
        <a-col v-for="item of suites" :key="item.id" class="mb-10" :xs="12" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
          <a-card :title="item.title">
            <template #extra>
              <a-tag>{{ item.type }}</a-tag>
            </template>

            <div>{{ item.intro }}</div>
            <div class="hr">
              <div class="flex-between mt-5">流水线条数：<suite-value :model-value="item.content.maxPipelineCount" /></div>
              <div class="flex-between mt-5">域名数量： <suite-value :model-value="item.content.maxDomainCount" /></div>
              <div class="flex-between mt-5">部署次数： <suite-value :model-value="item.content.maxDeployCount" /></div>
              <div class="flex-between mt-5">
                证书监控：
                <span v-if="item.content.siteMonitor">支持</span>
                <span v-else>不支持</span>
              </div>
            </div>

            <div class="duration flex-between mt-5 hr">
              <div class="flex-o">时长</div>
              <div class="duration-list">
                <div
                  v-for="dp of item.durationPrices"
                  :key="dp.duration"
                  class="duration-item"
                  :class="{ active: item._selected.duration === dp.duration }"
                  @click="item._selected = dp"
                >
                  {{ durationDict.dataMap[dp.duration]?.label }}
                </div>
              </div>
            </div>

            <div class="price flex-between mt-5 hr">
              <div class="flex-o">价格</div>
              <div class="flex-o price-text">
                <price-input style="font-size: 18px; color: red" :model-value="item._selected?.price" :edit="false" />
                <span class="ml-5" style="font-size: 12px"> / {{ durationDict.dataMap[item._selected.duration]?.label }}</span>
              </div>
            </div>

            <template #actions>
              <setting-outlined key="setting" />
              <a-button type="primary">立即购买</a-button>
            </template>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </fs-page>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import * as api from "./api";
import { durationDict } from "./api";
import PriceInput from "/@/views/sys/suite/product/price-input.vue";
import SuiteValue from "/@/views/sys/suite/product/suite-value.vue";
import { dict } from "@fast-crud/fast-crud";
const suites = ref([]);

const optionsDict = dict({
  data: []
});

async function loadSuites() {
  suites.value = await api.ProductList();

  for (const item of suites.value) {
    item._selected = item.durationPrices[0];
  }
}

loadSuites();
</script>

<style lang="less">
.page-suite-buy {
  .title {
    background-color: #fff;
  }
  background: #f0f2f5;
  .suite-buy-content {
    padding: 20px;

    .duration-list {
      display: flex;
      .duration-item {
        width: 50px;
        border: 1px solid #cdcdcd;
        text-align: center;
        padding: 2px;
        margin: 2px;
        cursor: pointer;

        &:hover {
          border-color: #1890ff;
        }
        &.active {
          border-color: #a6fba3;
          background-color: #c1eafb;
        }
      }
    }

    .hr {
      border-top: 1px solid #cdcdcd;
      margin-top: 5px;
      padding-top: 5px;
    }

    .price-text {
      align-items: baseline;
      font-family: "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }

    .prices {
      display: flex;
      justify-content: left;
      margin-top: 20px;
      .price-item {
        border: 1px solid #c6c6c6;
        background-color: #f8ebda;
        padding: 10px;
        text-align: center;
        cursor: pointer;
        width: 100px;
        &:hover {
          border-color: #38a0fb;
        }
        &.active {
          border-color: #1890ff;
        }
        margin-right: 10px;
      }
    }
  }
}
</style>
