import mailchimp from "@mailchimp/mailchimp_marketing";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import { fileURLToPath } from "url";
import { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url)) + `/`;

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
// 2 create subscribed contact
const listId = process.env.LISTID;
app.post("/", async (req, res) => {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;
  console.log(`page sent data::::  ` + firstName, lastName, email);

  async function run() {
    try {
      const response = await mailchimp.lists.updateListMember(listId, {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      });

      console.log(
        `Successfully added contact as an audience member. The contact's id is ${response.id}.`
      );

      // Respond to the client indicating success if needed
      res.status(200).json({ message: "Subscriber added successfully" });
    } catch (error) {
      // Handle errors
      console.error("Error while adding subscriber:", error);

      // Respond to the client with an error status and message
      res.status(500).json({ message: "Failed to add subscriber" });
    }
  }

  run();
});
// MAILCHIMP

app.listen(port, console.log(`${port}: Running !`));
