const express = require('express');
const app = express();
const { oauth, Youtube } = require('./youtube.js');
const fs = require('fs');
const fetch = require('node-fetch');

app.use(express.json());

app.get('/redirect/youtube', async (req, res, next) => {
  const code = req.query.code;
  const token = await oauth.getToken(code);
  oauth.setCredentials(token);

  const data = {
    resource: {
      filter: {
        id: 12
      },
      // Video title and description
      snippet: {
        title: 'Testing YoutTube API NodeJS module',
        description: 'Test video upload via YouTube API',
      },
      // I don't want to spam my subscribers
      status: {
        privacyStatus: 'private',
      },
    },
    // This is for the callback function
    part: 'snippet,status,filter',

    // Create the readable stream to upload the video
    media: {
      body: fs.createReadStream(
        `${__dirname}/../data/2021-04-20 09-43-16.mkv`
      ),
    },
  }

  const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');

  try {
    req = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=AIzaSyCLjacPxWEmqy3li8nlXv9dhkGWbnR0ffU`,
      {
        method: 'post',
        headers: {
          'Authorization': `Bearer ${token.tokens.access_token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(formBody),
      }
    );
    console.log(await req.json());
  } catch (err) {
    next(err);
  }
  process.exit();

//   var req = await Youtube.videos.insert(
//   {
//     auth: oauth,
//     resource: {
//       // Video title and description
//       snippet: {
//         title: 'Testing YoutTube API NodeJS module',
//         description: 'Test video upload via YouTube API',
//       },
//       // I don't want to spam my subscribers
//       status: {
//         privacyStatus: 'private',
//       },
//     },
//     // This is for the callback function
//     part: 'snippet,status',

//     // Create the readable stream to upload the video
//     media: {
//       body: fs.createReadStream('../data/2021-04-20 09-43-16.mkv'),
//     },
//   },
//     (err, data) => {
//       if (err) next();
//       console.log(data);
//       process.exit();
//     }
//   );
});

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
