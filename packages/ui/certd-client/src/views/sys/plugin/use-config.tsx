import * as api from "/@/views/sys/plugin/api";
import { useFormWrapper } from "@fast-crud/fast-crud";
import { useI18n } from "/@/locales";
import { Modal, notification } from "ant-design-vue";
import ConfigEditor from "./config-editor.vue";
import { useModal } from "/@/use/use-modal";
export function usePluginConfig() {
  const { openCrudFormDialog } = useFormWrapper();
  const { t } = useI18n();

  const modal = useModal();
  async function openConfigDialog({ row, crudExpose }) {
    // function createCrudOptions() {
    //   return {
    //     crudOptions: {
    //       columns: {},
    //       form: {
    //         wrapper: {
    //           width: "80%",
    //           title: "插件元数据配置",
    //           saveRemind: false,
    //           slots: {
    //             "form-body-top": () => {
    //               return (
    //                 <div>
    //                   <ConfigEditor plugin={row}></ConfigEditor>
    //                 </div>
    //               );
    //             },
    //           },
    //         },
    //         afterSubmit() {
    //           notification.success({ message: t("certd.operationSuccess") });
    //           crudExpose.doRefresh();
    //         },
    //         async doSubmit({ form }: any) {
    //           return await api.ImportPlugin({
    //             ...form,
    //           });
    //         },
    //       },
    //     },
    //   };
    // }
    // const { crudOptions } = createCrudOptions();
    // await openCrudFormDialog({ crudOptions });

    modal.confirm({
      title: "插件元数据配置",
      width: "80%",
      content: () => {
        return <ConfigEditor plugin={row}></ConfigEditor>;
      },
    });
  }

  return {
    openConfigDialog,
  };
}
