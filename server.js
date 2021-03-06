var express = require('express'),
    app = express(),
    http = require('http'),
    socketIo = require('socket.io');

// start webserver on port 8080
var server =  http.createServer(app);
var io = socketIo.listen(server);
//server.listen(8080); adios localhost. holaaaaaaaa heroku <3
var port = server.listen(process.env.PORT || 3000);
server.listen(port);
server.listen(process.env.PORT, '0.0.0.0', function(err) {
  console.log("Started listening on %s", app.url);
});
// add directory with our static files
app.use(express.static(__dirname + '/public'));
console.log("Server running on 127.0.0.1:8080");

// array of all lines drawn
var line_history = [];
var visitas = 0;
// event-handler for new incoming connections
io.on('connection', function (socket) {
  visitas++;
  socket.broadcast.emit('visits', visitas);
  console.log(visitas);
  var cor=  Math.floor((Math.random() * 5) + 1);
  var cores = ["blue", "red", "yellow", "pink", "green","orange"];
   // first send the history to the new client
   for (var i in line_history) {
      socket.emit('draw_line', { line: line_history[i]} );
   }

   // add handler for message type "draw_line".


   socket.on('draw_line', function (data) {

      // add received line to history
      line_history.push(data.line);
      // send line to all clients
      io.emit('draw_line', { line: data.line, lapis: cores[cor]});
      console.log("cor selecionada:"+ cores[cor]);
      console.log(cores[cor].length);

   });

   socket.on('disconnect', function(){
   visitas--;
 console.log(visitas);
   socket.broadcast.emit('message', visitas);
   if(visitas==0){
    line_history = [];
   }
});
});
