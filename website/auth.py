from flask import Blueprint, Flask, request, make_response, render_template #fusion this with whatever .py doc's pre-existing flask import list you shove this thing into.
import sqlalchemy
from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth", __name__) #required to be exported and registered as blueprint.
db = sqlalchemy.create_engine("mariadb+mariadbconnector://root:@127.0.0.1:3306/final project")

#REGISTRATION FOR USER
@auth_bp.post("/registeruser")
def registeruser():
    with db.begin() as conn:
        try:
            res = conn.execute(text("INSERT INTO user (email, password, created_at, latest_login, name) VALUES (:email, :password, NOW(), NOW(), :name)"), {
                "email": request.form.get("email"),
                "password": generate_password_hash(request.form.get("password")),
                "name": request.form.get("name")
            })
            if res:
                return "GOOD"
        except:
            return "BAD"


#REGISTRATION FOR ADMIN (NOT NEEDED DUE TO SECURITY REASONS)
# @app.post("/registeradmin")
# def registeradmin():
#     with db.begin() as conn:
#             try:
#                 res = conn.execute(text("INSERT INTO admin (email, password, created_at, name) VALUES (:email, :password, NOW(), :name)"), {
#                 "email": request.form.get("email"),
#                 "password": generate_password_hash(request.form.get("password")),
#                 "name": request.form.get("name")
#                 })
#                 if res:
#                     return "GOOD"
#             except:
#                 return "BAD"
            
#USER LOG-IN
@auth_bp.post("/userlogin")
def userlogin():
    email = request.form.get("email")
    password = request.form.get("password")
    with db.begin() as conn:
        login = conn.execute(text("SELECT * FROM user WHERE email=:email"),{
            "email": email
        })
        for info in login:
            if check_password_hash(info.password,password):
                conn.execute(text("UPDATE user SET latest_login=NOW(), logged_in=1 WHERE email=:email"), {
                    "email": email
                })
                return {"id": info.user_id, "email": info.email, "name": info.name
                        }
            else: return "BAD"
            
        

#ADMIN LOG-IN
@auth_bp.post("/adminlogin")
def adminlogin():
        email = request.form.get("email")
        password = request.form.get("password")
        with db.begin() as conn:
            login = conn.execute(text("SELECT admin_id, email, password, name FROM admin WHERE email=:email"), {
                "email": email
            })
            for info in login:
                if check_password_hash(info.password,password):
                    conn.execute(text("UPDATE admin SET logged_in=1 WHERE email=:email"), {
                        "email": email
                    })    
                    return {"admin_id": info.admin_id, "email": info.email, "name": info.name}
            else:
                return "BAD"
            
#USER LOGOUT
@auth_bp.post("/userlogout")
def userlogout():
    with db.begin() as conn:
        conn.execute(text("UPDATE user SET logged_in = 0 WHERE user_id=:user_id"),{
            "user_id": request.json.get("user_id")
        })
        return "GOOD"
    
@auth_bp.post("/adminlogout")
def adminlogout():
    with db.begin() as conn:
        conn.execute(text("UPDATE admin SET logged_in = 0 WHERE admin_id = :admin_id"), {
            "admin_id": request.json.get("admin_id")
        })
        return "GOOD"


#cookie and sessions testing ground. Remove
""" 
userLogin = "testAccount"

@auth_bp.route("/secure_cookie_call", methods=["GET", "POST"])
def cookie_generator():
    if request.method == "POST":
        local_email = request.form["email"], #or whatever the Front_end decides on
        local_name = user_full_name[0], #temporary.
        output_msg = f"Welcome, {local_username}!" #⚠️where do we get and store local_username??
        res = make_response('setting up login creds for user')
        res.set_cookie("login_email",local_email) #key should be from the "name=" field of the input.
    return res

@auth_bp.route("/get_cookie")
def cookie_get():
    res_auth = request.cookies.get("login")
    return res_auth 
"""