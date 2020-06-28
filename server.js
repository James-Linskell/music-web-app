const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT\n' });
    //res.send({ express: })
});

app.get('/authenticate', (req, res) => {
    let token = 'NO_TOKEN(SERVER)';
    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {

            // use the access token to access the Spotify Web API
            token = body.access_token;

            res.send({
                express: 'RESPONSE RECEIVED FROM AUTHENTICATION SERVER',
                myToken: token,
            });

            // Calling the spotify API with the token (move to client side)
            /*var options = {
                url: 'https://api.spotify.com/v1/users/jmperezperez',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };
            request.get(options, function (error, response, body) {
                console.log(body);
            });*/
        }
    });
});

const request = require('request'); // "Request" library

const client_id = '9921383d96874fd99c7747a000d97483'; // Your client id
const client_secret = '57e54ccba90143178aa912eafa2616d8'; // Your secret

// your application requests authorization
const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};