import { ColumnCompositionProps, compute, dict } from "@fast-crud/fast-crud";
import { computed, provide, ref, toRef } from "vue";
import { useReference } from "/@/use/use-refrence";
import { forEach, get, merge, set } from "lodash-es";

export function getCommonColumnDefine(crudExpose: any, typeRef: any, api: any) {
  provide("notificationApi", api);
  provide("get:plugin:type", () => {
    return "notification";
  });
  const notificationTypeDictRef = dict({
    url: "/pi/notification/getTypeDict"
  });
  const defaultPluginConfig = {
    component: {
      name: "a-input",
      vModel: "value"
    }
  };

  function buildDefineFields(define: any, form: any, mode: string) {
    const formWrapperRef = crudExpose.getFormWrapperRef();
    const columnsRef = toRef(formWrapperRef.formOptions, "columns");

    for (const key in columnsRef.value) {
      if (key.indexOf(".") >= 0) {
        delete columnsRef.value[key];
      }
    }
    console.log('crudBinding.value[mode + "Form"].columns', columnsRef.value);
    forEach(define.input, (value: any, mapKey: any) => {
      const key = "body." + mapKey;
      const field = {
        ...value,
        key
      };
      const column = merge({ title: key }, defaultPluginConfig, field);
      //eval
      useReference(column);

      //设置默认值
      if (column.value != null && get(form, key) == null) {
        set(form, key, column.value);
      }
      //字段配置赋值
      columnsRef.value[key] = column;
      console.log("form", columnsRef.value, form);
    });
  }

  const currentDefine = ref();

  return {
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
    name: {
      title: "通知名称",
      search: {
        show: true
      },
      type: ["text"],
      form: {
        rules: [{ required: true, message: "请填写名称" }],
        helper: "随便填，当多个相同类型的通知时，便于区分"
      },
      column: {
        width: 200
      }
    },
    type: {
      title: "通知类型",
      type: "dict-select",
      dict: notificationTypeDictRef,
      search: {
        show: false
      },
      column: {
        width: 200,
        component: {
          color: "auto"
        }
      },
      editForm: {
        component: {
          disabled: false
        }
      },
      form: {
        component: {
          disabled: false,
          showSearch: true,
          filterOption: (input: string, option: any) => {
            input = input?.toLowerCase();
            return option.value.toLowerCase().indexOf(input) >= 0 || option.label.toLowerCase().indexOf(input) >= 0;
          }
        },
        rules: [{ required: true, message: "请选择通知类型" }],
        valueChange: {
          immediate: true,
          async handle({ value, mode, form, immediate }) {
            if (value == null) {
              return;
            }
            const define = await api.GetProviderDefine(value);
            currentDefine.value = define;
            console.log("define", define);
            if (!immediate) {
              form.body = {};
            }
            buildDefineFields(define, form, mode);
          }
        },
        helper: computed(() => {
          const define = currentDefine.value;
          if (define == null) {
            return "";
          }
          return define.desc;
        })
      }
    } as ColumnCompositionProps,
    test: {
      title: "测试",
      form: {
        component: {
          name: "api-test",
          type: "notification",
          typeName: compute(({ form }) => {
            return form.type;
          }),
          action: "TestRequest",
          form: compute(({ form }) => {
            return form;
          })
        },
        order: 999
      },
      column: {
        show: false
      }
    },
    setting: {
      column: { show: false },
      form: {
        show: false,
        valueBuilder({ value, form }) {
          form.body = {};
          if (!value) {
            return;
          }
          const setting = JSON.parse(value);
          for (const key in setting) {
            form.body[key] = setting[key];
          }
        },
        valueResolve({ form }) {
          const setting = form.body;
          form.setting = JSON.stringify(setting);
        }
      }
    } as ColumnCompositionProps
  };
}
