const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const routes = require('./routes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware [Params available in req.body]
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// For any Cors Configuration
app.use(cors());

// API calls
app.use('/api', routes);

app.use(express.static('dist'));

app.listen(port || 5000, () => console.log(`Listening on port ${port || 5000}!`));
