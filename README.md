# 模块描述

JTStatsClient，发送监控数据的客户端，与JTStats配合使用，相关说明请参考：https://github.com/vicanso/jtstats

# API

- [constructor](#constructor)
- [count](#count)
- [average](#average)
- [gauge](#gauge)

<a name="constructor" />
## constructor
### 构造函数

### 参数列表

- options {host : '监听的host', port : '监听的端口', prefix : '添加到key的前缀'}

```js
var JTStatsClient = require('jtstats_client');
var client = new JTStatsClient({
  host : '127.0.0.1',
  port : '9300',
  prefix : 'testPrefix.'
})
```

<a name="count" />
## count
### 累加（在后台服务器会将特定时间间隔的值累加）

### 参数列表

- key 用于标识该counter
- value 累加的数值，默认为1

```js
//httpRequest的请求次数加1
client.count('httpRequest');
//httpRequest的请求次数加3
client.count('httpRequest', 3);
```

<a name="average" />
## average
### 平均值（在后台服务器会将特定时间间隔的值计算平均值）

### 参数列表

- key 用于标识该average
- value 

```js
//httpResTime的响应时间发送到后台统计
client.average('httpResTime', 300);
```


<a name="gauge" />
## gauge
### 数值（在后台服务器会将特定时间间隔的值取最新值）

### 参数列表

- key 用于标识该gauge
- value 

```js
//connectTotal设置为180
client.gauge('connectTotal', 180);
```