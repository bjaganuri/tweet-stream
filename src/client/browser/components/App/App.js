import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import { Grid } from 'semantic-ui-react';
import axios from 'axios';
import './App.css';

import Header from '../Header/Header';
import Tweets from '../Tweets/Tweets';
import TrendingTopics from '../TrendingTopics/TrendingTopics';
import Alert from '../Alert/Alert';

export class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tweets: [],
            topics: [],
            searchTerm: null,
            error: null
        };
        this.updateSearchTerm = this.updateSearchTerm.bind(this);
        this.fetchTendingTopics = this.fetchTendingTopics.bind(this);
        this.searchTweets = this.searchTweets.bind(this);
        this.searchTweetTimer;
    }

    componentDidMount() {
        const socket = socketIOClient('http://localhost:3000/');

        socket.on('connect', () => {

            socket.on('newTweet', (tweet) => {
                this.setState(prevState => ({
                    tweets: [tweet, ...prevState.tweets.slice(0, 49)],
                    error: null
                }), () => {
                    this.refs.tweetsContainer.scrollTop = 0;
                });
            });

            socket.on('searchTerm', (searchTerm) => {
                this.setState({ searchTerm });
            });

            socket.on('error', (error) => {
                this.setState({
                    error: error.twitterReply
                });
            });
        });

        socket.on('disconnect', () => {
            socket.off('newTweet')
            socket.removeAllListeners('newTweet')
        });

        this.fetchTendingTopics();
    }

    searchTweets(value) {      
        this.setState({
            searchTerm: value
        }, () => {
            clearTimeout(this.searchTweetTimer);
            this.searchTweetTimer = setTimeout(() => this.updateSearchTerm(), 250);
        }); 
    }

    updateSearchTerm() {
        axios.post('/updateSearchTerm', {
            searchTerm: this.state.searchTerm
        })
        .then((response) => {
            // To do
        })
        .catch((error) => {
            this.setState({
                error: 'Something went wrong. Please refresh page!!!'
            });
        });
    }

    fetchTendingTopics() {
        axios.get('/trends')
        .then((response) => {
            this.setState({
                topics: response?.data?.result[0]?.trends
            });
        })
        .catch((error) => {
            this.setState({
                error: 'Something went wrong. Please refresh page!!!'
            });
        });
    }

    render() {
        const { tweets, topics, error } = this.state;

        return (
            <Grid>
                <Grid.Row className='app-container'>
                    <Grid.Column mobile={16} tablet={16} computer={16}>
                        <Header
                            searchTerm={this.state.searchTerm}
                            searchTweets={this.searchTweets}
                        />
                    </Grid.Column>

                    {
                        error && (
                            <Grid.Column mobile={16} tablet={16} computer={16}>
                                <Alert
                                    title= 'Oh Snap!!!'
                                    message= {error}
                                    negative= {true}
                                />
                            </Grid.Column>
                        )
                    }
                    
                    <Grid.Column mobile={16} tablet={16} computer={16}>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={6} computer={6}>
                                    <TrendingTopics topics= {topics} />
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={10} computer={10}>
                                    <Tweets 
                                        tweets= {tweets}
                                        searchTerm={this.state.searchTerm}
                                        ref= 'tweetsContainer'
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default App;