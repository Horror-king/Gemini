const express = require('express');
const https = require('https');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const rapidApiKey = '6a381d6a7bmsh822a533b6f6dbfdp1530dbjsn38b24a6d2e6c'; // Replace with your RapidAPI key
const rapidApiHost = 'chatgpt-42.p.rapidapi.com';

app.use(cors()); // Enable CORS

app.get('/gemini', (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt parameter is required' });
  }

  const options = {
    method: 'POST',
    hostname: rapidApiHost,
    path: '/geminipro',
    headers: {
      'x-rapidapi-key': rapidApiKey,
      'x-rapidapi-host': rapidApiHost,
      'Content-Type': 'application/json'
    }
  };

  const apiReq = https.request(options, apiRes => {
    let chunks = [];

    apiRes.on('data', chunk => {
      chunks.push(chunk);
    });

    apiRes.on('end', () => {
      const body = Buffer.concat(chunks);
      try {
        const response = JSON.parse(body.toString());
        res.json(response);
      } catch (error) {
        res.status(500).json({ error: 'Error parsing response from Gemini API' });
      }
    });
  });

  apiReq.on('error', error => {
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  });

  apiReq.write(JSON.stringify({
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.9,
    top_k: 5,
    top_p: 0.9,
    max_tokens: 256,
    web_access: false
  }));
  apiReq.end();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});