#路由分配
入口：127.0.0.1:3000/OnlineTest
根据登录用户是教师还是学生自动跳转到相应页面

#内容
##/public/Echart
用于可视化的Echart内容
##/db/OnlineTestDB
在线测试相关数据库声明
##/routes/OnlineTest
在线测试相关路由
##/views/OnlineTest
渲染用的html和ejs文件

#使用说明
首先用户需要处于登录状态。
现在的版本中登录由login.js控制，session也可以直接放进去。
为了正常登录，需要先在数据库中添加教师/学生用户。