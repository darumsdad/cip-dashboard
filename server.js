const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist/cip-dashboard'));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/cip-dashboard/index.html'));
});

app.listen(process.env.PORT || 4200);