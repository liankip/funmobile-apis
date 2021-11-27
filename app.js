const express = require("express");
const cors = require("cors");
require('dotenv').config()

const app = express();
const auth = require('./routes/auth')
const dashboard = require('./routes/dashboard')
const dashreport = require('./routes/dashreport')
const olahdata = require('./routes/olahdata')
const report = require('./routes/report')
const lib = require('./routes/lib')
const reseller = require('./routes/reseller')
const inbox = require('./routes/inbox')

app.use(cors({
	origin: '*'
}));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/auth", auth)
app.use("/dashboard", dashboard)
app.use("/dashreport", dashreport)
app.use('/olahdata', olahdata)
app.use('/report', report)
app.use('/lib', lib)
app.use('/reseller', reseller)
app.use('/inbox', inbox)

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", '*');
	res.header("Access-Control-Allow-Credentials", true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
	next();
});

app.get('/', function (req, res) {
  res.send('ok')
})

// set port, listen for requests
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {});
