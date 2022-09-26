## 描述

此插件能够获取到新版的 http 函数 url 并且塞到函数中作为函数变量传入函数配置中。

## 配置

```
edition: 1.0.0
name: component-test
access: wss

vars:
  region: cn-shenzhen
  service:
    name: test-wss
    description: "hello world by serverless devs"

services:
  component:
    component: fc
    actions:
      pre-deploy:
        - plugin: get-http-function-url
          args:
            region: ap-southeast-1
            serviceName: serverless-cd-wss
            functionName: trigger
            envKey: WEBHOOKURL
    props:
      region: ${vars.region}
      service: ${vars.service}
      function:
        name: test
        runtime: nodejs14
        codeUri: ./trigger
        handler: index.handler
        memorySize: 640
        timeout: 12
```



