const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

if (!fs.existsSync('data.json')) {
    fs.writeFileSync('data.json', '{"db": []}');
}

app.get('/api/retrive', (req, res) => {
  const data = JSON.parse(fs.readFileSync('data.json'));

  if (req.query.id) {
    const filteredData = data.db.filter((item) => item.id == req.query.id);
    if (filteredData.length === 1) {
        res.send(filteredData[0]);
      } else {  
        res.send(filteredData);
      }
  } else {
    if (data.length === 1) {
        res.send(data[0]);
      } else {
        res.send(data);
      }  
  }
  
});

app.get('/api/save', (req, res) => {
  const data = JSON.parse(fs.readFileSync('data.json'));

  data.db.push({
    id: req.query.id,
    data: req.query.data
})

  fs.writeFileSync('data.json', JSON.stringify(data));

  res.send('Data received and stored successfully!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
