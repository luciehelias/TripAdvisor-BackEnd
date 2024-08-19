const express = require("express");
const cors = require("cors");
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSENDER_API_KEY,
});

const sentFrom = new Sender(
  `lucie@${process.env.MAILERSENDER_DOMAIN}`,
  "Lucie"
);

app.get("/", (req, res) => {
  res.status(200).json("Server is up !");
});

app.post("/contact", async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;
    const recipients = [
      new Recipient(
        process.env.MY_EMAIL,
        `${process.env.MY_NAME} ${process.env.MY_LASTNAME}`
      ),
    ];
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("New message from my clone website tripAdvisor")
      .setHtml(
        `Email sent from : ${firstName} ${lastName} <br> email : <strong>${email}</strong> <br> with this message : <strong>${message}</strong>`
      )
      .setText(message);

    const result = await mailerSend.email.send(emailParams);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  return res.status(404).json("Not found");
});

app.listen(3000, () => {
  console.log("Server is started");
});
