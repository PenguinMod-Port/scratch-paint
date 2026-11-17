import log from '../log/log';

const CHANGE_FREEFORM_SMOOTHING_SIZE = 'scratch-paint/freeform-mode/CHANGE_FREEFORM_SMOOTHING_SIZE';
const initialState = { smoothingSize: 2 };

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case CHANGE_FREEFORM_SMOOTHING_SIZE:
            if (isNaN(action.smoothingSize)) {
                log.warn(`Invalid smoothing setting: ${action.smoothingSize}`);
                return state;
            }
            return { smoothingSize: Math.max(0, action.smoothingSize) };
        default:
            return state;
    }
};

// Action creators ==================================
const changeSmoothingSize = function (smoothingSize) {
    return {
        type: CHANGE_FREEFORM_SMOOTHING_SIZE,
        smoothingSize: smoothingSize
    };
};

export {
    reducer as default,
    changeSmoothingSize
};
