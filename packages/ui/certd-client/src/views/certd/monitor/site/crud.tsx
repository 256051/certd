// @ts-ignore
import { useI18n } from "vue-i18n";
import { AddReq, CreateCrudOptionsProps, CreateCrudOptionsRet, DelReq, dict, EditReq, UserPageQuery, UserPageRes } from "@fast-crud/fast-crud";
import { siteInfoApi } from "./api";
import dayjs from "dayjs";
import { notification } from "ant-design-vue";

export default function ({ crudExpose, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const { t } = useI18n();
  const api = siteInfoApi;
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
        fixed: "right",
        width: 240,
        buttons: {
          check: {
            order: 0,
            type: "link",
            text: null,
            tooltip: {
              title: "立即检查"
            },
            icon: "ion:play-sharp",
            click: async ({ row }) => {
              await api.DoCheck(row.id);
              await crudExpose.doRefresh();
              notification.success({
                message: "检查完成"
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
            width: 80,
            align: "center"
          },
          form: {
            show: false
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
            width: 160
          }
        },
        domain: {
          title: "网站域名",
          search: {
            show: true
          },
          type: "text",
          form: {
            rules: [
              { required: true, message: "请输入域名" },
              { type: "domains", message: "请输入正确的域名" }
            ]
          },
          column: {
            width: 160,
            sorter: true
          }
        },
        httpsPort: {
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
            align: "center",
            width: 100
          }
        },
        certDomains: {
          title: "证书域名",
          search: {
            show: false
          },
          type: "text",
          form: {
            show: false
          },
          column: {
            width: 200,
            sorter: true,
            show: true
          }
        },
        certProvider: {
          title: "证书颁发者",
          search: {
            show: false
          },
          type: "text",
          form: {
            show: false
          },
          column: {
            width: 200,
            sorter: true
          }
        },
        certStatus: {
          title: "证书状态",
          search: {
            show: true
          },
          type: "dict-select",
          dict: dict({
            data: [
              { label: "正常", value: "ok", color: "green" },
              { label: "过期", value: "expired", color: "red" }
            ]
          }),
          form: {
            show: false
          },
          column: {
            width: 100,
            sorter: true,
            show: false
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
            sorter: true,
            cellRender({ value }) {
              if (!value) {
                return "-";
              }
              const expireDate = dayjs(value).format("YYYY-MM-DD");
              const leftDays = dayjs(value).diff(dayjs(), "day");
              const color = leftDays < 20 ? "red" : "#389e0d";
              const percent = (leftDays / 90) * 100;
              return <a-progress title={expireDate + "过期"} percent={percent} strokeColor={color} format={(percent: number) => `${leftDays}天`} />;
            }
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
          type: "dict-select",
          dict: dict({
            data: [
              { label: "正常", value: "ok", color: "green" },
              { label: "异常", value: "error", color: "red" }
            ]
          }),
          form: {
            show: false
          },
          column: {
            width: 100,
            align: "center",
            sorter: true
          }
        },
        error: {
          title: "错误信息",
          search: {
            show: false
          },
          type: "text",
          form: {
            show: false
          },
          column: {
            width: 200,
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
            sorter: true,
            show: false
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
            value: false
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
