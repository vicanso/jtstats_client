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

- options {host : '监听的host', port : '监听的端口', category : '类别', bufferSize : '缓存多少条记录才发送'}

```js
var JTStatsClient = require('jtstats_client');
var client = new JTStatsClient({
  host : '127.0.0.1',
  port : 9300,
  category : 'haproxy'
})
```

<a name="count" />
## count
### 累加（在后台服务器会将特定时间间隔的值累加）

### 参数列表

- key 用于标识该counter（若new Client时未设置category，可在此设置category|key）
- value 累加的数值，默认为1

```js
//httpRequest的请求次数加1
client.count('httpRequest');
//httpRequest的请求次数加3
client.count('httpRequest', 3);
//若client未设置category
client.count('haproxy|httpRequest', 2);
```

<a name="average" />
## average
### 平均值（在后台服务器会将特定时间间隔的值计算平均值）

### 参数列表

- key 用于标识该average（若new Client时未设置category，可在此设置category|key）
- value 

```js
//httpResTime的响应时间发送到后台统计
client.average('httpResTime', 300);
```


<a name="gauge" />
## gauge
### 数值（在后台服务器会将特定时间间隔的值取最新值）

### 参数列表

- key 用于标识该gauge（若new Client时未设置category，可在此设置category|key）
- value 

```js
//connectTotal设置为180
client.gauge('connectTotal', 180);
```