const ApiError = require("../exceptions/api-error");
const userService = require("../service/user-service");
const { validationResult } = require("express-validator");

//#region служебные функции
// const getRefreshToken = (req) => {
//     const refreshToken = (req.headers.apptype == "Postman") 
//     ?  req.cookies.refreshToken 
//     : req.body.refreshToken;

//     return refreshToken;
// }
//#endregion



class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const { fullname, email, password, photoLink } = req.body;
            const userData = await userService.registration(fullname, email, password, photoLink);

            res.cookie('refreshToken', userData.refreshToken,
                { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
    async forgotPassword(req, res, next) {
        
    }

    async login(req, res, next) {
        try {
            // console.log('try to login')

            const { email, password } = req.body;
            const userData = await userService.login(email, password);

            res.cookie('refreshToken', userData.refreshToken,
                { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const token = await userService.logout(req.cookies.refreshToken);
            res.clearCookie('refreshToken');
            return res.status(200).json({ token, message: 'Вы успешно выйшли из аккаунта' });
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;

            console.log(activationLink);

            await userService.activate(activationLink);
            return res.redirect(process.env.API_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;

            // console.log(`рефреш токен : ${refreshToken}`);

            const userData = await userService.refresh(refreshToken);

            res.cookie('refreshToken', userData.refreshToken,
                { maxAge: 20 * 24 * 60 * 60 * 1000, httpOnly: true });

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);

        } catch (e) {
            next(e);
        }
    }

    async getUser(req, res, next) {
        try {
            const userData = await userService.getUser(req.headers.authorization);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();