// import mailchimp from "@mailchimp/mailchimp_marketing";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import { fileURLToPath } from "url";
import { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url)) + `/`;
import https, { request } from "https";
const port = process.env.PORT || 3000;
//-----------------------------------------------------------

app.use(express.urlencoded({ extended: true }));
app.use(express.static(`public`));
app.set("view engine", `ejs`);
//-----------------------------------------------------------

// mailchip setting
const apiKey = process.env.theoNewsletterkey;
const server = process.env.CHIMP_PREFEX;
const listId = process.env.LISTID;

// handlers/
// 1 handle home page
//--------------------------------------------
app.get("/", async (req, res) => {
  res.sendFile(__dirname + "public/signup.html");
});
// 2nd create subscribed contact
//--------------------------------------------
app.post("/", async (req, res) => {
  //

  //
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  //

  //
  //
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const options = {
    url: `${server}.api.mailchimp.com/3.0/lists/${listId}`,
    method: "POST",
    headers: { "Authorization": `mykey ${apiKey}` },
    body: jsonData,
  };

  const request = https.request(options, (error, res, body) => {
    if (error) {
      console.log("!!error mm ---");
    } else {
      console.log("statusCode:", res.statusCode);
      // console.log('headers:', res.headers);
    }
  });

  request.end();

  // try {
  //   const request = https.request(options, (res, body) => {
  //     console.log("statusCode:", res.statusCode);
  //     // console.log('headers:', res.headers);
  //   });
  //   request.end();
  // } catch (error) {
  //   console.log("!!error mm ---");
  // }

  //

  //
});
//--------------------------------------------
// MAILCHIMP

app.listen(port, console.log(`${port}: Running !`));
