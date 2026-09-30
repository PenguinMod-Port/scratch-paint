import Panels from '../lib/panels';
import log from '../log/log';

const CHANGE_PANEL = 'scratch-paint/panels/CHANGE_PANEL';
const initialState = Panels.LAYERS;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case CHANGE_PANEL:
        if (action.panel in Panels) {
            return action.panel;
        }
        log.warn(`Panel does not exist: ${action.panel}`);
        /* falls through */
    default:
        return state;
    }
};

// Action creators ==================================
const changePanel = function (panel) {
    return {
        type: CHANGE_PANEL,
        panel: panel
    };
};

export {
    reducer as default,
    changePanel
};
