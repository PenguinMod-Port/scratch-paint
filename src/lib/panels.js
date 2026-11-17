import keyMirror from 'keymirror';

const panelsObj = {
    GEOMETRY: null,
    COMPOSITING: null,
    LAYERS: null,
};
const Panels = keyMirror(panelsObj);

export {
    Panels as default
}