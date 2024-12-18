import * as api from "./api";
import { useI18n } from "vue-i18n";
import { Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { AddReq, CreateCrudOptionsProps, CreateCrudOptionsRet, DelReq, dict, EditReq, UserPageQuery, UserPageRes } from "@fast-crud/fast-crud";
import { useUserStore } from "/@/store/modules/user";
import { useSettingStore } from "/@/store/modules/settings";
import SuiteValue from "./suite-value.vue";
import SuiteValueEdit from "./suite-value-edit.vue";
import PriceEdit from "./price-edit.vue";

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
              selectedRowKeys
            }
          }
        }
      },
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      rowHandle: {
        minWidth: 200,
        fixed: "right"
      },
      form: {
        group: {
          groups: {
            base: {
              header: "基础信息",
              columns: ["title", "type", "isBootstrap", "disabled", "order", "intro"]
            },
            content: {
              header: "套餐内容",
              columns: ["content.maxDomainCount", "content.maxPipelineCount", "content.maxDeployCount", "content.siteMonitor"]
            },
            price: {
              header: "价格",
              columns: ["durationPrices"]
            }
          }
        }
      },
      columns: {
        id: {
          title: "ID",
          key: "id",
          type: "number",
          column: {
            width: 100
          },
          form: {
            show: false
          }
        },
        title: {
          title: "套餐名称",
          type: "text",
          search: {
            show: true
          },
          form: {
            rules: [{ required: true, message: "此项必填" }]
          },
          column: {
            width: 200
          }
        },
        type: {
          title: "类型",
          type: "dict-select",
          editForm: {
            component: {
              disabled: true
            }
          },
          dict: dict({
            data: [
              { label: "套餐", value: "suite" },
              { label: "加量包", value: "addon" }
            ]
          }),
          form: {
            rules: [{ required: true, message: "此项必填" }]
          },
          column: {
            width: 100
          },
          valueBuilder: ({ row }) => {
            if (row.content) {
              row.content = JSON.parse(row.content);
            }
            if (row.durationPrices) {
              row.durationPrices = JSON.parse(row.durationPrices);
            }
          },
          valueResolve: ({ form }) => {
            debugger;
            if (form.content) {
              form.content = JSON.stringify(form.content);
            }
            if (form.durationPrices) {
              form.durationPrices = JSON.stringify(form.durationPrices);
            }
          }
        },
        "content.maxDomainCount": {
          title: "域名数量",
          type: "number",
          form: {
            key: ["content", "maxDomainCount"],
            component: {
              name: SuiteValueEdit,
              vModel: "modelValue",
              unit: "个"
            },
            rules: [{ required: true, message: "此项必填" }]
          },
          column: {
            width: 100,
            component: {
              name: SuiteValue
            }
          }
        },
        "content.maxPipelineCount": {
          title: "流水线数量",
          type: "number",
          form: {
            key: ["content", "maxPipelineCount"],
            component: {
              name: SuiteValueEdit,
              vModel: "modelValue",
              unit: "条"
            },
            rules: [{ required: true, message: "此项必填" }]
          },
          column: {
            width: 100,
            component: {
              name: SuiteValue
            }
          }
        },
        "content.maxDeployCount": {
          title: "部署次数",
          type: "number",
          form: {
            key: ["content", "maxDeployCount"],
            component: {
              name: SuiteValueEdit,
              vModel: "modelValue",
              unit: "次"
            },
            rules: [{ required: true, message: "此项必填" }]
          },
          column: {
            width: 100,
            component: {
              name: SuiteValue
            }
          }
        },
        "content.siteMonitor": {
          title: "支持证书监控",
          type: "dict-switch",
          dict: dict({
            data: [
              { label: "是", value: true, color: "success" },
              { label: "否", value: false, color: "error" }
            ]
          }),
          form: {
            key: ["content", "siteMonitor"],
            value: false
          },
          column: {
            width: 120
          }
        },
        durationPrices: {
          title: "时长及价格",
          type: "text",
          form: {
            title: "选择时长",
            component: {
              name: PriceEdit,
              vModel: "modelValue",
              edit: true,
              style: {
                minHeight: "120px"
              }
            },
            col: {
              span: 24
            },
            rules: [{ required: true, message: "此项必填" }]
          },
          column: {
            component: {
              name: PriceEdit,
              vModel: "modelValue",
              edit: false
            }
          }
        },
        isBootstrap: {
          title: "是否初始套餐",
          type: "dict-switch",
          dict: dict({
            data: [
              { label: "是", value: true, color: "success" },
              { label: "否", value: false, color: "error" }
            ]
          }),
          form: {
            value: false
          },
          column: {
            width: 120
          }
        },
        disabled: {
          title: "上下架",
          type: "dict-radio",
          dict: dict({
            data: [
              { value: false, label: "上架" },
              { value: true, label: "下架" }
            ]
          }),
          form: {
            value: false
          },
          column: {
            width: 100
          }
        },
        order: {
          title: "排序",
          type: "number",
          form: {
            helper: "越小越靠前",
            value: 0
          },
          column: {
            width: 100
          }
        },
        intro: {
          title: "说明",
          type: "textarea",
          column: {
            width: 200
          }
        },
        createTime: {
          title: "创建时间",
          type: "datetime",
          form: {
            show: false
          },
          column: {
            sorter: true,
            width: 160,
            align: "center"
          }
        },
        updateTime: {
          title: "更新时间",
          type: "datetime",
          form: {
            show: false
          },
          column: {
            show: true,
            width: 160
          }
        }
      }
    }
  };
}
