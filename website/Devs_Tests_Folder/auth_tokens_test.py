from flask import Flask, make_response, Blueprint, request, jsonify
from datetime import datetime
import secrets

cookie_bp = Blueprint("cookie", __name__)


#temp, replace @cookie_bp with @auth_bp
@cookie_bp.route("/secureCookieFetch", methods=["POST"])
def cookie_grab(): #obsolete? only be fetched through login anyways





#OVERWRITES SOME AUTH-RELATED FUNCTIONS, COORDINATE WITH JAY
         
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
                user_token = secrets.token_urlsafe(16) #☢️16 char token is generated for quick user ID
                conn.execute(text("UPDATE user SET latest_login=NOW(), logged_in=1 WHERE email=:email"), {
                    "email": email,
                })

                conn.execute(text(f"INSERT INTO tokens SET created_at=NOW(), last_accessed=NOW(), expiration_date=(NOW(), INTERVAL 3 DAY), token=:token_create, user_id=:ref_id_create"), {
                    "token_create": user_token,
                    "ref_id_create": info.user_id,
                }) #☢️token storage process
                
                response = make_response(jsonify({"confirmation" : "user token validated, access granted!", "email": info.email, "name": info.name}))
                response.set_cookie(
                        'session_token',
                        user_token,
                        httponly=True,
                        secure=True,
                        samesite='Strict'
                    ) #☢️on top of the usual package, added session_token and confirmation message.

                return response
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
                    admin_token = secrets.token_urlsafe(24) #☢️24 char token is generated for quick admin ID
                    conn.execute(text("UPDATE admin SET logged_in=1 WHERE email=:email"), {
                        "email": email,
                    })

                    conn.execute(text(f"INSERT INTO tokens SET created_at=NOW(), last_accessed=NOW(), expiration_date=(NOW(), INTERVAL 10 DAY), token=:token_create, admin_id=:ref_id_create"), {
                        "token_create": admin_token,
                        "ref_id_create": info.admin_id,
                    }) #☢️token storage process
                    

                    return {"admin_id": info.admin_id, "email": info.email, "name": info.name}
            else:
                return "BAD"
            

#Session restore through token identification
@auth_bp.route("/secure_token_req", methods=["POST"]) #method has to be GET to get the HTTPS headers.
def secure_cookie(): #can be used to RESTORE a pertinent session. This is user only. Admin should get a separate route.
    user_token = request.headers.get('Authorization', None) #JS-side, it should look like: method: GET, headers: {'Authorization': `Bearer ${token}`}
    #email = request.json.get("email")
    if user_token and user_token.startswith('Bearer '):
        token_trim = user_token.split('Bearer ')[1]
        print("!!result of token_trim: ", token_trim)
        with db.begin() as conn:         
            try:
                token_check = conn.execute(text("SELECT user_id FROM tokens WHERE token=:user_token"),{
                    "user_token": token_trim
                })
                print("!!result of token_check: ", token_check)
                if token_check:
                    login = conn.execute(text("SELECT * FROM user WHERE id=:foreign_id"),{
                         "foreign_id": token_check
                    })#⚠️was the table user, or users?
                    #⚙️keep working, slave!
                    #☢️get the token and compare it to token table. then grab the token's foreign key and log him automatically using data.
                    response = {"message" : "user token validated, access granted!", "email": login.email, "name": login.name, "widgetYoutube": login.youtube, "widgetSpotify": login.spotify, "widgetCalendar": login.calendar, "widgetWeather": login.weather, "widgetTasklist": login.tasklist}#⚙️list for settings can expand.
                    return response #☢️We are accessing 2 tables here, first the token table to grab the foreign key of user_id, then use user_id to identify the user and bring back the info.
            except: 
                 return {"error" : "token data not found or expired"}, 402 
    else:
        return {"error" : "received token invalid or non-existent, manual retry from client side requested"}, 405
    
#Sessions through Cookies explanation:
# When a user logs in through route /userLogin, back-end sends an additional piece of information on top of the usual data: a randomly generated, 16 character-long "token".
# This token should be received and held onto by front-end as a cookie. But also a copy of this token is sent to DB to a new table for 10 days, with the user's id as foreign key.
# On future app start-up, Front-end should request a fetch for "/secure_token_req in POST method, with an additional object in its headers: {"Authorization": "Bearer <TOKEN>"}
# if token matches, send to front-end a package that will allow to log the user automatically and restore all his settings.
# if token does not match or does not exist (for example, it expired in the DB), force user to log back in manually.
# This will create session permanence for users. 

# Additionally, cookies can be used by temporary users to store their settings, being able to set and use the clock and restore its state even if they reopen the tab.


