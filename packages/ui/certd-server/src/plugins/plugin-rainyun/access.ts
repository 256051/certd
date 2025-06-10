import {AccessInput, BaseAccess, IsAccess} from "@certd/pipeline";
import {HttpRequestConfig} from "@certd/basic";


/**
 */
@IsAccess({
  name: "rainyun",
  title: "雨云授权",
  desc: "https://app.rainyun.com/",
  icon: "svg:icon-lucky"
})
export class RainyunAccess extends BaseAccess {


  @AccessInput({
    title: "ApiKey",
    component: {
      placeholder: "api-key",
      component: {
        name: "a-input",
        vModel: "value"
      }
    },
    encrypt: true,
    required: true
  })
  apiKey!: string;



  @AccessInput({
    title: "测试",
    component: {
      name: "api-test",
      action: "TestRequest"
    },
    helper: "点击测试接口是否正常"
  })
  testRequest = true;

  async onTestRequest() {
      await this.getDomainList({});
      return "ok"
  }

  // {"columnFilters":{"domains.Domain":"domain"},"sort":[],"page":1,"perPage":20}
  async getDomainList(req:{offset?:number,size?:number,query?:string}){
    const size = req.size ?? 20;
    const offset = req.offset ?? 0;
    const page = offset % size === 0 ? offset / size : Math.floor(offset / size) + 1;
    const options ={
      page: page,
      perPage: size,
      columnFilters: {
        "domains.Domain": req.query??""
      },
    }
    return await this.doRequest({
      url: "/product/domain/",
      method: "GET",
      params: {
        options: JSON.stringify(options)
      }
    });
  }

  async doRequest(req:HttpRequestConfig){
    const res =  await this.ctx.http.request({
      url: req.url,
      baseURL:"https://api.v2.rainyun.com",
      method: req.method|| "POST",
      data: req.data,
      params:  req.params,
      headers:{
        "x-api-key": this.apiKey
      },
      // httpProxy: this.httpProxy||undefined,
    });

    if (res.code === 200) {
      return res.data;
    }
    throw new Error(res.message || res);
  }
}



new RainyunAccess();
