import { request } from "/@/api/service";

export async function GetStatisticCount() {
  return await request({
    url: "/statistic/count",
    method: "POST"
  });
}
