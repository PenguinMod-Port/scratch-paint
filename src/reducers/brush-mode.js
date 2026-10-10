import log from '../log/log';

const CHANGE_BRUSH_SIZE = 'scratch-paint/brush-mode/CHANGE_BRUSH_SIZE';
const CHANGE_SMOOTHING_SIZE = 'scratch-paint/brush-mode/CHANGE_SMOOTHING_SIZE';
const CHANGE_BRUSH_TYPE = 'scratch-paint/brush-mode/CHANGE_BRUSH_TYPE';
const TOGGLE_BRUSH_PRESSURE = 'scratch-paint/brush-mode/TOGGLE_BRUSH_PRESSURE';
const initialState = {
    brushSize: 10,
    smoothingSize: 10,
    brushType: "CIRCLE",
    pressureEnabled: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    let {brushSize, smoothingSize, brushType, pressureEnabled} = state;
    switch (action.type) {
        case CHANGE_BRUSH_SIZE:
            if (isNaN(action.brushSize)) {
                log.warn(`Invalid brush size: ${action.brushSize}`);
                return state;
            }
            return { brushSize: Math.max(1, action.brushSize), smoothingSize, brushType, pressureEnabled };
        case CHANGE_SMOOTHING_SIZE:
            if (isNaN(action.smoothingSize)) {
                log.warn(`Invalid smoothing setting: ${action.smoothingSize}`);
                return state;
            }
            return { brushSize, smoothingSize: Math.max(0, action.smoothingSize), brushType, pressureEnabled };
        case CHANGE_BRUSH_TYPE:
            return { brushSize, smoothingSize, brushType: String(action.brush), pressureEnabled };
        case TOGGLE_BRUSH_PRESSURE:
            return { brushSize, smoothingSize, brushType, pressureEnabled: !pressureEnabled };
        default:
            return state;
    }
};

// Action creators ==================================
const changeBrushSize = function (brushSize) {
    return {
        type: CHANGE_BRUSH_SIZE,
        brushSize: brushSize
    };
};

const changeSmoothingSize = function (smoothingSize) {
    return {
        type: CHANGE_SMOOTHING_SIZE,
        smoothingSize: smoothingSize
    };
};

const changeBrushType = function (type) {
    return {
        type: CHANGE_BRUSH_TYPE,
        brush: type
    };
};

const toggleBrushPressure = function () {
    return {
        type: TOGGLE_BRUSH_PRESSURE
    };
};

export {
    reducer as default,
    changeBrushSize,
    changeSmoothingSize,
    changeBrushType,
    toggleBrushPressure,
};