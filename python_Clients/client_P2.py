import socketio
import json

sio = socketio.Client()

def workHandler(input_data):
	story_list = input_data["input"]
	for i in story_list:
		for j in i:
			print("--->",j)
		print("--")
	sio.sleep(30);
	sio.emit('phase-2-server-to-main-server',{"client": input_data["client"], "procedureNo": input_data["procedureNo"], "status": "COMPLETED", "output": json.dumps(story_list)})

@sio.on('main-server-to-phase-2-server')
def on_phaseOneData(data):
	print("RECEIVED DATA : {}".format(data))
	sio.start_background_task(workHandler, data)
	sio.emit('phase-2-server-to-main-server',{"client": data["client"], "procedureNo": data["procedureNo"], "status": "STARTED", "output": json.dumps([["None"]])})

sio.connect('http://localhost:3000')
sio.emit('server-ready',{"phase": 2})