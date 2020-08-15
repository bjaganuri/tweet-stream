import React from 'react';
import { List, Popup, Header, Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './TrendingTopics.css';

const TrendingTopics = props => {
    return (
        <Container className= 'topics-container'>
            <Header as='h2' dividing>
                Tending topics
            </Header>
            <List>
                {
                    props.topics.map((topic, index) => {
                        const { name, tweet_volume, url } = topic;
                        return (
                            <Popup
                                key= {index}
                                trigger={
                                    <List.Item 
                                        as='a' 
                                        href= {url} 
                                        content= {name} 
                                        target= '_blank'
                                    />
                                }
                                content= {tweet_volume}
                                on='hover'
                            />
                        );
                    })
                }
            </List>
        </Container>
    );
}

TrendingTopics.propTypes = {
    topics: PropTypes.array.isRequired
};

export default TrendingTopics;