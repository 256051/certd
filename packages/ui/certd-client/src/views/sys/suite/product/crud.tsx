import * as api from "./api";
import { useI18n } from "vue-i18n";
import { Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { AddReq, CreateCrudOptionsProps, CreateCrudOptionsRet, DelReq, dict, EditReq, UserPageQuery, UserPageRes } from "@fast-crud/fast-crud";
import { useUserStore } from "/@/store/modules/user";
import { useSettingStore } from "/@/store/modules/settings";
import SuiteValue from "./suite-value.vue";
import SuiteValueEdit from "./suite-value-edit.vue";

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
    form.content = JSON.stringify({
      title: form.title
    });
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
              columns: ["title", "type", "price", "originPrice", "duration", "isBootstrap", "intro"]
            },
            content: {
              header: "套餐内容",
              columns: ["maxDomainCount", "maxPipelineCount", "maxDeployCount", "siteMonitor"]
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
          column: {
            width: 100
          }
        },
        maxDomainCount: {
          title: "域名数量",
          type: "number",
          form: {
            component: {
              name: SuiteValueEdit,
              vModel: "modelValue",
              unit: "个"
            }
          },
          column: {
            width: 100,
            component: {
              name: SuiteValue
            }
          }
        },
        maxPipelineCount: {
          title: "流水线数量",
          type: "number",
          form: {
            component: {
              name: SuiteValueEdit,
              vModel: "modelValue",
              unit: "条"
            }
          },
          column: {
            width: 100,
            component: {
              name: SuiteValue
            }
          }
        },
        maxDeployCount: {
          title: "部署次数",
          type: "number",
          form: {
            component: {
              name: SuiteValueEdit,
              vModel: "modelValue",
              unit: "次"
            }
          },
          column: {
            width: 100,
            component: {
              name: SuiteValue
            }
          }
        },
        siteMonitor: {
          title: "支持证书监控",
          type: "dict-switch",
          dict: dict({
            data: [
              { label: "是", value: true, color: "success" },
              { label: "否", value: false, color: "error" }
            ]
          }),
          column: {
            width: 120
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
          column: {
            width: 120
          }
        },
        price: {
          title: "单价",
          type: "number",
          column: {
            width: 100
          }
        },
        originPrice: {
          title: "原价",
          type: "number",
          column: {
            width: 100
          }
        },
        duration: {
          title: "有效时长",
          type: "dict-select",
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
        order: {
          title: "排序",
          type: "number",
          form: {
            show: false
          },
          column: {
            width: 100
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
