import React from 'react';
import PropTypes from 'prop-types';
import messages from '../../lib/messages.js';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import freeformIcon from './freeform.svg';

const FreeformModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.freeform}
        imgSrc={freeformIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

FreeformModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default FreeformModeComponent;
