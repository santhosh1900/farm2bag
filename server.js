const express       = require('express');
const PORT          = process.env.PORT || 4000;
const path          = require('path');
const bodyParser    = require("body-parser");
const cookieParser  = require("cookie-parser");
const app           = express();

app.use(express.json());

app.use(cookieParser());

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/dist/forintern')));

app.get("*" , (req,res)=>{
    res.sendFile(path.join(__dirname, '/dist/forintern/index.html'));
})


app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
