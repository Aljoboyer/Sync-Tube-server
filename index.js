const http = require('http');
const express=  require('express');
const cors = require ('cors');
const socketIO = require('socket.io')
const app = express();
const port = process.env.PORT || 5000 ;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const server = http.createServer(app);
const io= socketIO(server);

app.use(cors());
app.use(express.json());

const users = [{}];

io.on('connection', (socket) =>{
    console.log("New Connection");

    socket.on('joined', ({user}) => {
        users[socket.id] = user;

        socket.broadcast.emit('userjoined', {message: `${users[socket.id]}  Has Joined`})

        socket.emit('welcome', {message: `${users[socket.id]} welcome to the chat`})
    })
    socket.on('message', ({message, id}) => {
        io.emit('sendsms', {user: users[id],message, id})
    }) 
    
    });

server.listen(port, () => {
    console.log('server is working on ', port)
})
app.get('/', (req, res) => {
    res.send('Travel Server Is connected')
});
