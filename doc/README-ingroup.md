# TeachingServiceSystem Group2 自动排课

## 使用说明

### 1.依赖关系安装

npm install

### 2.运行

npm start
可以运行网站

## 选课
/course 访问选课页面

## 资源管理
/resource
## 用户登录
/info/login

## 用户添加
/info/personinsert

## 用户删除(by username)
/info/persondelete

## 用户查询(by username)
/info/personselect

## 用户修改(by username)
/info/personmodify

session使用说明
session内带有user信息，直接使用req.session.user即可
例如，需要登录用户才能访问当前页面(否则重定向到login, infn/login)，可如下编程：
router.get('/personselect', function(req, res, next) {
	if(!req.session.user){return res.redirect('login');}
	...
}

PersonModel的使用：
1 原PersonSchema已经移除，现直接调用PersonModel即可；
2 具体使用方法
	var PersonModel = require('../db/group1db/PersonModel');	//在js的开头（不要再函数内部）require PersonModel
	PersonModel.findbyname(username,function (err, user) {		//调用PersonModel方法，username是输入参数，err,user分别是返回错误信息和用户信息
		...
	}
3 PersonModel静态在./db/group1db/PresonModel.js中有定义，如果各小组有其他方法需求，请联系A1小组组长葛现隆

CourseModel的使用：
1 原CourseSchema已经移除，现直接调用PersonModel即可；
2 具体使用方法
	var CourseModel = require('../db/group1db/CourseModel');	//在js的开头（不要再函数内部）require PersonModel
	CourseModel.findbyid(courseid,function (err, course) {		//调用PersonModel方法，username是输入参数，err,user分别是返回错误信息和用户信息
		...
	}
3 CourseModel静态在./db/group1db/CourseModel.js中有定义，如果各小组有其他方法需求，请联系A1小组组长葛现隆

实例请参考route下personinsert.js, courseinsert.js等文件

Person使用数据库 'mongodb://127.0.0.1:27017/info'下的persons collections
Course使用数据库 'mongodb://127.0.0.1:27017/info'下的courses collections

### 3.运行前将下面的内容复制到目录下的settings.js文件

```javascript
  module.exports = {
    db : {
      // modify the line below
      connect : 'mongodb://127.0.0.1:27017/info'
    }
  }
```

### 4.数据库使用说明

* 使用了mongolab的云数据库服务，账号密码都是segroup2。可以利用命令行工具批量导入数据，方便测试。具体导入和导出方法可以参见mongolab网站。
* 目前`教室信息`里使用了segroup2数据库下的`classroom`Collection. 大家可暂时在mongolab上建立自己的collection来作测试。
* 查找和使用数据的例子可以参考 routes/arrange.js 与 views/arrange_classroom_information.ejs
* 更多例子可以参考 db/dbDemo/ 下的文件

### 5.Group2页面文件说明

* views/arrange 自动排课
* views/arrange_course_information 课程信息
* views/arrange_course_management 课程管理
* views/arrange_classroom_information 教室信息

模板元素参考 : http://beer2code.com/themes/core-admin-3/pages/dashboard/dashboard.html

### 6.其他文件说明

* routes/arrange.js  处理后端数据库连接与路由
* settings.js 连接数据库

# login具体使用
首先 我给各位所有的基本路由上都判定了是否登陆，所以大家这个可以不用加了，如果需要取消，可以在index.js里改！
其次，大家想保证登陆用户的类型的话，验证函数在routes／basic／auth里都有，请自己选择。
如果想获取当前用户的信息，就在req.session.user里。
在mongo里手动添加用户的collection是persons


# hook 方法！
如果想在哪个数据插入的同时插入自己的数据，比如user，可以这样做
```js
	var person=require("../db/group1db/PersonModel");
   	person.schema.post('save',function()
   	{
		//内容写在这里
    	console.log("我成功了！！");
  	});
```


# 生成自动登陆用户
如果要生成自动登陆用户，只需要开启服务器后，localhost:3000/adduser即可，不过这个脚本目前还不是非常智能，
如果原来数据库中有这个user，会发生错误，所以，如果要使用，最好能先清空数据库（本地自己的），自动生成后，
该用户会有三门课提供测试，创建的用户为
```
    {
        userid : 3120000000
        username : wtf
        password: 3120000000
        status : 系统管理员
        cstlist : [...(三门课)]
    }
```
    如果要创建别的用户，那很简单，到根目录下./script/adduser.js里去改就好了。
创建完成之后，运行服务器就能自动登陆，如果不想自动登陆，需要更改启动服务器的指令
```
    NODE_ENV="nodev" npm start
```
    自动登陆用户默认为312000000，如果要更改的话，到./routes/basic/login.js中更改。
    如果连接的是远程数据库，请勿再/adduser了，已经设置完成该用户，直接自动登陆就好了。    