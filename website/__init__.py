from flask import Flask

def create_app(): #function that "creates" the app itself, and all its content.
    app = Flask(__name__) #app instance variable name
    app.config['SECRET_KEY'] = 'DXM-prod weioqtj450ORi00A' #Session and cookies encryptor. the string assigned can be anything you want, but must be kept SECRET outside of core dev team.

    #after bp has been set for all the .py files, we can import them here, with the "from .filename import bpname"
    from .views import views_bp
    from .auth import auth_bp
    from .module_pomodoro import timer_bp
    from .widget_settings import settings_all_bp

    #then register them after import.
    app.register_blueprint(views_bp, url_prefix='/')
    app.register_blueprint(auth_bp, url_prefix='/') #prefixing within the address bar/url info to show a certain string. Leave blank if you dont want.
    app.register_blueprint(timer_bp, url_prefix='/')
    app.register_blueprint(settings_all_bp, url_prefix='/')
    
    return app