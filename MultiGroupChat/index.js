//Server
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/javascript", (req, res) => {
  res.sendFile(__dirname + "/public/javascript.html");
});

app.get("/swift", (req, res) => {
  res.sendFile(__dirname + "/public/swift.html");
});

app.get("/css", (req, res) => {
  res.sendFile(__dirname + "/public/css.html");
});

var usernames = {};
//Tech Name Space
const tech = io.of("/tech");
tech.on("connection", socket => {
  //Join Event From Client
  socket.on("join", data => {
    socket.join(data.room);
    //Here we will emit a message to people in the room
    tech
      .in(data.room)
      .emit("message", ` ${data.user} joined ${data.room} Room`);
  });

  socket.on("message", data => {
    console.log(`${data.user}: ${data.msg}`);
    tech.in(data.room).emit("message", `${data.user}:${data.msg}`);
  });

  socket.on("disconnect", () => {
    tech.emit("message", `User has disconnected`);
  });
});
