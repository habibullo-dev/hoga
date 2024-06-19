//⚠️Untested - 6/19/2024

let widgetSettingsBulk = {} //cram all the K/V pairs for each widget settings into this.
/* name for each setting keys: 
spotify_setting
youtube_setting
calendar_setting
clock_setting
weather_setting
tasklist_setting
mood_setting
*/

//retrieving settings from widgetSettingsBulk for individual widgets, example:
if (widgetSettingsBulk.spotify_setting){
    //spotifyWidgetSize = widgetSettingsBulk.spotify_setting.size
}


//⚠️Create loading wheel pop-up, EX: loadingPopUp.style.display = "block"
localStorage.hogaWidgetData = widgetSettingsBulk //store settings in local machine for future quick access. turns into string
let _fetcher = await fetch("/widget_all_settings", {
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




