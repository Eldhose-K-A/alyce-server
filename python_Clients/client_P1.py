import socketio
import json

sio = socketio.Client()

def workHandler(input_data):
	output_data = [[y.strip() for y in x.split("$")] for x in input_data["input"].split("#")]
	sio.sleep(30);
	sio.emit('phase-1-server-to-main-server',{"client": input_data["client"], "procedureNo": input_data["procedureNo"], "status": "COMPLETED", "output": json.dumps(output_data)})

@sio.on('main-server-to-phase-1-server')
def on_phaseOneData(data):
	print("RECEIVED DATA : {}".format(data))
	sio.start_background_task(workHandler, data)
	sio.emit('phase-1-server-to-main-server',{"client": data["client"], "procedureNo": data["procedureNo"], "status": "STARTED", "output": json.dumps([["None"]])})

sio.connect('http://localhost:3000')
sio.emit('server-ready',{"phase": 1})