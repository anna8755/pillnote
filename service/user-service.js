const UserModel = require("../model/user-model");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dto/user-dto");
const ApiError = require("../exceptions/api-error");
const ForgotPassLinkModel = require('../model/forgot-pass');

class UserService {
    async registration(fullname, email, password, photoLink) {
        const candidate = await UserModel.findOne({ email })
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с таким ${email} уже существует!`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        let activationLinkDb = uuid.v4();

        // console.log(activationLinkDb);

        let activationLink = `${process.env.API_URL}/api/user/activate/${activationLinkDb}`;

        const user = await UserModel.create({ fullname, email, password: hashPassword, activationLink: activationLinkDb, photoLink });
        await mailService.sendActivationMail(email, activationLink);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }
    async activate(activationLink) {
        // console.log(activationLink);
        const user = await UserModel.findOne({ activationLink });
        // console.log('41')
        if (!user) {
            throw new ApiError.BadRequest('Некорректная ссылка для активации!');
        }

        user.isActivated = true;
        await user.save();
    }
    async login(email, password) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            // console.log('Пользователь с таким email не был найден!');
            throw ApiError.BadRequest('Пользователь с таким email не был найден!');
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Вы ввели неправильный пароль!');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        };
    }
    async forgotPassword(email) {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            throw ApiError.BadRequest('Пользователя с такой почтой не существует!');
        }

        const link = uuid.v4();

        let forgotlink = await ForgotPassLinkModel.findOne({ user: user._id });
        if (!forgotlink) forgotlink = await ForgotPassLinkModel.create({ user: user._id, link })
        else forgotlink = await ForgotPassLinkModel.findOneAndUpdate({ user: user._id }, { link })

        const forgotLink = `${process.env.API_URL}/forgot/${link}`;
        await mailService.sendForgotPasswordMail(email, forgotLink, user.fullname);
        await tokenService.removeTokenByUserId(user._id);

        return('На вашу почту было отправлено письмо из дальнейшими инструкциями!')
    }
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnathorizatedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnathorizatedError();
        }

        const user = await UserModel.findById(userData.id);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        };
    }
    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }
    async getUser(token) {

        if (!token) throw new (ApiError.BadRequest());
        const accessToken = token.split(' ')[1];
        if (!accessToken) throw new (ApiError.BadRequest());
        const userData = tokenService.validateAccessToken(accessToken);

        if (!userData)
            throw new (ApiError.UnathorizatedError());
        // return await UserModel.findById(userData.id);
        return userData;
    }
}

module.exports = new UserService();