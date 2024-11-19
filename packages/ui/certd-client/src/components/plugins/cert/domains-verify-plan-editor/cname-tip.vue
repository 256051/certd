<template>
  <a-tooltip :overlay-style="{ maxWidth: '400px' }">
    <template #title>
      <div>
        <div>多试几次，如果仍然无法验证通过，请按如下步骤排查问题：</div>
        <div>1. 解析记录应该添加在{{ record.domain }}域名下</div>
        <div>2. 要添加的是CNAME类型的记录，不是TXT</div>
        <div>3. 核对记录值是否是:{{ record.recordValue }}</div>
        <div>
          4. 运行命令 <a-tag>nslookup -qa=txt {{ record.hostRecord }}{{ record.domain }}</a-tag> 查看解析配置是否正确
        </div>
      </div>
    </template>
    <fs-icon class="ml-5 pointer" icon="mingcute:question-line"></fs-icon>
  </a-tooltip>
</template>

<script lang="ts" setup>
const props = defineProps<{
  record: any;
}>();
</script>
