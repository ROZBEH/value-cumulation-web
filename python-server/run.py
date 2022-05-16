from flask import Flask  # Import flask

app = Flask(__name__)  # Setup the flask app by creating an instance of Flask

@app.route('/')  # When someone goes to / on the server, execute the following function
def home():
	# return '<h1>Hello World!</h1>'  # Return the string 'Hello World!'
	return app.send_static_file('index.html')

if __name__ == '__main__':  # If the script that was run is this script (we have not been imported)
	app.run(debug=True)  # Start the server
