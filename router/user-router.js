const userController = require("../controller/user-controller");
const Router = require('express').Router;
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

const userRouter = new Router();

userRouter.post('/registration',
    body('email').isEmail(),
    body('password')
        .isLength({ min: 7, max: 16 }),
    userController.registration)
    .post('/login', userController.login)
    .post('/logout', userController.logout)
    .get('/activate/:link', userController.activate)
    .get('/refresh', userController.refresh)
    .get('/users', authMiddleware, userController.getUsers)
    .get('/', authMiddleware, userController.getUser);

module.exports = userRouter;