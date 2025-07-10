import * as api from "./api";
import { useI18n } from "/src/locales";
import { Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { AddReq, compute, CreateCrudOptionsProps, CreateCrudOptionsRet, DelReq, dict, EditReq, UserPageQuery, UserPageRes } from "@fast-crud/fast-crud";
import { useUserStore } from "/@/store/user";
import { useSettingStore } from "/@/store/settings";
import { message } from "ant-design-vue";
import { Dicts } from "/@/components/plugins/lib/dicts";
export default function ({ crudExpose, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const router = useRouter();
  const { t } = useI18n();
  const pageRequest = async (query: UserPageQuery): Promise<UserPageRes> => {
    return await api.GetList(query);
  };
  const editRequest = async ({ form, row }: EditReq) => {
    form.id = row.id;
    const res = await api.UpdateObj(form);
    return res;
  };
  const delRequest = async ({ row }: DelReq) => {
    return await api.DelObj(row.id);
  };

  const addRequest = async ({ form }: AddReq) => {
    const res = await api.AddObj(form);
    return res;
  };

  const userStore = useUserStore();
  const settingStore = useSettingStore();
  const selectedRowKeys: Ref<any[]> = ref([]);
  context.selectedRowKeys = selectedRowKeys;

  return {
    crudOptions: {
      settings: {
        plugins: {
          //这里使用行选择插件，生成行选择crudOptions配置，最终会与crudOptions合并
          rowSelection: {
            enabled: true,
            order: -2,
            before: true,
            // handle: (pluginProps,useCrudProps)=>CrudOptions,
            props: {
              multiple: true,
              crossPage: true,
              selectedRowKeys,
            },
          },
        },
      },
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      tabs: {
        name: "status",
        show: true,
      },
      rowHandle: {
        minWidth: 200,
        fixed: "right",
      },
      columns: {
        id: {
          title: "ID",
          key: "id",
          type: "number",
          column: {
            width: 80,
          },
          form: {
            show: false,
          },
        },
        domain: {
          title: t("certd.domain.domain"),
          type: "text",
          search: {
            show: true,
          },
          form: {
            required: true,
          },
          editForm: {
            component: {
              disabled: false,
            },
          },
        },
        challengeType: {
          title: t("certd.domain.challengeType"),
          type: "dict-select",
          dict: Dicts.challengeTypeDict,
          form: {
            required: true,
          },
        },
        /**
         * challengeType varchar(50),
         *   dnsProviderType varchar(50),
         *   dnsProviderAccess bigint,
         *   httpUploaderType varchar(50),
         *   httpUploaderAccess bigint,
         *   httpUploadRootDir varchar(512),
         */
        dnsProviderType: {
          title: t("certd.domain.dnsProviderType"),
          type: "text",
          form: {
            component: {
              name: "DnsProviderSelector",
            },
            show: compute(({ form }) => {
              return form.challengeType === "dns";
            }),
            required: true,
          },
        },
        dnsProviderAccess: {
          title: t("certd.domain.dnsProviderAccess"),
          type: "text",
          form: {
            component: {
              name: "AccessSelector",
              vModel: "modelValue",
              type: compute(({ form }) => {
                return form.dnsProviderType;
              }),
            },
            show: compute(({ form }) => {
              return form.challengeType === "dns";
            }),
            required: true,
          },
        },
        httpUploaderType: {
          title: t("certd.domain.httpUploaderType"),
          type: "dict-text",
          dict: Dicts.uploaderTypeDict,
          form: {
            show: compute(({ form }) => {
              return form.challengeType === "http";
            }),
            required: true,
          },
        },
        httpUploaderAccess: {
          title: t("certd.domain.httpUploaderAccess"),
          type: "text",
          form: {
            component: {
              name: "AccessSelector",
            },
            show: compute(({ form }) => {
              return form.challengeType === "http";
            }),
            required: true,
          },
        },
        httpUploadRootDir: {
          title: t("certd.domain.httpUploadRootDir"),
          type: "text",
          form: {
            show: compute(({ form }) => {
              return form.challengeType === "http";
            }),
            required: true,
          },
        },
        disabled: {
          title: t("certd.domain.disabled"),
          type: "dict-switch",
          dict: dict({
            data: [
              { label: "启用", value: false },
              { label: "禁用", value: true },
            ],
          }),
          form: {
            value: false,
            required: true,
          },
          column: {
            width: 80,
          },
        },
        createTime: {
          title: t("certd.createTime"),
          type: "datetime",
          form: {
            show: false,
          },
          column: {
            sorter: true,
            width: 160,
            align: "center",
          },
        },
        updateTime: {
          title: t("certd.updateTime"),
          type: "datetime",
          form: {
            show: false,
          },
          column: {
            show: true,
          },
        },
      },
    },
  };
}
