import pymysql#数据库连接
"""后端服务器连接"""
from flask import Flask,request,jsonify
from flask_cors import CORS
from datetime import datetime

#后端服务启动
app=Flask(__name__)
CORS(app,resources=r"/*")


"""user表相关"""
# 登录
@app.route("/user/login", methods=["POST"])
def logging():
    res = {"success": False, "message": "登录失败"}
    if request.method == "POST":
        try:
            db = pymysql.connect(host='localhost', user='root', password='yunx', port=3306, db='online_library')
            cursor = db.cursor(pymysql.cursors.DictCursor)
            print("收到登录请求")
            user_name = request.form.get("user_name")
            password = request.form.get("password")
            cursor.execute("SELECT * FROM user WHERE user_name=\"%s\" AND password=\"%s\";" % (user_name, password))
            db.commit()
            user = cursor.fetchone()
            if user:
                res["success"] = True
                res["message"] = "登录成功"
                res["user"] = user
            else:
                res["message"] = "用户名或密码错误"
        except Exception as e:
            res["message"] = str(e)
        finally:
            db.close()
    return jsonify(res)

# 注册
@app.route("/user/register", methods=["POST"])
def register():
    res = {"success": False, "message": "注册失败"}
    if request.method == "POST":
        try:
            db = pymysql.connect(host='localhost', user='root', password='yunx', port=3306, db='online_library')
            cursor = db.cursor(pymysql.cursors.DictCursor)
            print("收到注册请求")
            
            user_name = request.form.get("user_name")
            password = request.form.get("password")
            
            if not user_name or not password:
                res["message"] = "用户名或密码不能为空"
                return jsonify(res)
            
            cursor.execute("SELECT * FROM user WHERE user_name=\"%s\";" % user_name)
            db.commit()
            if cursor.fetchone():
                res["message"] = "用户名已存在"
                return jsonify(res)
            
            cursor.execute("INSERT INTO user (user_name, password) VALUES (\"%s\", \"%s\");" % (user_name, password))
            db.commit()
            res["success"] = True
            res["message"] = "注册成功"
            res["user"] = {"user_name": user_name, "password": password}
            
            # 返回新用户的ID
            cursor.execute("SELECT LAST_INSERT_ID();")
            db.commit()
            user_id = cursor.fetchone()
            # res["user_id"] = user_id
            res["user_id"] = user_id["LAST_INSERT_ID()"]
        except Exception as e:
            res["message"] = str(e)
        finally:
            db.close()
    print(res)
    return jsonify(res)


# 充值
@app.route("/user/recharge", methods=["POST"])
def recharge():
    res = {"success": False, "message": "充值失败"}
    if request.method == "POST":
        try:
            db = pymysql.connect(host='localhost', user='root', password='yunx', port=3306, db='online_library')
            cursor = db.cursor()
            print("收到充值请求")
            print(request)
            user_id = request.form.get("user_id")
            money = request.form.get("money")
            
            if not user_id or not money:
                res["message"] = "用户ID或充值金额不能为空"
                return jsonify(res)
            
            # 更新余额
            cursor.execute("UPDATE user SET money = money + %s WHERE user_id = %s", (money, user_id))
            db.commit()
            res["success"] = True
            res["message"] = "充值成功"
        except Exception as e:
            res["message"] = str(e)
        finally:
            db.close()
    print("res:")
    print(res)
    return jsonify(res)
    

# 查询用户余额
@app.route("/user/data", methods=["POST"])
def data():
    res = {"success": False, "message": "获取用户数据失败"}
    if request.method == "POST":
        try:
            db = pymysql.connect(host='localhost', user='root', password='yunx', port=3306, db='online_library')
            cursor = db.cursor(pymysql.cursors.DictCursor)
            print("收到查询请求")
            user_id = request.form.get("userId")  # 修改此处，将 user_id 改为 userId
            if not user_id:
                res["message"] = "用户ID不能为空"
                return jsonify(res)
            cursor.execute("SELECT * FROM user WHERE user_id=\"%s\";" % user_id)
            db.commit()
            user = cursor.fetchone()
            if user:
                res["success"] = True
                res["message"] = "获取用户数据成功"
                res["user"] = user
            else:
                res["message"] = "用户不存在"
        except Exception as e:
            res["message"] = str(e)
        finally:
            db.close()
    print("查询用户数据",res)
    return jsonify(res)


# 查询用户最近消费记录（10条）
# userId 
# @app.route("/user/cost",methods=["POST"])
# def cost():
   
#     res = False;
    
#     db = pymysql.connect(host='localhost', user='root', password='yunx', port=3306, db='online_library')
#     cursor=db.cursor()
    
#     print("消费记录查询请求")
#     userId=str(request.form.get("userId"))
    
#     #修改余额
#     cursor.execute("select * from record where user_id=\"%s\";"%(userId));
#     db.commit()
    
#     res=cursor.fetchall();
    
#     return res;
    

#     res = False
#     print("正在访问充钱接口")
    
#     db = pymysql.connect(host='localhost', user='root', password='yunx', port=3306, db='online_library')
#     cursor=db.cursor()
    
#     user_id=int(request.form.get("userId"))
#     money=float(request.form.get("money"))
#     res=cursor.execute("update book set money=money+10 where user_id=\"%s\";"%(user_id))
#     db.commit()
#     print("查询阅读记录",res)
#     return jsonify(res);


# 查询用户最近消费记录（10条）
@app.route("/user/cost", methods=["POST"])
def cost():
    res = {"success": False, "message": "获取消费记录失败"}
    if request.method == "POST":
        try:
            db = pymysql.connect(host='localhost', user='root', password='yunx', port=3306, db='online_library')
            cursor = db.cursor(pymysql.cursors.DictCursor)
            print("消费记录查询请求")
            #get("")  双引号中的值为传入的名称，前端后端必须保持一致
            #这里其实也改为user_id会比较好，因为这样可以保持一致
            user_id = request.form.get("userId")
            if not user_id:
                res["message"] = "用户ID不能为空"
                return jsonify(res)
            # 查询记录并获取书籍名称
            cursor.execute("""
                SELECT 
                    r.*, 
                    b.title AS title 
                FROM 
                    record r 
                LEFT JOIN 
                    book b ON r.book_id = b.id 
                WHERE 
                    r.user_id=\"%s\" 
                LIMIT 10;
            """ % user_id)
            db.commit()
            records = cursor.fetchall()
            if records:
                res["success"] = True
                res["message"] = "获取消费记录成功"
                res["records"] = records
            else:
                res["message"] = "没有找到消费记录"
        except Exception as e:
            res["message"] = str(e)
        finally:
            db.close()
    return jsonify(res)



"""book表相关"""
#读取20本书的数据
# null
@app.route("/book/getNum",methods=["POST"])
def getNum():
    res = False
    print("正在访问读取图书接口")
    
    db = pymysql.connect(host='localhost', user='root', password='yunx', port=3306, db='online_library')
    cursor=db.cursor()
    
    res=cursor.execute("select * from book ;")
    db.commit()
    res=cursor.fetchall()

    return jsonify(res);

"""book表相关"""
#读取20本书的数据(用户记录相关)
# null
@app.route("/book/getNumRelated", methods=["POST"])
def getNumRelated():
    res = False
    print("正在访问读取图书接口")

    db = pymysql.connect(host='localhost', user='root', password='yunx', port=3306, db='online_library')
    cursor = db.cursor()

    # 假设用户 ID 从请求中获取
    user_id=str(request.form.get("user_id"))
    print(user_id)

    if user_id:
        # 查询用户读过的书的 ID
        cursor.execute("SELECT book_id FROM record WHERE user_id = %s", (user_id,))
        read_books = cursor.fetchall()
        read_book_ids = [book[0] for book in read_books]
        
        # 构建查询字符串
        # 如果用户读过书，将这些书排在前面
        if len(read_book_ids)!=0:
            # 使用字符串格式化来构建 IN 子句
            in_clause = ', '.join(['%s'] * len(read_book_ids))
            query = f"""
                SELECT * FROM book
                WHERE id IN ({in_clause})
                UNION
                SELECT * FROM book
                WHERE id NOT IN ({in_clause})
                LIMIT 20
            """
            cursor.execute(query, read_book_ids + read_book_ids)
        else:
            print("用户没看过书");
            # 如果用户没有读过任何书，直接查询所有书
            cursor.execute("SELECT * FROM book ")
    else:
        # 如果没有提供用户 ID，直接查询所有书
        cursor.execute("SELECT * FROM book ")

    res = cursor.fetchall()
    db.commit()
    db.close()

    return jsonify(res)

#条件查询书籍
# category bookName
@app.route("/book/find",methods=["POST"])
def find():
    res = False
    print("正在访问读取图书接口")
    
    db = pymysql.connect(host='localhost', user='root', password='yunx', port=3306, db='online_library')
    cursor=db.cursor()
    
    category=str(request.form.get("category"))
    bookName=str(request.form.get("bookName"))
    
    if category!="" and bookName!="":
        sqlStr="select * from book where category=\"%s\" and book_name=\"%s\";"%(category,bookName);
    elif category!="":
        sqlStr="select * from book where category=\"%s\" ;"%(category);
    elif bookName!="": 
        sqlStr="select * from book where title=\"%s\";"%(bookName);
        
    db.commit()
    res=cursor.execute(sqlStr)
   
    return jsonify(res);

#排行榜：
# 获取排行榜数据
@app.route("/books/ranking", methods=["POST"])
def ranking():
    res = {"success": False, "message": "获取排行榜失败"}
    if request.method == "POST":
        try:
            db = pymysql.connect(host='localhost', user='root', password='yunx', port=3306, db='online_library')
            cursor = db.cursor(pymysql.cursors.DictCursor)
            category = request.form.get("category")
            sql = ""
            if category:
                sql = "SELECT * FROM book WHERE category=\"%s\" ORDER BY read_volumn DESC LIMIT 10;" % category
            else:
                sql = "SELECT * FROM book ORDER BY read_volumn DESC LIMIT 10;"
            cursor.execute(sql)
            db.commit()
            books = cursor.fetchall()
            if books:
                res["success"] = True
                res["message"] = "获取排行榜成功"
                res["books"] = books
            else:
                res["message"] = "没有找到相关数据"
        except Exception as e:
            res["message"] = str(e)
        finally:
            db.close()
    return jsonify(res)




#书籍读取量改变
# bookName
# @app.route("/book/read",methods=["POST"])
# def read():
#     res = False
#     print("正在访问增加读取量接口")
    
#     db = pymysql.connect(host='localhost', user='root', password='yunx', port=3306, db='online_library')
#     cursor=db.cursor()
    
#     bookName=str(request.form.get("bookName"))
#     res=cursor.execute("update book set read_volumn=read_volumn+1 where title=\"%s\";"%(bookName))
#     db.commit()
    
#     return jsonify(res);

# 增加阅读量
@app.route("/book/read", methods=["POST"])
def read():
    res = {"success": False, "message": "增加阅读量失败"}
    if request.method == "POST":
        try:
            db = pymysql.connect(host='localhost', user='root', password='yunx', port=3306, db='online_library')
            cursor = db.cursor()
            print("正在访问增加读取量接口")
            book_title = request.form.get("bookTitle")  #bookTitle：是传入的数据名？？？
            if not book_title:
                res["message"] = "书籍标题不能为空"
                return jsonify(res)
            cursor.execute("UPDATE book SET read_volumn=read_volumn+1 WHERE title=\"%s\";" % book_title)
            db.commit()
            res["success"] = True
            res["message"] = "阅读量增加成功"
        except Exception as e:
            res["message"] = str(e)
        finally:
            db.close()
    return jsonify(res)

"""阅读记录表相关"""
#开始阅读
# userId bookId 
# @app.route("/read/start",methods=["POST"])
# def startRead():
#     res = False
#     print("正在访问开始阅读接口")
    
#     db = pymysql.connect(host='localhost', user='root', password='yunx', port=3306, db='online_library')
#     cursor=db.cursor()
    
#     userId=int(request.form.get("userId"))
#     bookId=int(request.form.get("bookId"))
    
#     now = datetime.now()
#     begin_time = now.strftime("%Y-%m-%d %H:%M:%S")
    
#     res=cursor.execute("insert into record (book_id,user_id,begin_time) VALUES(\"%s\",\"%s\",\"%s\")"%(userId,bookId,begin_time))
#     db.commit()
  
#     return jsonify(res);

# 开始阅读
@app.route("/read/start", methods=["POST"])
def startRead():
    res = {"success": False, "message": "开始阅读失败"}
    if request.method == "POST":
        try:
            db = pymysql.connect(host='localhost', user='root', password='yunx', port=3306, db='online_library')
            cursor = db.cursor()
            print("正在访问开始阅读接口")
            print(request.form.get("user_id"))
            user_id = request.form.get("user_id")
            book_id = request.form.get("book_id")
            if not user_id or not book_id:
                res["message"] = "用户ID或书籍ID不能为空"
                return jsonify(res)
            now = datetime.now()
            begin_time = now.strftime("%Y-%m-%d %H:%M:%S")
            cursor.execute("INSERT INTO record (book_id, user_id, begin_time) VALUES (\"%s\", \"%s\", \"%s\");" % (book_id, user_id, begin_time))
            db.commit()
            res["success"] = True
            res["message"] = "开始阅读成功"
            res["record_id"] = cursor.lastrowid
        except Exception as e:
            res["message"] = str(e)
        finally:
            db.close()
    return jsonify(res)

# 结束阅读
@app.route("/read/end", methods=["POST"])
def stopRead():
    res = {"success": False, "message": "结束阅读失败"}
    if request.method == "POST":
        try:
            db = pymysql.connect(host='localhost', user='root', password='yunx', port=3306, db='online_library')
            cursor = db.cursor()
            print("正在访问停止阅读接口")
            user_id = request.form.get("user_id")
            book_id = request.form.get("book_id")
            if not user_id or not book_id:
                res["message"] = "用户ID或书籍ID不能为空"
                return jsonify(res)
            # 查询最新的未计费记录
            cursor.execute("SELECT begin_time FROM record WHERE user_id=\"%s\" AND book_id=\"%s\" AND price=0 ORDER BY record_id DESC LIMIT 1;" % (user_id, book_id))
            db.commit()
            record = cursor.fetchone()
            if not record:
                res["message"] = "未找到阅读记录"
                return jsonify(res)
            begin_time = datetime.strptime(record[0], "%Y-%m-%d %H:%M:%S")
            now = datetime.now()
            end_time = now.strftime("%Y-%m-%d %H:%M:%S")
            end_time_datetime = datetime.strptime(end_time, "%Y-%m-%d %H:%M:%S")
            delta = (end_time_datetime - begin_time).total_seconds()
            # 每秒钟0.1元，设置最小消费为0.1元
            cost = max(delta * 0.1, 0.1)
            cursor.execute("UPDATE record SET price=\"%s\" WHERE user_id=\"%s\" AND book_id=\"%s\" AND price=0 ORDER BY record_id DESC LIMIT 1;" % (cost, user_id, book_id))
            db.commit()
            cursor.execute("SELECT money FROM user WHERE user_id=\"%s\";" % user_id)
            db.commit()
            user = cursor.fetchone()
            if not user:
                res["message"] = "用户不存在"
                return jsonify(res)
            new_money = user[0] - cost
            # =====================将非常小的负数近似为零====================
            if abs(new_money) < 1e-9:
               new_money = 0.0
            cursor.execute("UPDATE user SET money=\"%s\" WHERE user_id=\"%s\";" % (new_money, user_id))
            db.commit()
            res["success"] = True
            res["message"] = "结束阅读成功"
            res["cost"] = cost
            
            res["new_money"] = new_money
        except Exception as e:
            res["message"] = str(e)
        finally:
            db.close()
    return jsonify(res)



# #停止阅读
# # userId bookId money(用户余额) price(书籍阅读单价)
# @app.route("/read/end",methods=["POST"])
# def stopRead():
#     res = False
#     print("正在访问停止阅读接口")
    
#     db = pymysql.connect(host='localhost', user='root', password='yunx', port=3306, db='online_library')
#     cursor=db.cursor()
    
#     bookId=str(request.form.get("bookId"))
#     userId=str(request.form.get("userId"))
#     money=float(request.form.get("money"))
#     price=float(request.form.get("price"))

#     now = datetime.now()
#     end_time = now.strftime("%Y-%m-%d %H:%M:%S")

#     record=cursor.execute("select record_id,start_time from record where book_id=\"%s\" and use_id=\"%s\" and end_time=null"%(bookId,userId))
#     db.commit()
#     result=cursor.fetchall()
    
#     #===================================
#     print("start_time")
#     print(result["start_time"])
#     #===================================
#     begin_time=result["start_time"]
#     record_id=result["record_id"]
#     # 将字符串转为 datetime 对象
#     begin_time = datetime.strptime(begin_time, "%Y-%m-%d %H:%M:%S")
#     end_time = datetime.strptime(end_time, "%Y-%m-%d %H:%M:%S")
    
#     delta = (end_time - begin_time).total_seconds()
#     cost = delta * price
#     if money >= cost:
#         #补充阅读记录表
#         cursor.execute("update record set end_time=\"%s\" ,price=\"\" where record_id = \"%s\";"%(datetime.now().strftime("%Y-%m-%d %H:%M:%S"),cost,record_id))
#         db.commit();
        
#         #修改余额
#         cursor.execute("update user set money=\"%s\" where user_id=\"%s\";"%(money-cost,userId));
#         db.commit();
        
#         res = True
    
#     return jsonify(res);




if __name__=="__main__":
    
    app.run(host="0.0.0.0",port=8442)
    
        