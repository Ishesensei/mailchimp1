import express from "express";
import https from "https";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import fileURLToPath from "url";
import dirname from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// mailchip setting
const apiKey = process.env.theoNewsletterkey;
const server = process.env.CHIMP_PREFEX;
const listId = process.env.LISTID;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname,
        },
      },
    ],
  };
  const jsondata = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/" + listId;
  const options = {
    method: "POST",
    auth: "theo:" + apiKey,
  };
  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      console.log(response.statusCode);
      res.sendFile(__dirname + "/failure.html");
    }
  });
  request.write(jsondata);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`running at ${process.env.PORT || 3000}`);
});
