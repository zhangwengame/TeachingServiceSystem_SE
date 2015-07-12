# TeachingServiceSystem Group6 
## 使用说明

### 1.依赖关系安装
 npm install
      
### 2.运行
 npm start
      
### 3.运行前将下面的内容复制到目录下的settings.js文件

  module.exports = {
    db : {
      // modify the line below
            connect : '讨论组记录中有'
    }
  }
  
### 4.数据库使用说明    

* 使用了mongolab的云数据库服务，账号密码都是tsgroup6。可以利用命令行工具批量导入数据，方便测试。具体导入和导出方法可以参见mongolab网站。
    
* 目前成绩统计里使用了group6数据库下的grades Collection. 大家可暂时在mongolab上建立自己的collection来作测试。

* 查找和使用数据的例子可以参考 routes/grades.js 与 views/grades.ejs
* 更多例子可以参考 db/dbDemo/ 下的文件
   
### 5.Group6页面文件说明                                                                                                                                       
  * views/grades/admin_gradesaudit.ejs  成绩审核（管理员）
  * views/grades/admin_slide.html  老师侧边栏
  * views/grades/teacher_classlist.ejs  课程列表（教师）
  * views/grades/teacher_classmanage.ejs  课程管理(教师)
  * views/grades/teacher_slide.html  老师侧边栏
  * views/grades/student_grades.ejs  成绩统计（学生）
  * views/grades/student_analysis.ejs  成绩分析（学生）
  * views/grades/student_test.ejs  考试查询（学生）
  * views/grades/student_guide.ejs  培养方案（学生）
  * views/grades/student_slide.html  学生侧边栏

   
  模板元素参考 : http://beer2code.com/themes/core-admin-3/pages/dashboard/dashboard.html

  
### 6.其他文件说明

db/group6db/ 数据库文件目录
routes/grads.js  处理后端数据库连接与路由
settings.js 连接数据库


### 7.使用说明

1. session使用请参考 routes/grades.js 与 views/grades/student_grades.ejs
2. 需要修改远程数据库，请使用ssh 登录讨论组里公布的账户和地址。
3. 有问题在讨论组中提出




    

