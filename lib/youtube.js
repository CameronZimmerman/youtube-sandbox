const fs = require('fs');
const Youtube = require('youtube-api');
const open = require('open');

const clientSecretsRaw = fs.readFileSync(`${__dirname}/client_secret.json`);
const clientSecrets = JSON.parse(clientSecretsRaw);

let oauth = Youtube.authenticate({
  type: 'oauth',
  client_id: clientSecrets.web.client_id,
  client_secret: clientSecrets.web.client_secret,
  redirect_url: clientSecrets.web.redirect_uris[0],
});

open(
  oauth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.upload'],
  })
);

module.exports = { oauth, Youtube };
