var socketio = require("socket.io");
var sharedsession = require("express-socket.io-session");

var socketEvents = (server, session) => {

    var clientList = new Set();
    var serverListPhaseI = new Set();
    var serverListPhaseII = new Set();
    var serverListPhaseIII = new Set();

    var io = socketio(server);
    io.use(sharedsession(session,{
        autoSave: true
    }));
    // Use 'socket.handshake.session' to access the session in socket like 'req.session'.

    io.on('connection',function(socket){
        console.info(`Socket ${socket.id} has connected.`);

        socket.on("client-ready",(data) =>{
            clientList.add(socket.id);
            console.info(`Socket ${socket.id} has been identified as a client!...`);
            io.emit("sub-servers-and-clients-status",{"clients": clientList.size, "P1_instances": serverListPhaseI.size, "P2_instances": serverListPhaseII.size, "P3_instances": serverListPhaseIII.size});
        });

        socket.on("server-ready",(data) =>{
            if(data.phase==undefined){
                console.log("A Server with no Phase Data Found!....");
                return;
            }
            if(data.phase==1)
                serverListPhaseI.add(socket.id);
            else if(data.phase==2)
                serverListPhaseII.add(socket.id);
            else if(data.phase==3)
                serverListPhaseIII.add(socket.id);
            console.info(`Socket ${socket.id} has been identified as a Server(Phase ${data.phase})!...`);
            io.emit("sub-servers-and-clients-status",{"clients": clientList.size, "P1_instances": serverListPhaseI.size, "P2_instances": serverListPhaseII.size, "P3_instances": serverListPhaseIII.size});
        });

        socket.on("disconnect", () => {
            if(serverListPhaseI.has(socket.id)){
                serverListPhaseI.delete(socket.id);
                console.info(`A Server of Phase 1 ${socket.id} has disconnected.`);
            }
            else if(serverListPhaseII.has(socket.id)){
                serverListPhaseII.delete(socket.id);
                console.info(`A Server of Phase 2 ${socket.id} has disconnected.`);
            }
            else if(serverListPhaseIII.has(socket.id)){
                serverListPhaseIII.delete(socket.id);
                console.info(`A Server of Phase 3 ${socket.id} has disconnected.`);
            }
            else if(clientList.has(socket.id)){
                clientList.delete(socket.id);
                console.info(`Client ${socket.id} has disconnected.`);
            }
            else{
                console.log("An Unknown Socket Disconnected!....");
            }
            io.emit("sub-servers-and-clients-status",{"clients": clientList.size, "P1_instances": serverListPhaseI.size, "P2_instances": serverListPhaseII.size, "P3_instances": serverListPhaseIII.size});
        });

        socket.on("client-to-server",function(data){
            if(data.phase==undefined || data.input==undefined){
                socket.emit("server-to-client",{"error": true, "errormsg": "Invalid Phase or Input!..."});
            }
            else if(data.phase==1){
                if(serverListPhaseI.size>0){
                    io.to(serverListPhaseI.values().next().value).emit("main-server-to-phase-1-server",{"client":socket.id, "input": data.input});
                }
                else{
                    socket.emit("server-to-client",{"error": true, "errormsg": "Server Side Error Phase 1 Sub Server is not reachable!..."});
                }
            }
            else if(data.phase==2){
                if(serverListPhaseII.size>0){
                    io.to(serverListPhaseII.values().next().value).emit("main-server-to-phase-2-server",{"client":socket.id, "input": data.input});
                }
                else{
                    socket.emit("server-to-client",{"error": true, "errormsg": "Server Side Error Phase 2 Sub Server is not reachable!..."});
                }
            }
            else if(data.phase==3){
                if(serverListPhaseIII.size>0){
                    io.to(serverListPhaseIII.values().next().value).emit("main-server-to-phase-3-server",{"client":socket.id, "input": data.input});
                }
                else{
                    socket.emit("server-to-client",{"error": true, "errormsg": "Server Side Error Phase 3 Sub Server is not reachable!..."});
                }
            }
            else{
                socket.emit("server-to-client",{"error": true, "errormsg": "Invalid Phase!..."});
            }
        });

        socket.on("phase-1-server-to-main-server",function(data){
            if(!clientList.has(data.client)){
                console.log("Client Not Found!...");
                return;
            }
            io.to(data.client).emit("server-to-client",{"error": false, "errormsg": "", "phase": 1, "status": data.status, "output": JSON.parse(data.output)});
        });

        socket.on("phase-2-server-to-main-server",function(data){
            if(!clientList.has(data.client)){
                console.log("Client Not Found!...");
                return;
            }
            io.to(data.client).emit("server-to-client",{"error": false, "errormsg": "", "phase": 2, "status": data.status, "output": JSON.parse(data.output)});
        });

        socket.on("phase-3-server-to-main-server",function(data){
            if(!clientList.has(data.client)){
                console.log("Client Not Found!...");
                return;
            }
            io.to(data.client).emit("server-to-client",{"error": false, "errormsg": "", "phase": 3, "status": data.status, "output": JSON.parse(data.output)});
        });

    });
}

module.exports = socketEvents;