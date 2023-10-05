require("dotenv").config();

const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");

// Your Mailgun credentials
const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY, // Use your Mailgun API key here
    domain: process.env.MAILGUN_DOMAIN, // Use your Mailgun domain here
  },
};

// Create a Nodemailer transport object using the Mailgun transport plugin.
const mailTransport = nodemailer.createTransport(mg(auth));

const mailOptions = {
  from: "KaiKul <no-reply@kaikul.com>",
  to: "kailicen226@gmail.com", // Replace with your own email address for testing
  subject: "Welcome to KaiKul",
  template: "welcome_email", // Use the template name you defined in Mailgun
  "h:X-Mailgun-Variables": JSON.stringify({
    displayName: "Kaili Cen",
  }),
};

async function sendTestEmail() {
  try {
    await mailTransport.sendMail(mailOptions);
    console.log("Welcome Mail Sent");
  } catch (error) {
    console.error("There was an error while sending the email:", error.message);
  }
}

sendTestEmail();
