import React from 'react';
import { Card, Image, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './Tweets.css';

Number.prototype.padLeft = function (base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
};

const formatDate = (date) => {
    let d = new Date(date);

    return (
        [
            (d.getMonth() + 1).padLeft(),
            d.getDate().padLeft(),
            d.getFullYear()
        ].join('/') + ' ' +
        [
            d.getHours().padLeft(),
            d.getMinutes().padLeft(),
            d.getSeconds().padLeft()
        ].join(':')
    );
}

const Tweets = React.forwardRef((props, ref) => {
    return (
        <div ref= {ref} className='tweets-container'>
            <Header as='h2' dividing>
                You are tracking tweets containing <strong>"{props.searchTerm}"</strong> word in them.
            </Header>

            {
                props.tweets.map(tweet => {
                    const { id, user, text, created_at } = tweet;
                    return (
                        <Card raised centered fluid key= {id}>
                            <Card.Content className='card-content'>
                                <Image floated='left' size='tiny' src={user.profile_image_url} className='profile-img' />
                                <div className='tweet-desc'>
                                    <Card.Header>{text}</Card.Header>
                                    <Card.Description>
                                        <Card.Meta><a href={`https://twitter.com/${user.screen_name}`} target='_blank'>{user.name}</a></Card.Meta>
                                        <span>{formatDate(created_at)}</span>
                                    </Card.Description>
                                </div>
                            </Card.Content>
                        </Card>
                    );
                })
            }
        </div>
    );
});

Tweets.propTypes = {
    tweets: PropTypes.array.isRequired
};

export default Tweets;