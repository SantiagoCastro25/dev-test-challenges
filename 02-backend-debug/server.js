
const express = require('express');
const app = express();
app.use(express.json());

const requestLog = [];


async function getDataFromDB() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: 1, value: 'hello' }), 100);
  });
}

app.get('/data', async (req, res) => {
  requestLog.push({ ts: Date.now() });   

  const data = await getDataFromDB();     //Aqui faltaba el await      

  if (!data) {
    res.status(200).json({ error: 'No data found' });  
    return;
  }

  res.json({ result: data.result });     
});

app.post('/save', (req, res) => {
  const { name, value } = req.body;
 
  requestLog.push({ name, value, ts: Date.now() });  

  res.status(200).json({ saved: true, name, value });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});

module.exports = app;
