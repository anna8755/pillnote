const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./router');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error-middleware');


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const PORT = process.env.PORT || 5000;

//#region объявления use

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router)
app.use(errorMiddleware);
//#endregion

// io.use((socket, next) => {
//     //каким образом в console.log вывести информацию, которую передали на сервер?
//     console.log(socket.request._query.token);
//     next()
// })


// io.on("connection", (socket) => {

//     console.log('user is connected')

//     socket.emit('hi', 'hello')

//     socket.on('hi', () => {
//         console.log('hi from client!')
//     })
// });


const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        httpServer.listen(PORT, () => {
            console.log(`Listen at port ${PORT} : ${new Date().toLocaleString()}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();