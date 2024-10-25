import { useI18n } from "vue-i18n";
import { Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { compute, CreateCrudOptionsProps, CreateCrudOptionsRet } from "@fast-crud/fast-crud";
import { useSettingStore } from "/@/store/modules/settings";
import { cloneDeep } from "lodash-es";
import { nanoid } from "nanoid";

export default function ({ crudExpose, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const { crudBinding } = crudExpose;
  const router = useRouter();
  const { t } = useI18n();
  const settingStore = useSettingStore();
  const menusRef = ref(cloneDeep(settingStore.headerMenus?.menus || []));

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
      actionbar: {
        buttons: {
          add: {
            show: false
          },
          addRow: {
            show: true,
            click: () => {
              crudBinding.value.data.push({ id: nanoid() });
            }
          },
          save: {
            text: "保存菜单",
            type: "primary",
            click: async () => {
              await settingStore.saveHeaderMenus({ menus: menusRef.value });
            }
          }
        }
      },
      search: {
        show: false
      },
      toolbar: {
        buttons: {
          refresh: {
            show: false
          }
        }
      },
      mode: {
        name: "local",
        isMergeWhenUpdate: true,
        isAppendWhenAdd: true
      },
      table: {
        defaultExpandAllRows: true,
        expandRowByClick: true,
        editable: {
          enabled: true,
          mode: "row",
          activeDefault: true,
          showAction: true,
          rowKey: "id"
        }
      },
      pagination: { show: false, pageSize: 9999999 },
      rowHandle: {
        width: 300,
        fixed: "right",
        group: {
          editRow: {
            addChild: {
              text: "添加子菜单",
              click: ({ row }) => {
                if (row.children == null) {
                  row.children = [];
                }
                row.children.push({ id: nanoid() });
              }
            }
          }
        }
      },
      columns: {
        id: {
          title: "ID",
          key: "id",
          type: "text",
          column: {
            width: 200
          },
          form: {
            show: false
          }
        },
        title: {
          title: "菜单标题",
          type: "text",
          column: {
            width: 300
          }
        },
        icon: {
          title: "图标",
          type: "text",
          column: {
            width: 300
          }
        },
        link: {
          title: "链接",
          type: "text",
          column: {
            width: 300
          }
        }
      }
    }
  };
}
