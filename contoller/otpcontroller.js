const otp = require("../model/otp");
const OTP = require("../model/otp");
const sendEmail = require("../servise/nodemailer");
require("dotenv").config()
const { AUTH_EMAIL } = process.env;

const sendOTP = async (email) => {

    console.log(email, "          Email I()")
    console.log(AUTH_EMAIL, "          Auth Email")
    try {
        console.log("this is otp sending area.......................");
        if (!(email)) {
            throw Error("provide values for email,subject,message")
        }
        console.log("delete OTP and new OTP sended");
        const generatedOTP = await generateOTP();
        console.log("otp generated success full------------------------");
        const mailOptions = {
            from: AUTH_EMAIL,
            to: email,
            subject: "Verify the email using this otp",
            html: `<p>Hello new user use the this otp to verify your email to continue </p><p style="color:tomato;font-size:25px;letter-spacing:2px;">
            <b>${generatedOTP}</b></p><p>OTP will expire in<b> 10 minute(s)</b>.</p>`
        }
        console.log("!!!!!!!!!!!!!!..................mail crated success full");
        await sendEmail(mailOptions);

        function addMinutesToDate(date, minutes) {
            return new Date(date.getTime() + minutes * 60000); 
        }
        const currentDate = new Date();
        const newDate = addMinutesToDate(currentDate, 10);
        const existingotp = await otp.findOne({ email: email })
        if (existingotp) {
            await otp.updateOne({ email: email }, { $set: { otp: generatedOTP } })
        }
        else {
            const newOTP = new OTP({
                email,
                otp: generatedOTP,
                createdAt: Date.now(),
                expireAt: newDate,
            })
            const createdOTPrecord = await newOTP.save()
            return createdOTPrecord
        }

    } catch (err) {
        throw err;
    }
}

const generateOTP = async () => {
    try {
        console.log("otp genarating................");
        const otp = `${Math.floor(1000 + Math.random() * 900)}`;
        console.log(otp);
        return otp;
    } catch (err) {
        throw err;
    }
};

module.exports = {sendOTP,generateOTP};