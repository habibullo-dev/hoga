from flask import jsonify, request, render_template, session, make_response, Blueprint
from datetime import datetime, timedelta, timezone
from time import time
import json
import sqlalchemy
from sqlalchemy import text
db = sqlalchemy.create_engine("mariadb+mariadbconnector://root:@127.0.0.1:3306/final project")

calendar_bp = Blueprint('calendar_bp', __name__)

@calendar_bp.route("/sendUserCalendar", methods = ["POST"]) #send calendar information to the user on start-up for login check and calendar populating.
def user_calendar():
    res_email = request.json.get("email", "")
    with db.begin() as conn:
        try: 
            exec = conn.execute(text("SELECT calendar_date FROM user WHERE email=:email"),{ #⚠️change to select only the calendar-related data.
                "email": res_email
            }).fetchone()
            return exec["calendar_date"] if exec["calendar_date"] else {"warning" : "no dates found in user calendar"}, 1706       
        except:
            return {"error" : "calendar info based on user email not found"}, 1704 #code 1700-1799 for calendar related errors
        

@calendar_bp.route("/loginPing", methods = ["POST"]) #grabs the login ping, extracts the user-related timeline from DB, stores the new ping in the timeline, then returns it to DB
def receive_user_login_ping():
    res_email = request.json.get("email", "")
    ts_now_ping = datetime.now(timezone.utc)
    with db.begin() as conn:
        try:
            exec1 = conn.execute(text("SELECT calendar_date FROM user WHERE email=:email"),{ #⚠️change to select only the calendar-related data.
                "email": res_email
            }).fetchone()
            exec1 = json.loads(exec1["calendar_date"])
            exec1.append(ts_now_ping)
        except:
            return {"error" : "problem fetching email and converting calendar information"}, 1710
        try: 
            exec2 = conn.execute(text("UPDATE user SET calendar_date=:user_calendar_updt  WHERE email=:email"),{
                "email": res_email,
                "user_calendar_updt": exec1
            })
            return {"message" : "successfully updated db calendar information"}
        except:
            return {"error" : "issue updating calendar information for user"}, 1708

