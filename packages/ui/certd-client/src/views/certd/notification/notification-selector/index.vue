<template>
  <div class="notification-selector">
    <span v-if="target?.name" class="mr-5 cd-flex-inline">
      <a-tag class="mr-5" color="green">{{ target.name }}</a-tag>
      <fs-icon class="cd-icon-button" icon="ion:close-circle-outline" @click="clear"></fs-icon>
    </span>
    <span v-else class="mlr-5 text-gray">{{ placeholder }}</span>
    <a-button class="ml-5" :disabled="disabled" :size="size" @click="chooseForm.open">选择</a-button>
    <a-form-item-rest v-if="chooseForm.show">
      <a-modal v-model:open="chooseForm.show" title="选择通知" width="900px" @ok="chooseForm.ok">
        <div style="height: 400px; position: relative">
          <cert-notification-modal v-model="selectedId"></cert-notification-modal>
        </div>
      </a-modal>
    </a-form-item-rest>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, watch, inject } from "vue";
import CertNotificationModal from "./modal/index.vue";
import { createApi } from "../api";
import { message } from "ant-design-vue";

export default defineComponent({
  name: "NotificationSelector",
  components: { CertNotificationModal },
  props: {
    modelValue: {
      type: [Number, String],
      default: null
    },
    type: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "请选择"
    },
    size: {
      type: String,
      default: "middle"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue", "selectedChange", "change"],
  setup(props, ctx) {
    const api = createApi();

    const target = ref({});
    const selectedId = ref();
    async function refreshTarget(value) {
      selectedId.value = value;
      if (value > 0) {
        target.value = await api.GetSimpleInfo(value);
      }
    }

    function clear() {
      if (props.disabled) {
        return;
      }
      emitValue(null);
    }

    async function emitValue(value) {
      if (pipeline?.value && target?.value && pipeline.value.userId !== target.value.userId) {
        message.error("对不起，您不能修改他人流水线的通知");
        return;
      }
      if (value == null) {
        selectedId.value = "";
        target.value = null;
      } else {
        selectedId.value = value;
        await refreshTarget(selectedId.value);
      }
      ctx.emit("change", selectedId.value);
      ctx.emit("update:modelValue", selectedId.value);
      ctx.emit("selectedChange", target.value);
    }

    watch(
      () => {
        return props.modelValue;
      },
      async (value) => {
        selectedId.value = null;
        target.value = null;
        if (value == null) {
          return;
        }
        await refreshTarget(value);
      },
      {
        immediate: true
      }
    );

    const providerDefine = ref({});

    async function refreshProviderDefine(type) {
      providerDefine.value = await api.GetProviderDefine(type);
    }
    // watch(
    //   () => {
    //     return props.type;
    //   },
    //   async (value) => {
    //     await refreshProviderDefine(value);
    //   },
    //   {
    //     immediate: true
    //   }
    // );

    //当不在pipeline中编辑时，可能为空
    const pipeline = inject("pipeline", null);

    const chooseForm = reactive({
      show: false,
      open() {
        chooseForm.show = true;
      },
      ok: () => {
        console.log("choose ok:", selectedId.value);
        emitValue(selectedId.value);
        chooseForm.show = false;
      }
    });

    return {
      clear,
      target,
      selectedId,
      providerDefine,
      chooseForm
    };
  }
});
</script>
<style lang="less">
.notification-selector {
}
</style>
