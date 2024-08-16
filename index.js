const express = require("express");
const cors = require("cors");
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

/* MAILERSEND CONFIGURATION */
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
    //   Le console.log de req.body nous affiche les données qui ont été rentrées dans les inputs (dans le formulaire frontend) :
    console.log(req.body);

    // On destructure req.body
    const { firstName, lastName, email, message } = req.body;

    //   On crée un tableau contenant les informations reçues du(des) client(s) :
    const recipients = [
      new Recipient(
        process.env.MY_EMAIL,
        `${process.env.MY_NAME} ${process.env.MY_LASTNAME}`
      ),
    ];
    // On configure le mail que l'on s'apprête à envoyer :
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("This is a Subject")
      .setHtml(
        `Email sent from : ${firstName} ${lastName} <br> email : <strong>${email}</strong> <br> with this message : <strong>${message}</strong>`
      )
      .setText(message);

    // On envoie les infos à MailerSend pour créer le mail et l'envoyer.
    const result = await mailerSend.email.send(emailParams);

    console.log(result); // réponse de MailerSend

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is started ! 📧");
});
