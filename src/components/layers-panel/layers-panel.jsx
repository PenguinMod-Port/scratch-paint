import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import paper from '@turbowarp/paper';
import {setSelectedItems} from '../../reducers/selected-items';
import {getSelectedLeafItems, setItemSelection} from '../../helper/selection';

import PanelComponent from '../panel/panel.jsx';
import Panels from '../../lib/panels';

import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import Input from '../forms/input.jsx';
const BufferedInput = BufferedInputHOC(Input);

import styles from './layers-panel.css';
import placeholderImage from '../rect-mode/rectangle.svg';

const messages = defineMessages({
    group: {
        defaultMessage: 'Group',
        description: 'Default name for the group layer',
        id: 'pm.paint.layersPanel.group'
    },
    path: {
        defaultMessage: 'Path',
        description: 'Default name for the path layer',
        id: 'pm.paint.layersPanel.path'
    },
    text: {
        defaultMessage: 'Text',
        description: 'Default name for the text layer',
        id: 'pm.paint.layersPanel.text'
    },
    bitmap: {
        defaultMessage: 'Bitmap',
        description: 'Default name for the bitmap layer',
        id: 'pm.paint.layersPanel.bitmap'
    },
});

const iconMap = new Map([
    ["CompoundPath", require('./icons/path.svg')],
    ["Group", require('./icons/group.svg')],
    ["Path", require('./icons/path.svg')],
    ["PointText", require('./icons/text.svg')],
    ["Raster", require('./icons/bitmap.svg')],
]);

const nameMap = new Map([
    ["CompoundPath", messages.path],
    ["Group", messages.group],
    ["Path", messages.path],
    ["PointText", messages.text],
    ["Raster", messages.bitmap],
]);

const hideChildren = new Set([
    "CompoundPath"
]);

class LayersPanel extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'isSelected',
            'renderLayer',
            'selectLayer',
            'setLayerName',
            'topLevelLayers'
        ]);
    }

    isSelected (layer) {
        if (this.props.selectedItems.includes(layer)) return true;
        const children = layer.getChildren();
        if (!children) return false;
        return children.every(this.isSelected);
    }

    renderLayer (layer) {
        let defaultName = nameMap.get(layer.className);
        defaultName = defaultName ? this.props.intl.formatMessage(defaultName) : layer.className;

        return (<div key={layer.id} className={classNames(styles.layer, {[styles.active]: this.isSelected(layer)})}>
            <div className={styles.info} onClick={(e) => this.selectLayer(layer, e)}>
                <img alt="" src={iconMap.get(layer.className) ?? placeholderImage} />
                <BufferedInput
                    type="text"
                    placeholder={defaultName}
                    value={layer.name}
                    onSubmit={name => this.setLayerName(layer, name)}
                />
            </div>
            {!hideChildren.has(layer.className) && (layer.getChildren() || []).toReversed().map(this.renderLayer)}
        </div>);
    }

    selectLayer (layer, event) {
        let alreadySelected = paper.project.selectedItems.includes(layer);
        if (!event.ctrlKey) paper.project.deselectAll();
        setItemSelection(layer, !alreadySelected);
        this.props.setSelectedItems();
    }

    setLayerName (layer, name) {
        if (layer.name === name) return;
        layer.name = name;
        this.props.onUpdateImage();
    }

    topLevelLayers () {
        let layers = paper.project.getActiveLayer().getChildren();
        layers = layers.filter(v => !v.guide);
        return layers;
    }

    render () {
        return (
            <PanelComponent panel={Panels.LAYERS}>
                {paper.project && this.topLevelLayers().toReversed().map(this.renderLayer)}
            </PanelComponent>
        );
    }
}

LayersPanel.propTypes = {
    intl: intlShape,
    onUpdateImage: PropTypes.func.isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.instanceOf(paper.Item)),
    setSelectedItems: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    selectedItems: state.scratchPaint.selectedItems,
});
const mapDispatchToProps = dispatch => ({
    setSelectedItems: () => {
        dispatch(setSelectedItems(getSelectedLeafItems(), false));
    }
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {pure: false}
)(LayersPanel));
