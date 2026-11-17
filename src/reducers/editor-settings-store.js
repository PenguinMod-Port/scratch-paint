const SET_SETTINGS_STORE = 'scratch-paint/modes/SET_SETTINGS_STORE';
const initialState = null;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_SETTINGS_STORE:
        return action.settingsStore;
    default:
        return state;
    }
};

// Action creators ==================================
const setSettingsStore = store => ({
    type: SET_SETTINGS_STORE,
    settingsStore: store
});

export {
    reducer as default,
    setSettingsStore
};
