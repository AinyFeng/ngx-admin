# UEA

## UEA, User Experience Asset Ver:2019 (V4.3)

## 软件架构

基于 Angular9+、ngx-admin、Nebular、Bootstrap4、TypeScript、HTML5 构建。

## 安装教程

1. 安装 Node.JS 12.2.0,使用自带的 npm;
2. 安装 Python2.7;
3. 克隆 uea；
4. 运行：npm install
5. 运行：npm start
6. 建议使用：Intelli Java IDEA、WebStorm、Visual Studio Code 开发工具;
7. 运行：npm run build:prod 进行正式生产版本的发布，会生成/dist 目录；
8. 将/dist 目录复制到生产服务器指定目录下，然后配置 nginx，启动并提供访问服务。

## 使用说明

1. /src/app/@uea 目录：用于 UEA 持续构建的公共组件；
2. /src/app/modules 目录：用于项目或产品中功能模块的开发；新模块请创建子目录存放。
3. 其他问题，可以联系管理员了解。

## 子工程创建

1. ng generate application --enable-ivy true --style scss --routing true xxx
2. ng add @angular/pwa --project xxx
3. copy web/src/app/@uea to xxx/src/app/@uea
4. copy web/src/app/modules to xxx/src/app/modules
5. copy web/src/silent-refresh.html to xxx/src/silent-refresh.html
6. append following items to angular.json::xxx/build & xxx/test :
    ### "assets": [
    "projects/xxx/src/favicon.ico",
    "projects/xxx/src/assets",
    "projects/xxx/src/silent-refresh.html",
    "projects/xxx/src/manifest.webmanifest"
    ],
    ### "styles": [
    "projects/xxx/src/app/@uea/theme/base-theme/styles.scss",
    "projects/xxx/src/styles.scss",
    "node_modules/bootstrap/dist/css/bootstrap.css",
    "node_modules/typeface-exo/index.css",
    "node_modules/@fortawesome/fontawesome-free/css/all.css",
    "node_modules/socicon/css/socicon.css",
    "node_modules/pace-js/templates/pace-theme-flash.tmpl.css",
    "node_modules/ionicons/dist/scss/ionicons.scss",
    "node_modules/ng-zorro-antd/ng-zorro-antd.min.css",
    "node_modules/font-awesome/css/font-awesome.css"
    ],
    ### "scripts": [
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/bootstrap/dist/js/bootstrap.js",
    "node_modules/pace-js/pace.min.js",
    "node_modules/echarts/dist/echarts.min.js",
    "node_modules/echarts/dist/extension/bmap.min.js"
    ]
7. append following style line into file :"projects/xxx/src/styles.scss",
   @import './app/@uea/theme/base-theme/styles';

8. run ng add @angular/localize -p xxx ;
9. Or add line `import '@angular/localize/init'` into polyfills.ts

## 工程访问地址(端口约定)

### 19999

[web - 智慧接种门诊-Web 应用](https://localhost:19999)

### 19998

[APIServer - API 服务中台侦听端口](https://localhost:19998)

### 19997

[coldchain - 智慧接种平台-冷链管理](https://localhost:19997)

### 19996

[plan - 智慧接种平台-计划管理](https://localhost:19996)

### 19995

[vaccinationstatistics - 智慧接种平台-预防接种统计](https://localhost:19995)

### 19994

[vaccinationstock - 智慧接种平台-疫苗出入库管理](https://localhost:19994)

### 19993

[obstetricvaccination - 智慧接种门诊-产科接种台](https://localhost:19993)

### 19992

[vaccinationexamine - 智慧接种平台-接种查验管理](https://localhost:19992)

### 19991

[webpub - 智慧接种门诊-微信公众号](https://localhost:19991/wxpub)

### 19990

[demo - 实验功能开发与演示](https://localhost:19990)

## 参与贡献

1. 本项目全体成员。

## 软件授权

本软件属于商业软件，归安徽奇兵医学所有，请勿在未授权的情况下传播、复制、售卖。
