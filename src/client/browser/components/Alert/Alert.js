import React from 'react';
import { Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const Alert = ({ title, message, ...props}) => (
    <Message {...props}>
        <Message.Header>{title}</Message.Header>
        <p>{message}</p>
    </Message>
);

Alert.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
};

export default Alert;