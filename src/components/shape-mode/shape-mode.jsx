import React from 'react';
import PropTypes from 'prop-types';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import messages from '../../lib/messages.js';

import shapeIcon from './shape.svg';

const ShapeModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.shape}
        imgSrc={shapeIcon}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

ShapeModeComponent.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default ShapeModeComponent;
