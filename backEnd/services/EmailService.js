"use strict";
const nodemailer = require('nodemailer');
const getConfiguration = require("../config");
const appConfig = getConfiguration();
const UserSchema = require("../entities/db/UserSchema");

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            secure: false,
            auth: {
                user: appConfig.mailTrapUser,
                pass: appConfig.mailTrapPassword,
            },
        });
        this.sentDateByHwCode = new Map();
    }

    async sendEmail(hardwarioCode, measuredData, cacheValue, type) {
        const todayPlus1Day = new Date();
        todayPlus1Day.setDate(todayPlus1Day.getDate() + 1);

        //poslal jsem vubec nekdy email
        const isHasBeenEmailSent = this.sentDateByHwCode.has(hardwarioCode);
        // nastavim datum nyni pokud jsem email nikdy neposlal
        let relevantDateForEmail = new Date();
        //pokud jsem mail poslal, prenastavim datum
        if (isHasBeenEmailSent)
            relevantDateForEmail = this.sentDateByHwCode.get(hardwarioCode);

        const dateD = new Date(relevantDateForEmail.getTime());
        const isShouldSendEmailAgain = dateD.setDate(relevantDateForEmail.getDate() + 1) <= new Date();

        if (!isHasBeenEmailSent || (isHasBeenEmailSent && isShouldSendEmailAgain)) {
            // set the hardwario code and date of email sending to the cache
            this.sentDateByHwCode.set(hardwarioCode, new Date());

            const terrariumId = cacheValue._id.toString();
            const targetLivingConditions = cacheValue.targetLivingConditions;
            const recipientEmailAddresses = await UserSchema
                .find({terrariums: terrariumId})
                .select({email: 1})

            const subject = 'Terrarium Alert';
            let text = "This is an email from IoT TerrariumServiceApp\n\n";
            text += `Your terrarium associated with hardwarioCode: ${hardwarioCode} reported values not within given limits.\n`;
            text += `${type} limit min is: ${targetLivingConditions[type].min} \n`;
            text += `${type} limit max is: ${targetLivingConditions[type].max} \n`;
            text += `measured value: ${measuredData}`;
            const message = {
                from: '"IoT TerrariumServiceApp" <iotterrariumserviceapp@example.com>',
                to: "",
                subject: subject,
                text: text,
            };

            recipientEmailAddresses.forEach(document => {
                message.to = document.email;
                this.transporter.sendMail(message, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                        return;
                    }
                    console.log('Email sent successfully:', info.messageId);
                });
            });
        }
    }
}

module.exports = new EmailService();
