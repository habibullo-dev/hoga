from flask import jsonify, request, render_template, session, make_response, Blueprint
import sqlalchemy
from sqlalchemy import text
import json

db = sqlalchemy.create_engine("mariadb+mariadbconnector://root:@127.0.0.1:3306/final project")

settings_all_bp = Blueprint("settings_save", __name__)




@settings_all_bp.post("/widget_all_settings")
def widgets_grab():
    email = request.json.get("userEmail", "") #identify which row to update according to email (unique key)
    bulk_widgets = request.json.get("allWidgetSettings", "")

    with db.begin() as conn:
        try:
            #Query 1 - spotify_setting ⚠️does not exist yet.
            if bulk_widgets["w-spotify"]:
                query1 = conn.execute(text("UPDATE user SET spotify=:user_spotify_setting WHERE email=:email"),{
                    "email": email,
                    "user_spotify_setting": json.dumps(bulk_widgets.get("w-spotify"))
                })
            else:
                print("No change in spotify API widget detected.")
                
            #Query 2 - youtube_setting ⚠️does not exist yet.
            if bulk_widgets["w-youtube"]:
                query2 = conn.execute(text("UPDATE user SET youtube=:user_yt_setting WHERE email=:email"),{
                    "email": email,
                    "user_yt_setting": json.dumps(bulk_widgets["w-youtube"])
                })
            else:
                print("No change in youtube API widget detected.")

            #Query 3 - calendar_setting
            if bulk_widgets["w-calendar"]:
                query3 = conn.execute(text("UPDATE user SET calendar_setting=:user_cal_setting WHERE email=:email"),{
                    "email": email,
                    "user_cal_setting": json.dumps(bulk_widgets["w-calendar"])
                })
            else:
                print("No change in calendar settings detected.")

            #Query 4 - clock_setting
            if bulk_widgets["w-timer"]:
                query4 = conn.execute(text("UPDATE user SET clock_setting=:user_clock_setting WHERE email=:email"),{
                    "email": email,
                    "user_clock_setting": json.dumps(bulk_widgets["w-timer"])
                })
            else:
                print("No change in clock setup detected")

            #Query 5 - weather_setting ⚠️does not exist yet.
            if bulk_widgets["w-weather"]:
                query5 = conn.execute(text("UPDATE user SET weather:user_weather_setting WHERE email=:email"),{
                    "email": email,
                    "user_weather_setting": json.dumps(bulk_widgets["w-weather"])
                })
            else:
                print("No change in weather widget detected")

            #Query 6 - tasklist_setting
            if bulk_widgets["w-tasks"]:
                query6 = conn.execute(text("UPDATE user SET tasklist_setting=:user_task_setting WHERE email=:email"),{
                    "email": email,
                    "user_task_setting": json.dumps(bulk_widgets["w-tasks"])
                })
            else:
                print("No change in user task list detected")

            #Query 7 - mood_setting ⚠️does not exist yet.
            if bulk_widgets["currentTheme"]:
                query7 = conn.execute(text("UPDATE user SET mood_setting=:user_mood_setting WHERE email=:email"),{
                    "email": email,
                    "user_mood_setting": json.dumps(bulk_widgets["currentTheme"])
                })
            else:
                print("No change in moods preferences detected")

            #Query 8 - Gemini_setting 
            if bulk_widgets["w-search"]:
                query8 = conn.execute(text("UPDATE user SET gemini=:gemini_setting WHERE email=:email"),{
                    "email": email,
                    "gemini_setting": json.dumps(bulk_widgets["w-search"])
                })
            else:
                print("No change in gemini setup detected")

            return {"message" : "user widget settings successfully saved!"}
        
        except:
            return {"error" : "total widget update or email assessment issue"}, 205
        

""" IMPORTANT

Outside of widget settings, need object permanence for:

Calendar,
Timer,
Tasks,
Spotify (maybe)

 """


