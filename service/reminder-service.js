const ReminderDto = require("../dto/reminder-dto");
const ApiError = require("../exceptions/api-error");
const ReminderModel = require("../model/reminder-model");
const tokenService = require("./token-service");


class ReminderService {
    async addReminder(token, medicine, time, notes) {

        if (!token) throw new (ApiError.BadRequest());
        const accessToken = token.split(' ')[1];
        if (!accessToken) throw new (ApiError.BadRequest());

        const userId = tokenService.validateAccessToken(accessToken).id;

        if (!token || !medicine || !time) {
            throw ApiError.BadRequest("Вы не ввели все необходимые данные!");
        }

        const reminder = await ReminderModel.create({
            user: userId,
            medicine,
            time,
            notes
        });

        return new ReminderDto(reminder);
    }
    async changeReminder(id, token, medicine, time, notes) {
        const userId = tokenService.validateAccessToken(token).id;
        const reminder = await ReminderModel.findById(id);
        if (!reminder || reminder.user._id != userId) {
            throw ApiError.BadRequest("Вы ввели неправильные данные!");
        }

        reminder.medicine = medicine;
        reminder.time = time;
        reminder.notes = notes;

        await reminder.save();

        return new ReminderDto(reminder);
    }
    async deleteReminder(token, id) {
        const userId = tokenService.validateAccessToken(token).id;
        const reminder = await ReminderModel.findById(id);
        if (!reminder || reminder.user._id != userId) {
            throw ApiError.BadRequest("Вы ввели неправильные данные!");
        }

        const result = await ReminderModel.findOneAndDelete({ _id: id });

        return result;
    }
    async getAllReminders(token) {
        const accessToken = token.split(' ')[1];
        const userId = tokenService.validateAccessToken(accessToken).id;
        const reminders = await ReminderModel.find({ user: userId }).lean();
        const remindersDto = reminders.map(reminder => new ReminderDto(reminder));
        return remindersDto;
    }
    async getReminder(token, id){
        const userId = tokenService.validateAccessToken(token).id;
        const reminder = await ReminderModel.findById(id);
        if (!reminder || reminder.user._id != userId) {
            throw ApiError.BadRequest("Вы ввели неправильные данные!");
        }

        const result = await ReminderModel.findById(id);
        return new ReminderDto(result);
    }
}

module.exports = new ReminderService();