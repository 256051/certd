// @ts-ignore
import { useI18n } from "vue-i18n";
import { AddReq, CreateCrudOptionsProps, CreateCrudOptionsRet, DelReq, EditReq, UserPageQuery, UserPageRes } from "@fast-crud/fast-crud";
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
          title: "主域名",
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
        domains: {
          title: "全部域名",
          search: {
            show: false
          },
          type: "text",
          form: {
            rules: [{ required: true, message: "请输入域名" }]
          },
          column: {
            width: 300,
            sorter: true
          }
        },
        domainCount: {
          title: "域名数量",
          type: "number",
          form: {
            show: false
          },
          column: {
            width: 120,
            sorter: true
          }
        },
        pipelineId: {
          title: "已关联流水线",
          search: { show: false },
          type: "text",
          form: {
            show: false
          },
          column: {
            width: 200,
            sorter: true
          }
        },
        applyTime: {
          title: "申请时间",
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
        expiresTime: {
          title: "过期时间",
          search: {
            show: true
          },
          type: "date",
          form: {
            show: false
          },
          column: {
            sorter: true
          }
        },
        fromType: {
          title: "来源",
          search: {
            show: true
          },
          type: "text",
          form: { show: false },
          column: {
            width: 100,
            sorter: true
          }
        },
        certProvider: {
          title: "证书颁发机构",
          search: {
            show: true
          },
          type: "text",
          form: {
            show: false
          },
          column: {
            width: 400
          }
        }
      }
    }
  };
}
