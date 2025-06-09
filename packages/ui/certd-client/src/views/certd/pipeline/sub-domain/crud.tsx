import * as api from "./api";
import { Ref, ref } from "vue";
import { AddReq, CreateCrudOptionsProps, CreateCrudOptionsRet, DelReq, dict, EditReq, UserPageQuery, UserPageRes } from "@fast-crud/fast-crud";

export default function ({ crudExpose, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
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
      // tabs: {
      //   name: "status",
      //   show: true,
      // },
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
          title: "托管的子域名",
          type: "text",
          search: {
            show: true,
          },
          form: {
            helper: {
              render() {
                return (
                  <div>
                    如果您不理解什么是子域托管，可以参考文档
                    <a href={"https://help.aliyun.com/zh/dns/subdomain-management"} target={"_blank"}>
                      子域管理
                    </a>
                  </div>
                );
              },
            },
          },
          editForm: {
            component: {
              disabled: true,
            },
          },
        },
        disabled: {
          title: "是否禁用",
          type: "dict-switch",
          dict: dict({
            data: [
              { value: false, label: "启用", color: "green" },
              { value: true, label: "禁用", color: "gray" },
            ],
          }),
          search: {
            show: true,
          },
          form: {
            value: false,
          },
        },
        createTime: {
          title: "创建时间",
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
          title: "更新时间",
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
