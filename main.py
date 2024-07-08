from website import create_app #first selects the folder called website. __init__.py being inside website folder, it will automatically present the functions inside it.
#one of these functions being create_app. Thus there is no need to do something like "from website, in __init__.py, import create_app"

app = create_app() #assign the return value of create_app to a local variable we can work with

if __name__ == '__main__': #only runs server ONLY if you run this file directly. - ask Toby what specifies __main__
    app.run(debug=True)

    #app.run(host='0.0.0.0', port=5000, debug=False)
