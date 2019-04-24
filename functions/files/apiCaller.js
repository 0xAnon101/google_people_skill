const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/contacts"];
const TOKEN_PATH = "token.json";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

fs.readFile("credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  authorize(JSON.parse(content), listConnectionNames);
});

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function listConnectionNames(auth) {
  const service = google.people({ version: "v1", auth });
  service.people.connections.list(
    {
      resourceName: "people/me",
      pageSize: 30,
      personFields: "names"
    },
    async (err, res) => {
      if (err) return console.error("The API returned an error: " + err);
      const connections = await res.data.connections;
      if (connections) {
        rl.question("Enter your contact name to get details: ", async name => {
          let details = await getPeopleDetails(connections, service, name);
          console.log("details:", details);
        });
      } else {
        console.log("No connections found.");
      }
    }
  );
}

const getPeopleDetails = async (connections, service, name) => {
  let output = [];
  let profile = connections.find(person => {
    return person.names[0].givenName === name;
  });

  await service.people.get(
    {
      resourceName: profile.resourceName,
      personFields: "names,phoneNumbers"
    },
    async (err, res) => {
      if (err)
        return console.error(
          "something wrong happened:) people.get returned an error"
        );
      const peopleData = res.data;
      console.log(peopleData);
      output.push(await peopleData);
    }
  );
  console.log("sadas", output);
  return await output;
};
