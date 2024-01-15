const express = require('express');
const app = express();
app.use(express.json());

// set the port based on environment (more on environments later)
const port = process.env.PORT || 3000;

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

const routes = require('./routes/router');
app.use('/', routes);

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
