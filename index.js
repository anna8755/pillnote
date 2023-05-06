const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const apiRouter = require('./router/api-router');
const webApi = require('./router/web-router');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error-middleware');
const socketAuthMiddleware = require("./middlewares/socket-auth-middleware");
const SocketController = require("./controller/socket-controller");
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

global.sockets = [];

const PORT = process.env.PORT || 5000;

//#region объявления use
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'pages')); // установка директории для шаблонов EJS
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', apiRouter);
app.use('/', webApi);
app.use(errorMiddleware);
//#endregion

io.use(socketAuthMiddleware);

io.on("connection", SocketController.socketController);

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
