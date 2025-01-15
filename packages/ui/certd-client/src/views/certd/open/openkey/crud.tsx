// @ts-ignore
import { useI18n } from "vue-i18n";
import { AddReq, CreateCrudOptionsProps, CreateCrudOptionsRet, DelReq, EditReq, UserPageQuery, UserPageRes } from "@fast-crud/fast-crud";
import { pipelineGroupApi } from "./api";
import dayjs from "dayjs";
import { Modal } from "ant-design-vue";

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
      search: {
        show: false
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
      actionbar: {
        buttons: {
          add: {
            text: "生成新的Key",
            click() {
              Modal.confirm({
                title: "确认",
                content: "确定要生成新的Key?",
                async onOk() {
                  await api.AddObj({});
                  await crudExpose.doRefresh();
                }
              });
            }
          }
        }
      },
      rowHandle: {
        width: 300,
        fixed: "right",
        buttons: {
          view: { show: true },
          copy: { show: false },
          edit: { show: false },
          remove: { show: true },
          gen: {
            text: "测试ApiToken",
            async click({ row }) {
              const apiToken = await api.GetApiToken(row.id);
              Modal.info({
                title: "ApiToken",
                content: () => {
                  return (
                    <div>
                      <div>测试ApiKey如下，您可以在3分钟内使用它进行开放接口请求测试</div>
                      <div>{apiToken}</div>
                    </div>
                  );
                }
              });
            }
          }
        }
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
        keyId: {
          title: "KeyId",
          search: {
            show: false
          },
          form: {
            show: false
          },
          type: "text",
          column: {
            width: 200,
            sorter: true
          }
        },
        keySecret: {
          title: "KeySecret",
          type: "text",
          form: {
            show: false
          },
          column: {
            width: 550,
            sorter: true
          }
        },
        createTime: {
          title: "创建时间",
          type: "datetime",
          search: {
            show: false
          },
          form: {
            show: false
          }
        }
      }
    }
  };
}
