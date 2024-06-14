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
                return "GOOD" #🚧return somth like "message":"DB reg success"
        except:
            return "BAD" #🚧Might be good practice if we can catch specific errors (such as 1 for email already existing or 1 for some bug the DB might spit out)


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
        }) #🚧try.catch if email does not exist in DB
        for info in login:
            if check_password_hash(info.password,password):
                conn.execute(text("UPDATE user SET latest_login=NOW(), logged_in=1 WHERE email=:email"), {
                    "email": email
                })
                return {"id": info.user_id, "email": info.email, "name": info.name #🚧is returning the DB-related ID to front-end necessary?
                        }
            else: return "BAD" #🚧return an error indicating that password does not match
            
        

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
                    return {"admin_id": info.admin_id, "email": info.email, "name": info.name} #🚧should DB admin_id be returned to front-end?
            else:  #🚧in the return above, could you add another key/value pair in the list? something like "admin_log_chk": info.admin_id. This could be used by super-admins or other members of the admin team to detect a specific member logging in from X location.             
                return "BAD" #🚧return an error indicating that password does not match
            
#USER LOGOUT
@auth_bp.post("/userlogout")
def userlogout():
    with db.begin() as conn:
        conn.execute(text("UPDATE user SET logged_in = 0 WHERE user_id=:user_id"),{
            "user_id": request.json.get("user_id") 
        })
        return "GOOD" #🚧for future feature purpose, could you return a "message" : "destroyInstance" ?
    
@auth_bp.post("/adminlogout")
def adminlogout():
    with db.begin() as conn:
        conn.execute(text("UPDATE admin SET logged_in = 0 WHERE admin_id = :admin_id"), {
            "admin_id": request.json.get("admin_id")
        })
        return "GOOD" #🚧for future feature purpose, could you return a "message" : "destroyInstance" ?

#Great job on the DB endpoints!!!! You whipped it up so quick


#additional auth-checking def idea below:


@auth_bp.post("/pingSendActive") #front-end should send a signal package every 30 (CONFIGURABLE) minutes  or so to check if user is still in the app (he has a HOGA tab open). If no second confirm, automatically log out.
def check_if_hoga_running():
    res1 = request.json.get("activePing", False) #fetch trigger 
    res2 = request.json.get("isSpecialLogin", False) #in case the logged user is considered an admin or a specific type of user such as one who needs extra accessibility options
    if res1 == False and res2 == False:
        userlogout() #not sure if we can manually trigger a function that was defined with a "POST" decorator, will need to be tested.
    #for security concerns, might be good to auto-log out admin accounts in a different manner than normal users (such as log out automatically if HOGA tab is closed). What do you think of this idea?



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