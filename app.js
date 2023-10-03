import mailchimp from "@mailchimp/mailchimp_marketing";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import { fileURLToPath } from "url";
import { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url)) + `/`;
import https from "https";

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(`public`));
app.set("view engine", `ejs`);

// mailchip

// MAILCHIMP PING
mailchimp.setConfig({
  apiKey: process.env.theoNewsletterkey,
  server: process.env.CHIMP_PREFEX,
});
async function chimpPing() {
  const response = await mailchimp.ping.get();
  console.log(response);
}
chimpPing();
// log all list
async function logAllList() {
  const response = await mailchimp.lists.getAllLists();

  response.lists.forEach((elem) => {
    console.log(`List id: ${elem.id}, List Name: ${elem.name}`);
  });
}
logAllList();

// handlers/
// 1 handle home page
app.get("/", async (req, res) => {
  res.sendFile(__dirname + "public/signup.html");
});
// 2nd create subscribed contact
const listId = process.env.LISTID;
app.post("/", async (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(`page sent data::::  ` + firstName, lastName, email);

  const jsonMemberData = JSON.stringify({
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
        vip: true,
      },
    ],
  });
  async function run() {
    const URI = `https://${process.env.CHIMP_PREFEX}.api.mailchimp.com/3.0/lists/${process.env.LISTID}`;
    const option = 
    try {
      https.request(URI, option, (res) => {});
      // Respond to the client indicating success if needed
      res
        .status(200)
        .send(
          `<div style="color:red; display:flex;justify-content: center;"><h1>Subscriber added successfully</h1></div>`
        );
    } catch (error) {
      // Handle errors
      console.error("Error while adding subscriber:", error);
      var objError = JSON.parse(error.response.text);
      res.send(
        `<div style="color:red; display:flex;justify-content: center;"><h1>${objError.detail}</h1></div>`
      );

      // Respond to the client with an error status and message
      res.status(500).json({ message: "Failed to add subscriber" });
    }
  }

  run();
});
// MAILCHIMP

app.listen(port, console.log(`${port}: Running !`));
