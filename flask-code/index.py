
from datetime import datetime, date
from flask import Flask, request
import requests
import json
from flask_sqlalchemy import SQLAlchemy
from urllib import parse
import pymysql
import random


app = Flask(__name__)

# 基础项配置

# 小程序apid
APPID = 'appid'
# 小程序secr
SECRET = 'secrt'
# 管理员id
manageropenid = '管理员id'

# 新注册免费次数
newsignnum = 5


# 数据库配置
# # 用户名
user = '用户名'
# 密码
password = parse.quote_plus('数据库密码')
# 表名
database = 'user'
# 地址
sqlurl = '数据库链接'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://%s:%s@%s:3306/%s' % (
    user, password, sqlurl, database)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

# 创建组件对象
db = SQLAlchemy(app)


# 数据表
class BaseConfig(db.Model):
    # 基础配置项
    __tablename__ = 'baseconfig'
    id = db.Column(db.Integer, primary_key=True)
    videonum = db.Column(db.Integer)
    videomax = db.Column(db.Integer)
    sharenum = db.Column(db.Integer)
    sharemax = db.Column(db.Integer)
    everynum = db.Column(db.Integer)
    isadj = db.Column(db.Boolean, default=False)
    manavx = db.Column(db.String(128))


class User(db.Model):
    # 用户表
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    openid = db.Column(db.String(128), unique=True)
    num = db.Column(db.Integer, index=True)
    askhis = db.relationship('AskHis')  # 1.定义关系属性 relationship("关联数据所在的模型类")
    addlog = db.relationship('Log')
    create_time = db.Column(db.DateTime, default=datetime.now, nullable=False)
    update_time = db.Column(
        db.DateTime, default=datetime.now, onupdate=datetime.now)


class AskHis(db.Model):
    # 提问历史
    __tablename__ = 'askhis'
    id = db.Column(db.Integer, primary_key=True)
    ask = db.Column(db.String(10240))
    answ = db.Column(db.String(10240))
    time = db.Column(db.DateTime, default=datetime.now, nullable=False)
    openid = db.Column(db.Integer, db.ForeignKey('user.id'))


class Log(db.Model):
    # 充值日志
    __tablename__ = 'log'
    id = db.Column(db.Integer, primary_key=True)
    addnum = db.Column(db.Integer)
    type = db.Column(db.String(128))
    time = db.Column(db.DateTime, default=datetime.now)
    openid = db.Column(db.Integer, db.ForeignKey('user.id'))


class Adj(db.Model):
    # 广告
    __tablename__ = 'adj'
    id = db.Column(db.Integer, primary_key=True)
    adjinfo = db.Column(db.String(10240))


class ApiPoll(db.Model):
    # api池
    __tablename__ = 'apipoll'
    id = db.Column(db.Integer, primary_key=True)
    apikey = db.Column(db.String(128), unique=True)
    statu = db.Column(db.Boolean, default=True)
    checkstatu = db.Column(db.Boolean, default=True)
    callnum = db.Column(db.Integer, default=0)
    lastlog = db.Column(db.String(10240))
    create_time = db.Column(db.DateTime, default=datetime.now, nullable=False)
    check_time = db.Column(
        db.DateTime, default=datetime.now, onupdate=datetime.now)

# 错误返回


def errout(err):
    errr = str(err)
    res = {
        # 广告信息
        "adj": '接口执行错误',
        "code": 444,
        "errinfo": errr
    }
    return res
# api检测


@app.route('/checkapi', methods=['POST'])
def checkapi():
    apikey = request.json.get('apikey')
    apilist = ApiPoll.query.filter(ApiPoll.statu == False).all()

    try:

        req = requests.post('https://api.openai.com/v1/completions',
                            json={"prompt": '你好', "max_tokens": 1024, "model": "text-davinci-003", "temperature": 0}, headers={
                                'content-type': 'application/json', 'Authorization': 'Bearer ' + apikey})
        if req.status_code == 200:
            ApiPoll.query.filter(
                ApiPoll.apikey == apikey).update({'statu': True})
            db.session.commit()
            api1 = ApiPoll.query.filter().all()
            apilist = []
            for item in api1:
                api = {
                    "key": item.apikey,
                    "keystatu": item.statu,
                    "usernum": item.callnum,
                }
                apilist.append(api)

            print(apilist)
            res = {

                "apilist": apilist,

                "code": 200
            }
            print(res)
            return res

        else:

            reqdic = json.loads(req.text)
            errmsg = reqdic['error']['message']

            ApiPoll.query.filter(ApiPoll.apikey == apikey).update(
                {'checkstatu': False, 'statu': False, 'lastlog': errmsg})
            db.session.commit()

        return errout(errmsg)
    except KeyError as e:

        return errout('openai官方请求错误，请稍后重试')

# 增加api


@app.route('/editapi', methods=['POST'])
def editapi():
    apikey = request.json.get('apikey')
    api2 = ApiPoll.query.filter(ApiPoll.apikey == apikey)
    if api2.first():
        return errout('此key已存在')

    else:

        api1 = ApiPoll(apikey=apikey)
        db.session.add(api1)
        db.session.commit()
        api1 = ApiPoll.query.filter().all()
        apilist = []
        for item in api1:
            api = {
                "key": item.apikey,
                "keystatu": item.statu,
                "usernum": item.callnum,
            }
            apilist.append(api)

        print(apilist)
        res = {

            "apilist": apilist,

            "code": 200
        }
        print(res)
        return res

# 删除api


@app.route('/delkey', methods=['POST'])
def delkey():
    apikey = request.json.get('apikey')
    api2 = ApiPoll.query.filter(ApiPoll.apikey == apikey)
    if api2.first():

        ApiPoll.query.filter(ApiPoll.apikey == apikey).delete()
        db.session.commit()
        api1 = ApiPoll.query.filter().all()
        apilist = []
        for item in api1:
            api = {
                "key": item.apikey,
                "keystatu": item.statu,
                "usernum": item.callnum,
            }
            apilist.append(api)

        print(apilist)
        res = {

            "apilist": apilist,

            "code": 200
        }
        print(res)
        return res

    else:

        return errout('此key不存在')


# 获取APIKEY信息
@app.route('/getapilist', methods=['GET'])
def getapilist():
    api1 = ApiPoll.query.filter().all()
    apilist = []
    for item in api1:
        api = {
            "key": item.apikey,
            "keystatu": item.statu,
            "usernum": item.callnum,
        }
        apilist.append(api)

    print(apilist)
    res = {

        "apilist": apilist,

        "code": 200
    }
    print(res)
    return res


# 设置配置信息
@app.route('/setinfo', methods=['POST'])
def setinfo():
    daynum = int(request.json.get('daynum'))
    sharenum = request.json.get('sharenum')
    videonum = request.json.get('videonum')
    sharemaxnum = request.json.get('sharemaxnum')
    videomaxnum = request.json.get('videomaxnum')
    isadj = request.json.get('isadj')
    manavx = request.json.get('manavx')
    print(daynum, type(daynum))

    set1 = BaseConfig.query.filter()
    if set1.first():

        setinfo = BaseConfig.query.filter(BaseConfig.id == 1)

        setinfo.update({'everynum': daynum, 'sharenum': sharenum, 'videonum': videonum,
                    'sharemax': sharemaxnum, 'videomax': videomaxnum, 'isadj': isadj, 'manavx': manavx})
    else:
        setadd = BaseConfig(everynum= daynum, sharenum= sharenum, videonum= videonum,
                    sharemax= sharemaxnum, videomax= videomaxnum, isadj= isadj, manavx= manavx)
        db.session.add(setadd)
        
    db.session.commit()

    setinfo1 = BaseConfig.query.filter().first()

    daynum1 = setinfo1.everynum
    sharenum1 = setinfo1.sharenum
    videonum1 = setinfo1.videonum
    isadj1 = setinfo1.isadj
    sharemaxnum1 = setinfo1.sharemax
    videomaxnum1 = setinfo1.videomax
    manavx1 = setinfo1.manavx

    res = {

        "daynum": daynum1,
        "sharenum": sharenum1,
        "videonum": videonum1,

        "isadj": isadj1,
        "sharemaxnum": sharemaxnum1,
        "videomaxnum": videomaxnum1,
        "manavx": manavx1,
        "code": 200
    }
    return res


# 获取配置信息
@app.route('/getsetinfo', methods=['GET'])
def getsetinfo():
    setinfo = BaseConfig.query.filter().first()
    daynum = setinfo.everynum
    sharenum = setinfo.sharenum
    videonum = setinfo.videonum
    isadj = setinfo.isadj
    sharemaxnum = setinfo.sharemax
    videomaxnum = setinfo.videomax
    manavx = setinfo.manavx

    print(setinfo)
    res = {

        "daynum": daynum,
        "sharenum": sharenum,
        "videonum": videonum,

        "isadj": isadj,
        "sharemaxnum": sharemaxnum,
        "videomaxnum": videomaxnum,
        "manavx": manavx,

        "code": 200
    }
    return res


# 检测联通
@app.route('/', methods=['GET'])
def index():
    adj = Adj.query.filter()
    print(adj)

    if adj.first():
        adjdetail = adj.first().adjinfo
        res = {
            # 广告信息
            "adj": adjdetail,
            "code": 200
        }
        return res
    else:
        res = {
            # 广告信息
            "adj": '',
            "code": 200
        }
        return res


# 设置广告
@app.route('/setadj', methods=['POST'])
def setadj():
    CODE = request.json.get('code')
    getadjinfo = request.json.get('adjinfo')
    print('code', CODE)
    url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+APPID + \
        '&secret='+SECRET+'&js_code='+CODE+'&grant_type=authorization_code'
    print(url, CODE)
    try:
        req = requests.get(url)
        try:
            getres = json.loads(req.text)
            openid = getres['openid']
            if openid == manageropenid:
                print(getadjinfo)
                # adj1 = Adj(adjinfo =getadjinfo )
                adj0 = Adj.query.filter()
                if adj0.first():
                    Adj.query.filter(Adj.id == 1).update(
                        {'adjinfo': getadjinfo})
                # db.session.add(adj1)
                else:
                    adj1 = Adj(adjinfo=getadjinfo)
                    db.session.add(adj1)
                db.session.commit()
                a = Adj.query.filter().first()
                res = {
                    # 广告信息
                    "adj": a.adjinfo,
                    "code": 200
                }
                return res
            else:
                return 'error'
        except KeyError as e:
            return errout(getres)

    except KeyError as e:

        return errout('微信认证连接失败')

# 管理员充值


@app.route('/manaaddnum', methods=['POST'])
def manaaddnum():
    userid = request.json.get('userid')
    CODE = request.json.get('code')
    num = request.json.get('num')
    print('code', CODE)
    url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+APPID + \
        '&secret='+SECRET+'&js_code='+CODE+'&grant_type=authorization_code'
    print(url, CODE)
    try:
        req = requests.get(url)
        try:
            getres = json.loads(req.text)
            openid = getres['openid']
            if openid == manageropenid:

                user1 = User.query.filter(User.openid == userid).first()
                endnum = user1.num + int(num)
                print(endnum)
                User.query.filter(User.openid == userid).update(
                    {'num': endnum})
                # db.session.add(adj1)
                log1 = Log(addnum=num, type='m', openid=user1.id)
                db.session.add(log1)
                db.session.commit()
                a = User.query.filter(User.openid == userid).first()
                res = {
                    "msg": '充值成功。现有数量：'+str(a.num),
                    "num": a.num,
                    "code": 200
                }
                return res
            else:
                return 'error'
        except KeyError as e:
            return errout(getres)

    except KeyError as e:

        return errout('微信认证连接失败')
# 每日免费次数


@app.route('/everydaynum', methods=['GET'])
def everydaynum():
    everynum = BaseConfig.query.filter().first().everynum
    print(everynum)
    user = User.query.filter(User.num < everynum).update({"num": everynum})
    print(user)
    db.session.commit()
    res = {

        "num": '免费次数更新数量' + str(user),
        "code": 200
    }
    return res


# 用户次数增加
@app.route('/addnum', methods=['POST'])
def addnum():
    baseconfingset = BaseConfig.query.filter().first()
    videonum = baseconfingset.videonum
    videomax = baseconfingset.videomax
    sharenum = baseconfingset.videonum
    sharemax = baseconfingset.sharemax

    type = request.json.get('type')
    openid = request.json.get('openid')
    user1 = User.query.filter(User.openid == openid).first()
    nums = Log.query.filter(Log.time > date.today(),
                            Log.openid == user1.id, Log.type == 's').count()
    numv = Log.query.filter(Log.time > date.today(),
                            Log.openid == user1.id, Log.type == 'v').count()
    print(nums, numv)

    if numv >= videomax:
        res = {
            "msg": '本日看视频领次数活动次数已用尽，不再增加次数',

            "code": 201
        }

        return res
    try:
        if type == 'v':
            if numv >= videomax:
                res = {
                    "msg": '本日看视频领次数活动次数已用尽，不再增加次数',

                    "code": 201
                }

                return res
            endnum = user1.num + videonum
            print(endnum)
            User.query.filter(User.openid == openid).update({'num': endnum})
            log1 = Log(addnum=videonum, type='v', openid=user1.id)
        if type == 's':
            if nums >= sharemax:
                res = {
                    "msg": '本日分享活动次数已用尽，不再增加次数',

                    "code": 201
                }

                return res

            endnum = user1.num + sharenum
            print(endnum)
            User.query.filter(User.openid == openid).update({'num': endnum})

            log1 = Log(addnum=sharenum, type='s', openid=user1.id)

        db.session.add(log1)
        db.session.commit()
        a = User.query.filter(User.openid == openid).first()
        res = {
            "msg": '任务完成，现有数量：'+str(a.num),
            "num": a.num,
            "code": 200
        }

        return res
    except KeyError as e:
        return errout('次数增加故障，请联系管理员')


# 微信code获取openid
@app.route('/login', methods=['POST'])
def LOGIN():
    CODE = request.json.get('code')
    print('code', CODE)
    url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+APPID + \
        '&secret='+SECRET+'&js_code='+CODE+'&grant_type=authorization_code'
    print(url, CODE)
    try:
        req = requests.get(url)
        try:
            getres = json.loads(req.text)
            openid = getres['openid']
            # 判断是否注册
            if openid:
                print('已注册')
                userin = User.query.filter(User.openid == openid)
                if userin.first():
                    num = userin.first().num
                    res = {
                        "resmsg": getres,
                        "mana": manageropenid,
                        "num": num,
                        "code": 200

                    }
                    return res

                else:
                    print('已注册')
                    useradd = User(openid=openid, num=newsignnum)
                    db.session.add(useradd)
                    db.session.commit()

                    a = User.query.filter(User.openid == openid).first()
                    res = {
                        "resmsg": getres,
                        "mana": manageropenid,
                        "num": a.num,
                        "code": 200
                    }
                    return res
            else:
                return 'error'
        except KeyError as e:
            return errout(getres)

    except KeyError as e:

        return errout('微信认证连接失败')


# 消息处理
@app.route('/message', methods=['POST'])
def mess():
    api1 = ApiPoll.query.filter(
        ApiPoll.statu == True, ApiPoll.checkstatu == True).all()
    api = random.choice(api1)
    msg = request.json.get('msg')
    maxtoken = request.json.get('maxtoken')
    openid = request.json.get('openid')
    try:
        req = requests.post('https://api.openai.com/v1/completions',
                            json={"prompt": msg, "max_tokens": maxtoken, "model": "text-davinci-003", "temperature": 0.8}, headers={
                                'content-type': 'application/json', 'Authorization': 'Bearer ' + api.apikey})
        user1 = User.query.filter(User.openid == openid).first()

        if req.status_code == 200:

            reqdic = json.loads(req.text)
            print(reqdic)

            answ = reqdic['choices'][0]['text']
            ask1 = AskHis(ask=msg, answ=answ, openid=user1.id)
            ApiPoll.query.filter(ApiPoll.apikey == api.apikey).update(
                {'callnum': ApiPoll.callnum + 1})
            usernum = user1.num - 1
            User.query.filter(User.openid == openid).update({'num': usernum})
            db.session.add(ask1)
            db.session.commit()

            res = {
                "resmsg": reqdic,
                "num": usernum,
                "code": 200
            }
            return res
        else:
            reqdic = json.loads(req.text)
            errmsg = reqdic['error']['message']
            errcode = reqdic['error']['code']
            errtype = reqdic['error']['type']
            print(reqdic)
            if errcode == 'invalid_api_key' or errtype == "insufficient_quota":
                api = ApiPoll.query.filter(ApiPoll.apikey == api.apikey).update({
                    'statu': False, 'lastlog': errmsg})
                db.session.commit()
                return errout(errmsg)
            else:
                return errout(errmsg)

    except KeyError as e:

        return errout('openai官方请求错误，请稍后重试')


# 获取运营信息
@app.route('/userinfo', methods=['GET'])
def userinfo():

    allusernum = User.query.filter().count()
    dayadduser = User.query.filter(User.create_time > date.today()).count()
    allanswnum = AskHis.query.filter().count()

    res = {

        "allusernum": allusernum,
        "dayadduser": dayadduser,
        "allanswnum": allanswnum,
        "code": 200
    }
    print(res)
    return res


if __name__ == '__main__':
    app.run(debug=True)
