import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import SocketIO from 'socket.io';
import Twitter from 'twit';
import HttpStatus from 'http-status-codes';
import 'source-map-support/register';
import { envConfig } from './helpers/env';
import { handleResponse } from './helpers/common/handleResponse';
import HomeController from './controllers/home/controller';

const EnvConfig = envConfig();
const app = express();
const server = http.createServer(app);
const io = SocketIO.listen(server, { serveClient: false });
const port = process.env.PORT || EnvConfig.SERVER_PORT;
const host = process.env.HOST_NAME || EnvConfig.SERVER_HOST_IP;
const T = new Twitter({
    consumer_key: EnvConfig.consumer_key,
    consumer_secret: EnvConfig.consumer_secret,
    access_token: EnvConfig.access_token,
    access_token_secret: EnvConfig.access_token_secret
});

app.use(compression());
app.use('/', express.static('dist'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

let twitterStream;
let searchTerm = 'Karnataka';

const startTwitterStream = () => {
    if (!twitterStream) {
        console.log('Creating new Twitter stream.');
        twitterStream = T.stream('statuses/filter', { track: searchTerm });
        twitterStream.on('tweet', (tweet) => {
            io.emit('newTweet', tweet);
        });

        twitterStream.on('error', (error) => {
            io.emit('error', error);
        });
    } else {
        console.log('Stream already exists.');
    }
    io.emit('searchTerm', searchTerm);
}

const stopTwitterStream = () => {
    console.log('Stopping Twitter stream.');
    twitterStream.stop();
    twitterStream = null;
}

app.post('/updateSearchTerm', (req, res) => {
    searchTerm = req.body.searchTerm;
    handleResponse(req, res, null, { searchTerm: searchTerm });
    stopTwitterStream();
    startTwitterStream();
});

app.get('/trends', (req, res) => {
    T.get('trends/place', {
        id: '20070458'
    } , (err, data) => {
        if(err) {
            handleResponse(req, res, {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                error: err
            }, null);
        } else {
            handleResponse(req, res, null, data);
        }
    });
});

app.get('*', (req, res) => {
    HomeController(req, res);
});

io.on('connection', (socket) => {
    console.log('Client connected.');
    startTwitterStream();
    socket.on('disconnect', () => {
        if (Object.keys(io.sockets.sockets).length === 0) {
            stopTwitterStream();
        }
        console.log('Client disconnected.');
    });
});

app.use((error, req, res, next) => {
    if (error) {
        handleResponse(req, res, {
            statusCode: HttpStatus.FORBIDDEN,
            message: 'Forbidden',
            error
        }, null);
    } else {
        next();
    }
});

server.listen(port, host, () => {
    console.log(`Server ${host} running on port ${port}`);
});