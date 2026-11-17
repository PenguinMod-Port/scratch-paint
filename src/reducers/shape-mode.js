import log from '../log/log';

const CHANGE_SHAPE_SHAPE = 'scratch-paint/shape-mode/CHANGE_SHAPE_SHAPE';
const initialState = { shape: "smile" };

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    let { shape } = state;
    switch (action.type) {
        case CHANGE_SHAPE_SHAPE:
            if (typeof action.shape !== "string") {
                log.warn(`Invalid shape: ${action.shape}`);
                return state;
            }
            return { shape: String(action.shape) };
        default:
            return state;
    }
};

// Action creators ===================================
const changeShape = function (shape) {
    return {
        type: CHANGE_SHAPE_SHAPE,
        shape: shape
    };
};

export {
    reducer as default,
    changeShape
};
