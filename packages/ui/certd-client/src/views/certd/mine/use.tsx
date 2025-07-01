// useUserProfile, 获取 openEditProfileDialog ,参考 useTemplate方法
import { useFormWrapper } from "@fast-crud/fast-crud";
import { ref } from "vue";
import { cloneDeep, merge } from "lodash-es";

// 假设的 API 导入
import * as userProfileApi from "./api";
import { useUserStore } from "/@/store/user";
import { useI18n } from "/src/locales";

/**
 * 获取用户资料编辑相关功能
 * @returns {{openEditProfileDialog: openEditProfileDialog}}
 */
export function useUserProfile() {
  const { openCrudFormDialog } = useFormWrapper();
  const wrapperRef = ref();
  async function openEditProfileDialog(req: { onUpdated?: (ctx: any) => void }) {
    const detail = await userProfileApi.getMineInfo();
    if (!detail) {
      throw new Error("用户资料不存在");
    }

    const { t } = useI18n();

    const userStore = useUserStore();
    const userProfileFormRef = ref();
    async function doSubmit(opts: { form: any }) {
      const form = opts.form;
      const { id } = await userProfileApi.UpdateProfile(form);
      if (req.onUpdated) {
        req.onUpdated({ id });
      }
    }

    const crudOptions: any = {
      form: {
        doSubmit,
        wrapper: {
          title: `编辑用户资料`,
          width: 1100,
          onOpened(opts: { form: any }) {
            merge(opts.form, detail);
          },
        },
      },
      columns: {
        nickName: {
          title: t("certd.nickName"),
          type: "text",
          form: {
            component: {
              placeholder: t("certd.nickName"),
            },
            rules: [{ required: true, message: t("certd.nickName") }],
          },
        },
        avatar: {
          title: t("certd.avatar"),
          type: "cropper-uploader",
          column: {
            width: 70,
            component: {
              style: {
                height: "30px",
                width: "auto",
              },
              buildUrl(key: string) {
                return `api/basic/file/download?&key=` + key;
              },
            },
          },
          form: {
            component: {
              vModel: "modelValue",
              valueType: "key",
              cropper: {
                aspectRatio: 1,
                autoCropArea: 1,
                viewMode: 0,
              },
              onReady: null,
              uploader: {
                type: "form",
                action: "/basic/file/upload",
                name: "file",
                headers: {
                  Authorization: "Bearer " + userStore.getToken,
                },
                successHandle(res: any) {
                  return res;
                },
              },
              buildUrl(key: string) {
                return `api/basic/file/download?&key=` + key;
              },
            },
          },
        },
      },
    };

    const wrapper = await openCrudFormDialog({ crudOptions });
    wrapperRef.value = wrapper;
  }

  return {
    openEditProfileDialog,
  };
}
