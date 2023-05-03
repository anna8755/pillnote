const reminderService = require("../service/reminder-service");

const getSocketByUserId = (id) => {
    const socket = global.sockets.find((s) => s.user.id === id);
    return socket;
}
const addReminderTimer = (reminder, user) => {
    const timeUntilReminder = new Date(reminder.time) - new Date();

    const socket = getSocketByUserId(user.id);
    if (!socket) return;
    
    const timer = setTimeout(() => {
        if (socket) {

            socket.emit("reminder", reminder);
            const index = socket.reminders.indexOf(reminder);
            if (index !== -1) {
                reminders.splice(index, 1);
            }
        }
    }, timeUntilReminder);

    socket.reminders.push({
        timer, reminder
    });
}
const deleteReminderTimer = (reminder) => {
    global.sockets.forEach((socket) => {
        const foundReminder = socket.reminders.find((r) => r.reminder == reminder);
        if (foundReminder) {
            clearTimeout(foundReminder.timer);
        }
    });
}
const socketController = async (socket) => {
    const token = socket.handshake.headers.authorization;
    socket.reminders = [];

    global.sockets.push(socket);

    const userReminders = (await reminderService.getAllReminders(token))
        .filter(reminder => new Date(reminder.time) > new Date());

    socket.on('disconnect', () => {
        socket.reminders.forEach(reminder => {
            clearTimeout(reminder.timer)
        })

        const index = global.sockets.indexOf(socket);
        if (index > -1) {
            global.sockets.splice(index, 1);
        }
    })

    userReminders.forEach(reminder => addReminderTimer(reminder, socket.user))
}

module.exports = {
    addReminderTimer,
    socketController,
    deleteReminderTimer
}