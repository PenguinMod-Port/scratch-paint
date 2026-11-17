import paper from '@turbowarp/paper';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes.js';

import {changeMode} from '../reducers/modes.js';
import {setCursor} from '../reducers/cursor.js';

import {getSelectedLeafItems} from '../helper/selection.js';
import PanTool from '../helper/tools/pan-tool.js';
import BitPanComponent from '../components/bit-pan-mode/bit-pan-mode.jsx';

class BitPanMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isSelectModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.isSelectModeActive && !this.props.isSelectModeActive) {
            this.activateTool();
        } else if (!nextProps.isSelectModeActive && this.props.isSelectModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isSelectModeActive !== this.props.isSelectModeActive;
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        this.tool = new PanTool(
            this.props.setCursor
        );
        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <BitPanComponent
                isSelected={this.props.isSelectModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

BitPanMode.propTypes = {
    handleMouseDown: PropTypes.func.isRequired,
    isSelectModeActive: PropTypes.bool.isRequired,
    setCursor: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isSelectModeActive: state.scratchPaint.mode === Modes.BIT_PAN,
});
const mapDispatchToProps = dispatch => ({
    setCursor: cursorString => {
        dispatch(setCursor(cursorString));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.BIT_PAN));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BitPanMode);
