import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({
  path: "./.env",
});
const sendMail = async (to, subject, templatePath, replacements) => {
    // create a transporter
   try {

    let template = fs.readFileSync(templatePath, "utf8");

    for (const key in replacements) {
        template = template.replace(`{{${key}}}`, replacements[key]);
      }
     const transporter = nodemailer.createTransport({
         service: "gmail",
         auth: {
             user: process.env.SMTP_EMAIL,
             pass: process.env.SMTP_PASSWORD,
         },
     });
 
     // define the email options
     const mailOptions = {
         from: process.env.SMTP_EMAIL,
         to,
         subject,
         html: template,
     };
 
     // send the email
    const info = await transporter.sendMail(mailOptions);

     console.log("Email sent: " + info.response);
   } catch (error) {
    console.error("Error sending email:", error);
   }
};

export default sendMail;