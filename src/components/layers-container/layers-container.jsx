import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import paper from '@turbowarp/paper';
import {setSelectedItems} from '../../reducers/selected-items';
import {getSelectedLeafItems, setItemSelection} from '../../helper/selection';

import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import Input from '../forms/input.jsx';
const BufferedInput = BufferedInputHOC(Input);

import styles from './layers-container.css';
import placeholderImage from '../rect-mode/rectangle.svg';

const iconMap = new Map([
    ["Group", require('./icons/group.svg')],
    ["Path", require('./icons/path.svg')],
    ["PointText", require('./icons/text.svg')],
    ["Raster", require('./icons/bitmap.svg')]
])

const nameMap = new Map([
    ["PointText", "Text"],
    ["Raster", "Bitmap"]
])

class LayersContainer extends React.Component {
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
        return (<div key={layer.id} className={classNames(styles.layer, {[styles.active]: this.isSelected(layer)})}>
            <div className={styles.info} onClick={(e) => this.selectLayer(layer, e)}>
                <img alt="" src={iconMap.get(layer.className) ?? placeholderImage} />
                <BufferedInput
                    type="text"
                    placeholder={nameMap.get(layer.className) ?? layer.className}
                    value={layer.name}
                    onSubmit={e => this.setLayerName(layer, e.target.value)}
                />
            </div>
            {(layer.getChildren() || []).toReversed().map(this.renderLayer)}
        </div>);
    }

    selectLayer (layer, event) {
        let alreadySelected = paper.project.selectedItems.includes(layer);
        if (!event.ctrlKey) paper.project.deselectAll();
        setItemSelection(layer, !alreadySelected);
        this.props.setSelectedItems();
    }

    setLayerName (layer, name) {
        layer.name = name;
    }

    topLevelLayers () {
        let layers = paper.project.getActiveLayer().getChildren();
        layers = layers.filter(v => !v.guide);
        return layers;
    }

    render () {
        return (
            <div className={styles.layersContainer}>
                {paper.project && this.topLevelLayers().toReversed().map(this.renderLayer)}
            </div>
        );
    }
}

LayersContainer.propTypes = {
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

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {pure: false}
)(LayersContainer);
