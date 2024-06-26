//⚠️Untested - 6/19/2024



        


//let widgetSettingsBulk = {} //cram all the K/V pairs for each widget settings into this.
/* name for each setting keys: 
spotify_setting
gemini_setting
youtube_setting
calendar_setting
clock_setting
weather_setting
tasklist_setting
mood_setting
*/

function autoLogin(){
    try {
        return fetch("/secure_token_req", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(res => {
                try {
                document.querySelector("h1").innerHTML = `${res.email} - Welcome, ${res.name}`
                console.log(res["message"])
                user.email = res["email"]
                user.name = res["name"]
                delete res["message"]
                delete res["name"]
                delete res["email"]
                dbSettingsBulk = res
                } catch {(error) => {
                    console.log("autologin failed: ", error);
                    suggestLogin(); //⚠️WIP function does not exist
                }}
        }).catch(error=>console.error('Mainline error fetching or parsing data:', error))
    } catch {(error) => {
        console.log("Mainline error connecting to database: ", error)
        resolve();
    }}
}



async function saveSettings(){
    //⚠️Create loading wheel pop-up, EX: loadingPopUp.style.display = "block"
    localStorage.setItem("hogaWidgetData", JSON.stringify(widgetSettingsBulk)) //store settings in local machine for future quick access. turns into string
    await fetch("/widget_all_settings", {
        method: "POST",
        body: JSON.stringify({
            userEmail: local_email, //sending current session's email to back-end for identification
            allWidgetSettings: widgetSettingsBulk, //sending all the relevant settings (that have been changed since last time).
        }),
        headers:{
            'Content-Type': 'application/json'
            },
    })
    //⚠️Remove loading wheel pop-up, EX: loadingPopUp.style.display = "none"
}

// Function to distribute widget customization on load🚧
/* async function distribWidgetSettings(_settings){
    await new Promise(resolve => {
        document.addEventListener("DOMContentLoaded", resolve);
    });
    Object.keys(_settings).forEach((key)=>{
        console.log("Distributing widget settings!: ", key)
        createWidget(key)
    })
 } */

async function sessRegenTry(){
    //unpack whatever was fetched from DB
    if (localStorage.hogaWidgetData){
        widgetSettingsBulk = JSON.parse(localStorage.hogaWidgetData) //access local machine settings and store in var
        await distribWidgetSettings(widgetSettingsBulk) //⚠️⚠️⚠️WIP function. adds in all the settings to respective widgets. wait for Paolo ver.
        sessDBCompare() //at later date, compare.
        return
    }
    console.log("Local settings data not found. Resorting to database fetch") //if no local settings, grab from DB directly
    if (Object.getOwnPropertyNames(dbSettingsBulk).length === 0){
        await autoLogin();
    }
    widgetSettingsBulk = dbSettingsBulk
}



async function sessDBCompare(){
    await autoLogin();  
    if (widgetSettingsBulk){
        if (dbSettingsBulk){
            for (const key of Object.keys(dbSettingsBulk)){
                if (dbSettingsBulk[key] != widgetSettingsBulk[key]){
                    //⚠️RETURNS CALL TO ACTION FROM USER
                    //"SYNCRHONIZING SETTINGS"
                }   
            }
        }
        //if not, ignore.
        console.log("User settings are in sync.")
    }
}


/* 🚧WIP - Moved to login.html
function autoLogin(){
    return fetch("/secure_token_req", {method: "POST",
        body: JSON.stringify({"email":userEmail}), //🔴this wrong, browser doesnt even have cookies yet. check Jay's HTML.
        headers:{'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(res => {
        console.log(res["message"])
        user.email = res["email"]
        user.name = res["name"]
        delete res["message"]
        delete res["name"]
        delete res["email"]
        //🚧or better yet, use Jay's login process
        dbSettingsBulk = res
    })
} */

/* 🚧route ported from auth.py for reference
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
        print("error trimming settings object. cancelling process.") */

function onStartStrLine(){
    autoLogin()
    sessRegenTry()
    //startUpMark() //🚧deprecated
    //userClockSetup() //🚧deprecated
}
onStartStrLine();