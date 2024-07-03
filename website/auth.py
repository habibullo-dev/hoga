from flask import Blueprint, Flask, request, make_response, render_template, jsonify, redirect, url_for, flash #fusion this with whatever .py doc's pre-existing flask import list you shove this thing into.
import sqlalchemy
from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash
from email_validator import validate_email, EmailNotValidError
import random
import string
import secrets
import smtplib
from getpass import getpass
from email.mime.text import MIMEText    
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import secrets
import google.generativeai as genai
import os

auth_bp = Blueprint("auth", __name__) #required to be exported and registered as blueprint.
db = sqlalchemy.create_engine("mariadb+mariadbconnector://root:@127.0.0.1/final project")

#SUPPOSED TO HIDE THE PASSWORD - SAME AS input() but safer
# password = getpass("Input the password for hogadashboard@gmail.com")

#CONNECTING TO OUR BUSINESS EMAIL
smtp_obj = smtplib.SMTP('smtp.gmail.com')
smtp_obj.ehlo()
smtp_obj.starttls()
smtp_obj.login("hogadashboard@gmail.com", "zpos ucbu bcep litr") #can use the variable password instead of the actual password

#GEMINI RELATED CONTENT
os.environ["API_KEY"] = "AIzaSyAWSgpgHCZ-LyCPGTkvvX_OBP1H9RSEDhI"
api_key = os.environ["API_KEY"]
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")

@auth_bp.post("/geminicall")
def geminicall():
    response = model.generate_content(request.json.get("question"))
    return(response.text)

#CLICK TO SAVE USER SETTINGS
@auth_bp.post("/savesettings")
def savesettings():
    with db.begin() as conn:
        res = conn.execute(text("UPDATE user SET youtube = :youtube, spotify = :spotify, calendar_setting = :calendar_setting, calendar_date = :calendar_date, clock_setting = :clock_setting, weather = :weather, tasklist_setting = :tasklist_setting, tasklist_list = :tasklist_list WHERE email = :email"), {
            "youtube": request.json.get("youtube"),
            "spotify": request.json.get("spotify"),
            "calendar_setting": request.json.get("calendar_setting"),
            "calendar_date": request.json.get("calendar_date"),
            "clock_setting": request.json.get("clock_setting"),
            "weather": request.json.get("weather"),
            "tasklist_setting": request.json.get("tasklist_setting"),
            "tasklist_list": request.json.get("tasklist_list"),
            "email": request.json.get("email")
        })
#RENDER TEMPLATE FOR REGISTRATION
@auth_bp.get("/register")
def register():
    return render_template("register.html")

#REGISTRATION FOR USER
@auth_bp.post("/registeruser")
def registeruser():
    email = (request.form.get("email")).lower()
    try: 
        #CHECKS IF EMAIL IS USING VALID EMAIL FORMAT / SECURE EMAIL (DOESN'T CHECK IF EMAIL IS VALID)
        emailinfo = validate_email(email, check_deliverability=True)
        email = emailinfo.normalized
        #CREATING RANDOM CHARACTER TO VALIDATE USER'S EMAIL
        rand_hash = str("".join(secrets.choice(string.ascii_letters + string.digits) for x in range(20)))
        with db.begin() as conn:
            res = conn.execute(text("INSERT INTO user (email, password, created_at, latest_login, name, hash) VALUES (:email, :password, NOW(), NOW(), :name, :hash)"), {
                "email": email,
                "password": generate_password_hash(request.form.get("password")),
                "name": request.form.get("name"),
                "hash": rand_hash
            })
            if res:
                created_acct = conn.execute(text("SELECT email, name, hash FROM user WHERE email = :email"), {
                    "email": email
                })
                for acct in created_acct:
                    #EMAIL CONTENT <CHANGE SUBJECT / MESSAGE BODY IF NEEDED>
                    from_address = "hogadashboard@gmail.com"
                    to_address = acct.email
                    subject = "Please verify your account " + acct.name
                    message_body = f"""<body>
                    Thank you for registering an account with Hoga.
                    Please click <a href='http://127.0.0.1:5000/activate/{acct.hash}'>here</a> to activate your account.
                    </body>"""

                    msg = MIMEMultipart()
                    msg['From'] = from_address
                    msg['To'] = to_address
                    msg['Subject'] = subject

                    message = MIMEText(message_body, 'html')
                    msg.attach(message)

                    smtp_obj.sendmail(from_address, to_address, msg.as_string())
                return {"message": "Registration success"}
    #IF EMAIL IS NOT CORRECT FORMAT / UNSECURE
    except EmailNotValidError as e:
        return f"{'error':str(e)}"
    #EMAIL EXISTS IN DATABASE
    except:
        return {"error": "Account already exists"}
    
#ACTIVATE USER
@auth_bp.get("/activate/<hash>")
def activate(hash):
    with db.begin() as conn:
        res = conn.execute(text("UPDATE user SET user_activated = 1 WHERE hash = :hash"), {
            "hash": hash
        })
        if res:
            return {"message": "user's account has been activated"}


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
    try:
        email = (request.form.get("email")).lower()
        password = request.form.get("password")
        with db.begin() as conn:
            login = conn.execute(text("SELECT * FROM user WHERE email=:email"),{
                "email": email
            })
            for acct in login:
                if check_password_hash(acct.password,password) and (acct.user_activated == 1):
                    user_token = secrets.token_urlsafe(16) #☢️16 char token is generated for quick user ID
                    conn.execute(text("UPDATE user SET latest_login=NOW(), logged_in=1 WHERE email=:email"), {
                        "email": email
                    })
                    conn.execute(text(f"INSERT INTO tokens (created_at, last_accessed, expiration_date, token, user_id) VALUES (NOW(), NOW(), NOW() + INTERVAL 3 DAY, :token_create, :ref_id_create)"), {
                        "token_create": user_token,
                        "ref_id_create": acct.user_id,
                    }) #☢️token storage process
                    response = make_response(jsonify({"confirmation" : "user token validated, access granted!", "email": acct.email, "name": acct.name}))
                    bring_user_settings(acct, response)
                    response.set_cookie(
                            'session_token', #☢️specification for front-end to recognize this as a session token
                            user_token, #☢️token itself
                            httponly=True, 
                            secure=True,
                            samesite='Strict', #only usable in this site
                            expires= datetime.now() + timedelta(days=10) #☢️expiration
                        ) #☢️on top of the usual package, added session_token and confirmation message.
                    return response
                    #return {"email": info.email, "name": info.name} #🚧⚠️added to response var, see above
                elif check_password_hash(acct.password,password) and (acct.user_activated == 0):
                    conn.execute(text("UPDATE user SET hash = :hash WHERE email = :email"), {
                        "hash": str("".join(secrets.choice(string.ascii_letters + string.digits) for x in range(20))),
                        "email": acct.email
                    })

                    res = conn.execute(text("SELECT email, name, hash FROM user WHERE email = :email"), {
                        'email': acct.email
                    })

                    for act in res:
                        from_address = "hogadashboard@gmail.com"
                        to_address = act.email
                        subject = "Please verify your account " + act.name
                        message_body = f"""<body>
                        Thank you for registering an account with Hoga.
                        Please click <a href='http://127.0.0.1:5000/activate/{act.hash}'>here</a> to activate your account.
                        </body>"""

                        msg = MIMEMultipart()
                        msg['From'] = from_address
                        msg['To'] = to_address
                        msg['Subject'] = subject

                        message = MIMEText(message_body, 'html')
                        msg.attach(message)

                        smtp_obj.sendmail(from_address, to_address, msg.as_string())
                    return {"message": "email sent to activate user's account"}
                else: return {"error": "user inputted wrong email or password"}
        return {"error": "user inputted wrong email or password"}
    except:
        return {"error": "user inputted wrong email or password"}
    
#Jinja template for Admin login
@auth_bp.get("/admin")
def admin():
    return render_template("admin.html")

#ADMIN LOG-IN
@auth_bp.route("/adminlogin", methods=["GET", "POST"])
def adminlogin():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        with db.begin() as conn:
            login = conn.execute(text("SELECT email, name FROM admin WHERE email=:email AND password=:password"), {
                "email": email,
                "password": password
            })
            conn.execute(text("UPDATE admin SET logged_in = 1 WHERE email = :email"),{
                "email": email
            })
            for info in login:
                if info:
                    total_users_data = conn.execute(text("SELECT COUNT(*) AS count FROM user WHERE user_activated = 1"))
                    total_online_data = conn.execute(text("SELECT COUNT(*) AS count FROM user WHERE logged_in = 1"))
                    revenue_users_data = conn.execute(text("SELECT COUNT(*) AS count FROM user WHERE user_activated = 1"))
                    revenue_per_user = 10
                    for user in revenue_users_data:
                        total_revenue = user.count * revenue_per_user
                    return render_template("admindashboard.html", info=info, total_users_data = total_users_data, total_online_data = total_online_data, total_revenue = total_revenue)
            else:
                error_msg = {"message":"Incorrect username or password"}
                return render_template("admin.html", error_msg=error_msg)
    else:
        return render_template("admin.html")
    
#PATH TO FETCH DATA TO CREATE LINE GRAPH
@auth_bp.get("/createlinegraph")
def createlinegraph():
    with db.begin() as conn:
        conn.execute()

#PASSWORD RECOVERY FOR USER

@auth_bp.get("/passwordrecovery/<hash>")
def passwordrecover(hash):
    #input needs to be hidden to complete form
    #CAN return object for static html file or render_template for Jinja templates
    return render_template("websitename.html", hash=hash)

@auth_bp.post("/resetpassword")
def resetpassword():
    try:
        with db.begin() as conn:
            res = conn.execute(text("UPDATE user SET password = :password WHERE hash = :hash"), {
                "password": generate_password_hash(request.form.get("password")),
                "hash": request.form.get("hash")
            })
            return {"message": "password has been reset"}
    except: return {"error": "too much time has passed. user needs to reset password again"}
            
#USER LOGOUT
@auth_bp.post("/userlogout")
def userlogout():
    held_id = request.json.get("user_id")
    with db.begin() as conn:
        conn.execute(text("UPDATE user SET logged_in = 0 WHERE user_id=:user_id"),{
            "user_id": held_id
        })
        conn.execute(text("DELETE FROM tokens WHERE user_id=:foreign_key;"),{
            "foreign_key": held_id #database token deletion
        })
        return {"message": "user has been logged out"}

#ADMIN LOGOUT    
@auth_bp.post("/adminlogout")
def adminlogout():
    with db.begin() as conn:
        conn.execute(text("UPDATE admin SET logged_in = 0 WHERE email = :email"), {
            "email": request.json.get("email")
        })
        return redirect(url_for("auth.admin"))
    
#LANDING PAGE
@auth_bp.get("/landingpage")
def landingpage():
    return render_template("landing.html")
    
    
#Session restore through token identification
@auth_bp.route("/secure_token_req", methods=["POST"]) 
def secure_cookie(): #can be used to RESTORE a pertinent session. This is user only. Admin should get a separate route.
    session_token = request.cookies.get('session_token')
    #email = request.json.get("email")
    if session_token:
        print(f"!!result of session_token: {session_token}")
        with db.begin() as conn:         
            try:
                token_check = conn.execute(text("SELECT user_id FROM tokens WHERE token=:user_token"),{
                    "user_token": session_token
                }).fetchone()
                print("!!result of token_check:",(token_check[0]))
                for item in token_check:
                    if item:
                        login = conn.execute(text("SELECT * FROM user WHERE user_id=:foreign_id"),{
                            "foreign_id": item
                        })#⚠️was the table user, or users?
                        #⚙️keep working, slave!
                        #☢️get the token and compare it to token table. then grab the token's foreign key and log him automatically using data.
                    for item in login:
                        if item:
                            print("ITEM", item)
                            res = {"message":"user token validated, access granted!", "email": item.email, "name": item.name}
                            bring_user_settings(item, res)
                            # IF VALUES ARE NOT PRESENT IN KEYS - ERROR 404 WILL BE TRIGGERED
                            # response =  {"message" : "user token validated, access granted!", "email": item.email, "name": item.name, "password": item.password, "widgetYoutube": item.youtube, "widgetSpotify": item.spotify, "widgetCalendar": item.calendar, "widgetWeather": item.weather, "widgetTasklist": item.tasklist}#⚙️list for settings can expand.
                            print("JSON RESPONSE", res)
                            return res #☢️We are accessing 2 tables here, first the token table to grab the foreign key of user_id, then use user_id to identify the user and bring back the info.
                    else:
                        return {"error" : "user login and settings information invalid"}, 403
            except: 
                 return {"error" : "token data not found or expired"}, 404
    return {"error" : "received token invalid or non-existent, manual retry from client side requested"}, 405


def bring_user_settings(_item, _res):
    #🚧take the entire response from DB, trim out confidential information, and send the settings. 
    #This way even if columns for settings are added, we dont need to manually add them to this endpoint each time.
    try:
        _item.pop("created_at", "")
        _item.pop("email", "")
        _item.pop("name", "")
        _item.pop("password", "")
        _item.pop("user_id", "")
        _item.pop("logged_in", "")
        _item.pop("user_activated", "")
        _item.pop("hash", "")
        _item.pop("hash_expiration", "")
        _item.pop("latest_login", "")
        _res.update(_item) #🚧merge trimmed response with only settings, to the main response.
    except: 
        print("error trimming settings object. cancelling process.")

#Sessions through Cookies explanation:
# When a user logs in through route /userLogin, back-end sends an additional piece of information on top of the usual data: a randomly generated, 16 character-long "token".
# This token should be received and held onto by front-end as a cookie. But also a copy of this token is sent to DB to a new table for 10 days, with the user's id as foreign key.
# On future app start-up, Front-end should request a fetch for "/secure_token_req in POST method, with an additional object in its headers: {"Authorization": "Bearer <TOKEN>"}
# if token matches, send to front-end a package that will allow to log the user automatically and restore all his settings.
# if token does not match or does not exist (for example, it expired in the DB), force user to log back in manually.
# This will create session permanence for users. 

# Additionally, cookies can be used by temporary users to store their settings, being able to set and use the clock and restore its state even if they reopen the tab.