import log from '../log/log';

const TOGGLE_BRUSH_PRESSURE = 'scratch-paint/brush-pressure/TOGGLE_BRUSH_PRESSURE';
const SET_BRUSH_PRESSURE = 'scratch-paint/brush-pressure/SET_BRUSH_PRESSURE';
const initialState = false;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case TOGGLE_BRUSH_PRESSURE:
        return !state;
    case SET_BRUSH_PRESSURE:
        if (typeof action.enabled === 'undefined') {
            log.warn('Missing enabled value for setBrushPressure');
            return state;
        }
        return Boolean(action.enabled);
    default:
        return state;
    }
};

const toggleBrushPressure = function () {
    return {
        type: TOGGLE_BRUSH_PRESSURE
    };
};

const setBrushPressure = function (enabled) {
    return {
        type: SET_BRUSH_PRESSURE,
        enabled
    };
};

export {
    reducer as default,
    toggleBrushPressure,
    setBrushPressure
};
