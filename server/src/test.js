// test.js
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.expressSend = 'Express is working';
  res.send('Express is working');
});

app.listen(3000, () => {
  console.log('Minimal Express server running on port 3000');
});