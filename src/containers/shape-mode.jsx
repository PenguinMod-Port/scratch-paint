import paper from '@turbowarp/paper';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes.js';
import { MIXED } from '../helper/style-path.js';
import ColorStyleProptype from '../lib/color-style-proptype.js';
import GradientTypes from '../lib/gradient-types.js';

import { changeFillColor, clearFillGradient, DEFAULT_COLOR } from '../reducers/fill-style.js';
import { changeStrokeColor, clearStrokeGradient } from '../reducers/stroke-style.js';
import { changeMode } from '../reducers/modes.js';
import { clearSelectedItems, setSelectedItems } from '../reducers/selected-items.js';
import { setCursor } from '../reducers/cursor.js';
import { changeCurrentlySelectedShape } from '../reducers/shape-mode.js';

import { clearSelection, getSelectedLeafItems } from '../helper/selection.js';
import ShapeTool from '../helper/tools/shape-tool.js';
import ShapeModeComponent from '../components/shape-mode/shape-mode.jsx';

class ShapeMode extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool',
            'validateColorState'
        ]);
    }
    componentDidMount() {
        if (this.props.isShapeModeActive) {
            this.activateTool(this.props);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.tool && nextProps.colorState !== this.props.colorState) {
            this.tool.setColorState(nextProps.colorState);
        }
        if (this.tool && nextProps.selectedItems !== this.props.selectedItems) {
            this.tool.onSelectionChanged(nextProps.selectedItems);
        }
        if (this.tool && nextProps.shape !== this.props.shape) {
            this.tool.setShape(nextProps.shape);
        }

        if (nextProps.isShapeModeActive && !this.props.isShapeModeActive) {
            this.activateTool();
        } else if (!nextProps.isShapeModeActive && this.props.isShapeModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.isShapeModeActive !== this.props.isShapeModeActive;
    }
    componentWillUnmount() {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool() {
        clearSelection(this.props.clearSelectedItems);
        this.validateColorState();

        if (!this.props.shape) {
            this.props.onSetSelectedShape("smile");
        }

        this.tool = new ShapeTool(
            this.props.setSelectedItems,
            this.props.clearSelectedItems,
            this.props.setCursor,
            this.props.onUpdateImage
        );
        this.tool.setColorState(this.props.colorState);
        this.tool.setShape(this.props.shape);
        this.tool.activate();
    }
    validateColorState() { // TODO move to shared class
        // Make sure that at least one of fill/stroke is set, and that MIXED is not one of the colors.
        // If fill and stroke color are both missing, set fill to default and stroke to transparent.
        // If exactly one of fill or stroke color is set, set the other one to transparent.
        const { strokeWidth } = this.props.colorState;
        const fillColor1 = this.props.colorState.fillColor.primary;
        let fillColor2 = this.props.colorState.fillColor.secondary;
        let fillGradient = this.props.colorState.fillColor.gradientType;
        const strokeColor1 = this.props.colorState.strokeColor.primary;
        let strokeColor2 = this.props.colorState.strokeColor.secondary;
        let strokeGradient = this.props.colorState.strokeColor.gradientType;

        if (fillColor2 === MIXED) {
            this.props.clearFillGradient();
            fillColor2 = null;
            fillGradient = GradientTypes.SOLID;
        }
        if (strokeColor2 === MIXED) {
            this.props.clearStrokeGradient();
            strokeColor2 = null;
            strokeGradient = GradientTypes.SOLID;
        }

        const fillColorMissing = fillColor1 === MIXED ||
            (fillGradient === GradientTypes.SOLID && fillColor1 === null) ||
            (fillGradient !== GradientTypes.SOLID && fillColor1 === null && fillColor2 === null);
        const strokeColorMissing = strokeColor1 === MIXED ||
            strokeWidth === null ||
            strokeWidth === 0 ||
            (strokeGradient === GradientTypes.SOLID && strokeColor1 === null) ||
            (strokeGradient !== GradientTypes.SOLID && strokeColor1 === null && strokeColor2 === null);

        if (fillColorMissing && strokeColorMissing) {
            this.props.onChangeFillColor(DEFAULT_COLOR);
            this.props.clearFillGradient();
            this.props.onChangeStrokeColor(null);
            this.props.clearStrokeGradient();
        } else if (fillColorMissing && !strokeColorMissing) {
            this.props.onChangeFillColor(null);
            this.props.clearFillGradient();
        } else if (!fillColorMissing && strokeColorMissing) {
            this.props.onChangeStrokeColor(null);
            this.props.clearStrokeGradient();
        }
    }
    deactivateTool() {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render() {
        return (
            <ShapeModeComponent
                isSelected={this.props.isShapeModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

ShapeMode.propTypes = {
    clearFillGradient: PropTypes.func.isRequired,
    clearStrokeGradient: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    colorState: PropTypes.shape({
        fillColor: ColorStyleProptype,
        strokeColor: ColorStyleProptype,
        strokeWidth: PropTypes.number
    }).isRequired,
    shape: PropTypes.string.isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    isShapeModeActive: PropTypes.bool.isRequired,
    onChangeFillColor: PropTypes.func.isRequired,
    onChangeStrokeColor: PropTypes.func.isRequired,
    onSetSelectedShape: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.instanceOf(paper.Item)),
    setCursor: PropTypes.func.isRequired,
    setSelectedItems: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    colorState: state.scratchPaint.color,
    isShapeModeActive: state.scratchPaint.mode === Modes.SHAPE,
    selectedItems: state.scratchPaint.selectedItems,
    shape: state.scratchPaint.shapeMode.shape,
});
const mapDispatchToProps = dispatch => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    clearFillGradient: () => {
        dispatch(clearFillGradient());
    },
    clearStrokeGradient: () => {
        dispatch(clearStrokeGradient());
    },
    setSelectedItems: () => {
        dispatch(setSelectedItems(getSelectedLeafItems(), false /* bitmapMode */));
    },
    setCursor: cursorString => {
        dispatch(setCursor(cursorString));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.SHAPE));
    },
    onChangeFillColor: fillColor => {
        dispatch(changeFillColor(fillColor));
    },
    onChangeStrokeColor: strokeColor => {
        dispatch(changeStrokeColor(strokeColor));
    },
    onSetSelectedShape: shape => {
        dispatch(changeCurrentlySelectedShape(shape));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShapeMode);
