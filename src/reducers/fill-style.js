import makeColorStyleReducer from '../lib/make-color-style-reducer';

const CHANGE_FILL_COLOR = 'scratch-paint/fill-style/CHANGE_FILL_COLOR';
const CHANGE_FILL_COLOR_2 = 'scratch-paint/fill-style/CHANGE_FILL_COLOR_2';
const CHANGE_FILL_GRADIENT_TYPE = 'scratch-paint/fill-style/CHANGE_FILL_GRADIENT_TYPE';
const CHANGE_FILL_GRADIENT_ANGLE = 'scratch-paint/fill-style/CHANGE_FILL_GRADIENT_ANGLE';
const CLEAR_FILL_GRADIENT = 'scratch-paint/fill-style/CLEAR_FILL_GRADIENT';
const DEFAULT_COLOR = '#9966FF';

const reducer = makeColorStyleReducer({
    changePrimaryColorAction: CHANGE_FILL_COLOR,
    changeSecondaryColorAction: CHANGE_FILL_COLOR_2,
    changeGradientTypeAction: CHANGE_FILL_GRADIENT_TYPE,
    changeGradientAngleAction: CHANGE_FILL_GRADIENT_ANGLE,
    clearGradientAction: CLEAR_FILL_GRADIENT,
    defaultColor: DEFAULT_COLOR,
    selectionPrimaryColorKey: 'fillColor',
    selectionSecondaryColorKey: 'fillColor2',
    selectionGradientTypeKey: 'fillGradientType',
    selectionGradientAngleKey: 'fillGradientAngle'
});

// Action creators ==================================
const changeFillColor = function (fillColor) {
    return {
        type: CHANGE_FILL_COLOR,
        color: fillColor
    };
};

const changeFillColor2 = function (fillColor) {
    return {
        type: CHANGE_FILL_COLOR_2,
        color: fillColor
    };
};

const changeFillGradientType = function (gradientType) {
    return {
        type: CHANGE_FILL_GRADIENT_TYPE,
        gradientType
    };
};

const changeFillGradientAngle = function (gradientAngle) {
    return {
        type: CHANGE_FILL_GRADIENT_ANGLE,
        gradientAngle
    };
};

const clearFillGradient = function () {
    return {
        type: CLEAR_FILL_GRADIENT
    };
};

export {
    reducer as default,
    changeFillColor,
    changeFillColor2,
    changeFillGradientType,
    changeFillGradientAngle,
    clearFillGradient,
    DEFAULT_COLOR,
    CHANGE_FILL_GRADIENT_TYPE
};
