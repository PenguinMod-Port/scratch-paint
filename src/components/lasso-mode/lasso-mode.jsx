import React from 'react';
import PropTypes from 'prop-types';
import messages from '../../lib/messages.js';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import lassoIcon from './lasso.svg';

const LassoModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.lasso}
        imgSrc={lassoIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

LassoModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default LassoModeComponent;
