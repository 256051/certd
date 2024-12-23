<template>
  <div v-if="detail.enabled" class="my-suite-card">
    <div class="flex-o">
      <a-popover>
        <template #content>
          <div>
            <div class="flex-between mt-5">
              <div class="flex-o"><fs-icon icon="ant-design:check-outlined" class="color-green mr-5" /> 流水线条数：</div>
              <suite-value :model-value="detail.pipelineCount.max" :used="detail.pipelineCount.used" unit="条" />
            </div>
            <div class="flex-between mt-5">
              <div class="flex-o"><fs-icon icon="ant-design:check-outlined" class="color-green mr-5" />域名数量：</div>
              <suite-value :model-value="detail.domainCount.max" :used="detail.domainCount.used" unit="个" />
            </div>
            <div class="flex-between mt-5">
              <div class="flex-o"><fs-icon icon="ant-design:check-outlined" class="color-green mr-5" /> 部署次数：</div>
              <suite-value :model-value="detail.deployCount.max" :used="detail.deployCount.used" unit="次" />
            </div>
            <div class="flex-between mt-5">
              <div class="flex-o"><fs-icon icon="ant-design:check-outlined" class="color-green mr-5" /> 监控站点数：</div>
              <suite-value :model-value="detail.monitorCount.max" :used="detail.monitorCount.used" unit="次" />
            </div>
          </div>
        </template>
        <div class="flex-o">
          <fs-icon icon="ant-design:gift-outlined" class="color-green mr-5" />
          <a-tag v-for="(item, index) of detail.suites" :key="index" color="green" class="pointer flex-o">
            <span class="mr-5">
              {{ item.title }}
            </span>
            <span>(<expires-time-text :value="item.expiresTime" />)</span>
          </a-tag>
        </div>
      </a-popover>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SuiteValue from "/@/views/sys/suite/product/suite-value.vue";
import { computed, ref } from "vue";
import { request } from "/@/api/service";
import dayjs from "dayjs";
import ExpiresTimeText from "/@/components/expires-time-text.vue";

defineOptions({
  name: "SuiteCard"
});

type SuiteValue = {
  max: number;
  used: number;
};
type SuiteDetail = {
  enabled?: boolean;
  suites?: any[];
  expiresTime?: number;
  pipelineCount?: SuiteValue;
  domainCount?: SuiteValue;
  deployCount?: SuiteValue;
  monitorCount?: SuiteValue;
};
const detail = ref<SuiteDetail>({});

const api = {
  async SuiteDetailGet() {
    return await request({
      url: "/mine/suite/detail",
      method: "post"
    });
  }
};
async function loadSuiteDetail() {
  detail.value = await api.SuiteDetailGet();
}

loadSuiteDetail();
</script>
