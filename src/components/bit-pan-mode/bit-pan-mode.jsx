import React from 'react';
import PropTypes from 'prop-types';
import messages from '../../lib/messages.js';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import panIcon from './pan.svg';

const BitPanComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.pan}
        imgSrc={panIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitPanComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BitPanComponent;
