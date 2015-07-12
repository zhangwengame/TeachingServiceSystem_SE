# Group4 文档

Group4 内部共享信息

> 1. 修改时添加修订说明
> 2. 修改完确认本文档能正常渲染显示之后再 push
> 3. 本文使用 Markdown 写作，请熟悉之后再修改
> 4. 请关注“进度情况”

# 1 修订说明

- `2015.4.14`**Gnnng**:创建文档
- `2015.4.14`**lyt9304**:添加当前路由说明
- `2015.4.15`**Gnnng**:修改路由说明，简化文本，增加"Git 使用"和"代码规范""
- `2015.4.17`**Gnnng**:增加"进度情况"，"如何测试"和"GridFS说明"
- `2015.4.19`**Gnnng**:补充细节到"如何测试"
- `2015.4.20`**Gnnng**:删除冗余信息，增加第二周任务
- `2015.5.11`**Gnnng**:将进度移出本文档，每周单独存为`group4_MM.DD-MM.DD.md`格式的文档

# 2 路由说明

> 按照这样的格式修改，不要太冗长，只是简单说明

- `/resource`
    - `/` 默认路由，保留用作跳转
    - `/cloud`
        - `/` 个人网盘页面
        - `/search` 公开资源搜索页面，热门资源展示
    - `/course` 默认跳转`/data`
        - `/data` 课程资源，上传下载
        - `/info` 课程信息
        - `/homework` 作业提交
        - `/feedback` 反馈信息
    - `/config` 

#### 注：
1. 上述只是确定大致结构，具体路由和代码实现有关

# 3 Git 使用

## 注意事项

1. 在 `git push` 之前，确认以下事项：
    1. 确认当前版本代码已经经过测试
    2. 不要上传过大的资源文件
    3. 无关文件不要添加

# 4 代码规范

## 缩进

1. js 文件统一缩进单位为2个空格
2. 其它文件暂不要求，如果需要别人按照自己的要求修改，在这里列出

## 注释

1. 多写注释
1. `//TODO need to be done`，用这样的注释来表示功能未完成
2. `//FIXME need to be fixed`，表示有bug需要修复

## 修改他人代码

1. 不能确定别人代码是否无用，暂时将其注释
2. 经过他人同意，再直接删除


# 5 进度情况

> 已移出本文档

# 6 如何测试

## mocha

这是一个测试框架，首页<http://mochajs.org/>有不少例子可以看。

## 运行测试

> 确保已经 `npm install`

`make` 或者 `mocha`


## 如何编写测试

所有的测试文件都放在`test`目录下，文件名称自定，但是扩展名为`.js`。每个文件都是一个独立的测试集合。

mocha 提供了几个基本的测试方法`describe`, `it`，具体用法可以参考`test_route_of_resource.js`以及官网文档

```
var should = require('should'); //一个断言库
var request = require('request'); //一个用来模拟发起HTTP请求的库
var async = require('async'); //略

describe('These is a test subject', function() {
  it('a test case under current subject', function(done){
    // do some test with 'should'

    // then call done() to end this test
    done();
  });
});

```

## 添加路由可用性测试

参考`test_route_of_resource.js`，基本不需要太大的改动。

```javascript
// 直接按照格式添加路由到该文件的数组中
    [
      '/resource',
      '/resource/cloud',
      '/resource/course',
      '/resource/config',
      '/resource/newroute'
    ]
```

# 7 GridFS 说明

官方文档在<https://github.com/aheckmann/gridfs-stream>



