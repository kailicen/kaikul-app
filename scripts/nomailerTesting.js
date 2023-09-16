const nodemailer = require("nodemailer");

const mailTransport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "705798b37178be",
    pass: "09f34148192697",
  },
});

const mailOptions = {
  from: "Kaikul : no-reply@kaikul.com",
  to: "kailicen226@gmail.com", // replace with your own email address for testing
  subject: "Welcome to Kaikul",
  html: "<p>Test email from Kaikul</p>",
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
