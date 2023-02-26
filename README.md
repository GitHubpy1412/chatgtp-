# 某AI小程序部署教程
## 可以看一下我已经搭建好的
![在这里插入图片描述](https://img-blog.csdnimg.cn/80f2cdca19714560b357e8c7465b3163.jpeg#pic_center)

### 源码地址：[chatgpt微信小程序源码](https://github.com/GitHubpy1412/chatgtp-)


### 小程序功能介绍

ChatGPT小程序使用OpenAI官方 GPT-3 text-davinci-003模型接口进行问答，与ChatGPT高度相似，但不是同一个模型。ChatGPT更像是一个冰冷的机器人，而davinci更像是有“自我意识”

小程序具有会员次数充值，广告设置的功能。


### 注意事项

自己注册个小程序，按着教程来设置就行。有问题在群里问。

**小程序名字不要带【OpenAI】【ChatGPT】等字眼**

### 开通云数据库（自己有服务器啥的去服务器开一个就行了，MySQL版本要求5.7）

首先登录阿里云 搜索云数据库RDS 点击管理控制台

![在这里插入图片描述](https://img-blog.csdnimg.cn/7ccfe94ca52140cb8c31c7da0d4eceaa.png)



点击创建实例

![在这里插入图片描述](https://img-blog.csdnimg.cn/c19299be23cb4507843e7fb5f475043f.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/6dc2e7f2d4784472bcedb1575792c5ab.png)


计费方式选择“severless” 类型选择5.7 

![在这里插入图片描述](https://img-blog.csdnimg.cn/bfdb45f5f8fb42a1ae935377fdd75fc1.png)


选择一个交换机，如果没有的话自己随便创建一个就可以。

下方高权限账号选择立即设置，自己设置好账号密码。记在记事本上。

![在这里插入图片描述](https://img-blog.csdnimg.cn/7ff54364f09d45bb8f977e6918c4b760.png)


设置完成后点下一步去支付就开通成功了。**新开的用户是白嫖的。**

等待一段时间数据库开始运行后，打开实例列表-管理-左边数据库连接 右侧开通外网地址，把数据库外网地址记录好。

![在这里插入图片描述](https://img-blog.csdnimg.cn/d80c29353f2d4e418066e904ad9320eb.png)


![在这里插入图片描述](https://img-blog.csdnimg.cn/2a08c9ca38b24c499a77a699d349fdc0.png)


改好后，点击左侧数据库管理 创建一个叫user的数据库就可以了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/46574c714db747108ec92c4a179098e6.png)

### 函数代码部署

搜索函数计算FC 点击免费开通 自己免费开通下。

![在这里插入图片描述](https://img-blog.csdnimg.cn/4cce5cbc89d4449ea74fb479c622a54d.png)

开通完以后点击进入控制台 服务及函数-创建服务

![在这里插入图片描创建废物述](https://img-blog.csdnimg.cn/eca45dc0f5f34608b5c4bd1bab347dfa.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/8bd4bef5df704598b46a12857576d9b4.png![在这里插入图片描述](https://img-blog.csdnimg.cn/52ebd844aca64cfeadb76d338f0ccc7f.png)



名字随便写，写完点确定。然后进入点击创建函数-内置服务创建-按图选择好。然后上传flask-code 

![在这里插入图片描述](https://img-blog.csdnimg.cn/ec37446def7a46d3a83512391a2b3c03.png)


![在这里插入图片描述](https://img-blog.csdnimg.cn/4e4c1ed08a564203ae776428259a0f16.png)



然后点击下方高级设置 超时时间写180 处理程序写index.app 然后点击创建

![在这里插入图片描述](https://img-blog.csdnimg.cn/a50c725fb9c74f4bb9df867d5ee3318b.png)


创建完以后进入函数，打开在线IDE index.py

把申请的小程序 appid SECRET输入 管理员ID暂时不用填。

下方数据库按照上一步中设置的账号密码输入 sqlurl 输入数据库外网地址。

微信小程序request合法域名也添加一个数据库的外网地址。

小程序方面知识不会的到群里问。

然后保存。

![在这里插入图片描述](https://img-blog.csdnimg.cn/84df9b4226d84af9ab3ec32361f12fb0.png)


保存完点击右边db.py文件测试下

![在这里插入图片描述](https://img-blog.csdnimg.cn/4cd27286ed884bcda19dcf8b5eb1acc9.png)


点击右上方运行按钮 不报错就行了。然后点击上方“部署代码” 然后再点下旁边蓝色的URL按钮复制连接。然后先不用管。
![在这里插入图片描述](https://img-blog.csdnimg.cn/2bf00cf5d50646b3a5bd3e96b1826846.png)


### 创建每日刷新次数函数

紧接上一步，点击上一步的左上角箭头返回，创建函数。

使用内置运行时创建-处理事件请求 然后通过文件夹上传 code

![在这里插入图片描述](https://img-blog.csdnimg.cn/2452df8783dc4b4aa4fb7a25730e6aa5.png)


下方触发器配置按图配置即可。名称随便填写。

![在这里插入图片描述](https://img-blog.csdnimg.cn/6373c25ba2064092bf894e7e9b1c64c0.png)


创建完进入函数，URL这边输入刚刚我们部署完函数时点击蓝色URL按钮复制的URL。然后点一下上方部署代码。返回即可。

![在这里插入图片描述](https://img-blog.csdnimg.cn/9cedfb8a5fd94a36af95a8f62b3c3839.png)

### 小程序部署上传

小程序取名字 不要带有ChatGPT OpenAI 等任何字眼！类目选择办公就行。

打开微信开发者工具，打开小程序源码（GPT3）

![在这里插入图片描述](https://img-blog.csdnimg.cn/71d389e84284456f968c90bbd0d90161.png)


在如图文件中右方URL改成你刚刚复制的URL 下面写你微信号 然后ctrl+s编译一下就行了

小程序页面出来以后，点击左下角
![在这里插入图片描述](https://img-blog.csdnimg.cn/fd50b94e5a8148ada33fe931e37c2e88.png)


![在这里插入图片描述](https://img-blog.csdnimg.cn/5cf97a2d1ded4f849fd921d58b473d95.png)



把用户账号复制到上方云函数中没有填写的管理员ID。填写完成后记得点部署。

刷新一下小程序，就可以出现一个参数配置按钮。自己配置就行了。

广告开关默认先别打开，如果要打开自己配置广告。

Key自己增加OpenAI Key
然后去小程序开发管理那里配置request合法域名自己添加下云函数的URL
![在这里插入图片描述](https://img-blog.csdnimg.cn/cffb4f513c6749008881b83a6a29a551.png)

配置好之后上传就行了。
### 服务器搭建数据库
如果自己有服务器的话自己建一个数据库就行了，下图是宝塔里面创建的
![在这里插入图片描述](https://img-blog.csdnimg.cn/7cd3cd6e01384fe08126599fb8350991.png)
配置fc函数那里的URL直接填域名就行了，一般数据库端口是3306，防火墙开一下。
![在这里插入图片描述](https://img-blog.csdnimg.cn/a1482aafa9a54dfaa048b9622c0a9db6.jpeg#pic_center)


