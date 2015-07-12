# 任务1 GridFS

> gdl

- 两个API接口
    - `/resource/cloud/upload` POST 简单实现demo
    - `/resource/cloud/download/:filename` GET 简单实现demo
- cloud页面后台
    - `/resource/cloud/` GET 
- cloud上传测试页面
    - `/resource/cloud/upload` GET 用于文件上传测试
- 如何验证
    - 访问测试页面上传文件
    - 访问cloud页面检查内容
    - 点击下载按钮下载
- 存在问题
    1. GridFS 中可以存入相同名字的文件，目前都会显示在cloud上
    2. 没有登录验证
    
# 任务2 前端页面

> lyt

- 基础页面设计
