# Certd本身的https证书配置

## 一、启用https

`Certd`默认启用https，监听7002端口    
如果你想关闭https，或者修改端口，可以在环境变量中配置
```shell
CERTD_HTTPS_ENABLE=true
CERTD_HTTPS_port=7002

```

## 二、自动更新Certd的https证书

### 1、创建证书流水线

参考Certd顶部的创建证书流水线教程

### 2、配置复制到本机任务
![](./images/1.png)
![](./images/2.png)

### 3、重启Certd
![img.png](./images/3.png)

:::warning
重启Certd插件，并不具备重启自己的能力，而是`杀死自己`，然后靠`Docker`来重启自己
:::