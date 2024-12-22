// @ts-ignore
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { AddReq, CreateCrudOptionsProps, CreateCrudOptionsRet, DelReq, dict, EditReq, UserPageQuery, UserPageRes } from "@fast-crud/fast-crud";
import { pipelineGroupApi } from "./api";

export default function ({ crudExpose, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const { t } = useI18n();
  const api = pipelineGroupApi;
  const pageRequest = async (query: UserPageQuery): Promise<UserPageRes> => {
    return await api.GetList(query);
  };
  const editRequest = async (req: EditReq) => {
    const { form, row } = req;
    form.id = row.id;
    const res = await api.UpdateObj(form);
    return res;
  };
  const delRequest = async (req: DelReq) => {
    const { row } = req;
    return await api.DelObj(row.id);
  };

  const addRequest = async (req: AddReq) => {
    const { form } = req;
    const res = await api.AddObj(form);
    return res;
  };

  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      form: {
        labelCol: {
          //固定label宽度
          span: null,
          style: {
            width: "100px"
          }
        },
        col: {
          span: 22
        },
        wrapper: {
          width: 600
        }
      },
      rowHandle: {
        width: 200
      },
      columns: {
        id: {
          title: "ID",
          key: "id",
          type: "number",
          search: {
            show: false
          },
          column: {
            width: 100,
            editable: {
              disabled: true
            }
          },
          form: {
            show: false
          }
        },

        domain: {
          title: "网站域名",
          search: {
            show: true
          },
          type: "text",
          form: {
            rules: [{ required: true, message: "请输入域名" }]
          },
          column: {
            width: 200,
            sorter: true
          }
        },
        port: {
          title: "HTTPS端口",
          search: {
            show: false
          },
          type: "number",
          form: {
            value: 443,
            rules: [{ required: true, message: "请输入端口" }]
          },
          column: {
            width: 100
          }
        },
        name: {
          title: "站点名称",
          search: {
            show: true
          },
          type: "text",
          form: {
            rules: [{ required: true, message: "请输入站点名称" }]
          },
          column: {
            width: 200
          }
        },
        domains: {
          title: "其他域名",
          search: {
            show: false
          },
          type: "text",
          form: {
            show: false
          },
          column: {
            width: 300,
            sorter: true,
            show: false
          }
        },
        certInfo: {
          title: "证书详情",
          search: {
            show: false
          },
          type: "text",
          form: {
            show: false
          },
          column: {
            width: 100,
            show: false
          }
        },
        certStatus: {
          title: "证书状态",
          search: {
            show: true
          },
          type: "text",
          form: {
            show: false
          },
          column: {
            width: 100,
            sorter: true
          }
        },
        certExpiresTime: {
          title: "证书到期时间",
          search: {
            show: false
          },
          type: "date",
          form: {
            show: false
          },
          column: {
            sorter: true
          }
        },
        lastCheckTime: {
          title: "上次检查时间",
          search: {
            show: false
          },
          type: "datetime",
          form: {
            show: false
          },
          column: {
            sorter: true
          }
        },
        checkStatus: {
          title: "检查状态",
          search: {
            show: false
          },
          type: "text",
          form: {
            show: false
          },
          column: {
            width: 100,
            sorter: true
          }
        },
        pipelineId: {
          title: "关联流水线id",
          search: {
            show: false
          },
          form: { show: false },
          type: "number",
          column: {
            width: 200,
            sorter: true
          }
        },
        certInfoId: {
          title: "证书id",
          search: {
            show: false
          },
          type: "number",
          form: { show: false },
          column: {
            width: 100,
            sorter: true,
            show: false
          }
        },
        disabled: {
          title: "禁用启用",
          search: {
            show: false
          },
          type: "dict-switch",
          dict: dict({
            data: [
              { label: "启用", value: false, color: "green" },
              { label: "禁用", value: true, color: "red" }
            ]
          }),
          form: {
            value: true
          },
          column: {
            width: 100,
            sorter: true
          }
        }
      }
    }
  };
}
