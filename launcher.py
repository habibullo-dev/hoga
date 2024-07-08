import subprocess
import webbrowser

def start_flask():
    # Start Flask server using subprocess
    subprocess.Popen(['python', 'main.py'])

def open_browser():
    # Open browser to Flask app URL
    webbrowser.open('http://localhost:5000')  # Adjust URL/port as needed

if __name__ == '__main__':
    start_flask()
    open_browser()