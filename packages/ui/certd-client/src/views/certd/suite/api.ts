import { request } from "/@/api/service";
import { dict } from "@fast-crud/fast-crud";
export const durationDict = dict({
  data: [
    { label: "1年", value: 365 },
    { label: "2年", value: 730 },
    { label: "3年", value: 1095 },
    { label: "4年", value: 1460 },
    { label: "5年", value: 1825 },
    { label: "6年", value: 2190 },
    { label: "7年", value: 2555 },
    { label: "8年", value: 2920 },
    { label: "9年", value: 3285 },
    { label: "10年", value: 3650 },
    { label: "永久", value: -1 }
  ]
});

export async function ProductList() {
  return await request({
    url: "/suite/product/list",
    method: "POST"
  });
}
