const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendTaskCreatedNotification = async (task) => {
    const msg = {
        to: task.user.email,
        from: 'no-reply@taskmanager.com',
        subject: 'Task Created',
        text: `Your task "${task.title}" has been created.`,
    };
    await sgMail.send(msg);
};
