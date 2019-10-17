#!/usr/bin/env python

import os, time
from flask import Flask, render_template, redirect, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)
rooms = ['general']
messages = {}

@app.route("/")
def index():
    return render_template("login.html")

@app.route("/chat")
def chat():
	return render_template("chat.html", rooms=rooms)

@app.route("/cnroom", methods=["POST"])
def cnroom():
	if request.form.get("room_name") not in rooms:
		rooms.append(request.form.get("room_name"))
	# redirect("/chat")

@socketio.on("incoming_msg")
def incoming_msg(data):
	time_stamp = time.strftime('%b-%d %I:%M%p', time.localtime())
	tup = {"username": data["username"], "msg": data["msg"], "time_stamp": time_stamp, 
		"room":data["room"]}
	# tup = (data["username"], data["msg"], time_stamp)
	messages.setdefault(data["room"], []).append(tup)
	messages[data["room"]] = messages[data["room"]][-95:]
	emit("message", tup, broadcast=True)	

@socketio.on("room_joined")
def room_joined(data):
	emit("cur_messages", messages[data["room"]], broadcast=False)

if __name__ == '__main__':
	socketio.run(app)