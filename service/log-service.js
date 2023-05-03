const LogDto = require('../dto/log-dto');
const ApiError = require('../exceptions/api-error');
const ReminderModel = require("../model/reminder-model");
const LogModel = require('../model/log-model')
const tokenService = require("./token-service");

class LogService {
    async verifyAccess(token, reminderId) {
        const accessToken = tokenService.getAccesToken(token);
        const userData = tokenService.validateAccessToken(accessToken);
        const userId = userData.id;

        const reminder = await ReminderModel.findOne({
            _id: reminderId,
            user: userId
        })

        return reminder
    }

    async addLog(token, reminderId, time, notes) {
        const reminder = await this.verifyAccess(token, reminderId);
        const accessToken = tokenService.getAccesToken(token);
        const userId = tokenService.validateAccessToken(accessToken).id;

        if (!reminder || !time || !notes || !reminder.user.equals(userId)) {
            throw ApiError.BadRequest("Вы не ввели все необходимые данные!");
        }

        const log = await LogModel.create({
            reminder: reminderId,
            time,
            notes
        })

        return new LogDto(log, reminder);
    }

    async getLogsByReminderId(token, reminderId) {
        const reminder = await this.verifyAccess(token, reminderId);
        const accessToken = tokenService.getAccesToken(token);
        const userId = tokenService.validateAccessToken(accessToken).id;

        if (!reminder || !reminder.user.equals(userId)) {
            throw ApiError.BadRequest("Вы не ввели все необходимые данные!");
        }

        const logs = await LogModel.find({
            reminder: reminder._id
        }).lean();

        const logsDto = logs.map(log => new LogDto(log, reminder));

        return logsDto;
    }
    async deleteLog(token, logId) {
        const log = await LogModel.findById(logId);
        if (!log) {
            throw ApiError.BadRequest("Вы не ввели все необходимые данные!");
        }
        const reminderId = log.reminder;
        const reminder = await this.verifyAccess(token, reminderId);
        const accessToken = tokenService.getAccesToken(token);
        const userId = tokenService.validateAccessToken(accessToken).id;

        if (!reminder || !reminder.user.equals(userId)) {
            throw ApiError.BadRequest("Вы не ввели все необходимые данные!");
        }

        const result = LogModel.findOneAndDelete({ _id: logId });
        return result;
    }
    async updateLog() {

    }
}

module.exports = new LogService();