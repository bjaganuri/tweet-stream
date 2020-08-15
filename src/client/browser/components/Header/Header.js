import React from 'react';
import { Grid, Input, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './Header.css';

const Header = props => {
    return (
        <Grid className='header-container'>
            <Grid.Row className='search-container'>
                <Grid.Column mobile={4} tablet={8} computer={8}>
                    <Icon name= 'twitter' size= 'huge' className= 'logo-icon' />
                </Grid.Column>
                <Grid.Column mobile={12} tablet={8} computer={8}>
                    <Input 
                        id='searchInput'
                        placeholder='Search...'
                        value= {props.searchTerm}
                        fluid
                        icon='search'
                        onChange= {(event) => props.searchTweets(event.target.value)}
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

Header.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    searchTweets: PropTypes.func.isRequired
};

export default Header;