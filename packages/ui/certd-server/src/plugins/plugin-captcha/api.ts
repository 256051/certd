export interface  ICaptchaAddon{
  onValidate(data?:any):Promise<any>;
  getClientParams():Promise<any>;
}
