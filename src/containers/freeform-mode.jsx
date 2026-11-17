import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes.js';

import {changeStrokeColor} from '../reducers/stroke-style.js';
import {changeStrokeWidth} from '../reducers/stroke-width.js';
import {changeMode} from '../reducers/modes.js';
import {clearSelectedItems} from '../reducers/selected-items.js';
import {MIXED} from '../helper/style-path.js';
import {changeSimplifySize} from '../reducers/freeform-mode.js';
import ColorStyleProptype from '../lib/color-style-proptype.js';

import {clearSelection} from '../helper/selection.js';
import FreeformTool from '../helper/tools/freeform-tool.js';
import FreeformModeComponent from '../components/freeform-mode/freeform-mode.jsx';

class FreeformMode extends React.Component {
    static get DEFAULT_COLOR () {
        return '#000000';
    }
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isFreeformModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps (nextProps) {
        if (this.tool && (
                nextProps.colorState.fillColor !== this.props.colorState.fillColor ||
                nextProps.colorState.strokeColor !== this.props.colorState.strokeColor ||
                nextProps.colorState.strokeWidth !== this.props.colorState.strokeWidth
        )) {
            this.tool.setColorState(nextProps.colorState);
        }

        if (this.tool && nextProps.simplifySize !== this.props.simplifySize) {
            this.tool.setSimplifySize(nextProps.simplifySize);
        }

        if (nextProps.isFreeformModeActive && !this.props.isFreeformModeActive) {
            this.activateTool();
        } else if (!nextProps.isFreeformModeActive && this.props.isFreeformModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isFreeformModeActive !== this.props.isFreeformModeActive;
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);
        // Force the default freeform color if stroke is MIXED or transparent
        const {fillColor} = this.props.colorState;
        if (fillColor === MIXED || fillColor === null) {
            this.props.onChangeFillColor(FreeformMode.DEFAULT_COLOR);
        }
        if (typeof this.props.simplifySize !== "number") {
            this.props.onChangeSimplifySize(2);
        }
        this.tool = new FreeformTool(
            this.props.clearSelectedItems,
            this.props.onUpdateImage
        );
        this.tool.setColorState(this.props.colorState);
        this.tool.setSimplifySize(this.props.simplifySize);
        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <FreeformModeComponent
                isSelected={this.props.isFreeformModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

FreeformMode.propTypes = {
    clearSelectedItems: PropTypes.func.isRequired,
    colorState: PropTypes.shape({
        fillStyle: ColorStyleProptype,
        strokeColor: ColorStyleProptype,
        strokeWidth: PropTypes.number
    }).isRequired,
    simplifySize: PropTypes.number,
    handleMouseDown: PropTypes.func.isRequired,
    isFreeformModeActive: PropTypes.bool.isRequired,
    onChangeStrokeColor: PropTypes.func.isRequired,
    onChangeStrokeWidth: PropTypes.func.isRequired,
    onChangeSimplifySize: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    colorState: state.scratchPaint.color,
    isFreeformModeActive: state.scratchPaint.mode === Modes.FREEFORM,
    simplifySize: state.scratchPaint.freeformMode.simplifySize//-fillMode.simplifySize
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.FREEFORM));
    },
    deactivateTool () {
    },
    onChangeStrokeColor: strokeColor => {
        dispatch(changeStrokeColor(strokeColor));
    },
    onChangeStrokeWidth: strokeWidth => {
        dispatch(changeStrokeWidth(strokeWidth));
    },
    onChangeSimplifySize: simplifySize => {
        dispatch(changeSimplifySize(simplifySize));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FreeformMode);