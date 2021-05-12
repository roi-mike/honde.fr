const express = require('express');
const app = express();

const servePort = process.env.PORT || 8080;


app.get('/',(req,res) => {
    res.sendFile(__dirname+'/views/index.html');
});

app.listen(servePort);