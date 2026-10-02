import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {FormattedMessage, defineMessages, injectIntl, intlShape} from 'react-intl';
import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import paper from '@turbowarp/paper';

import {getSelectedRootItems} from '../../helper/selection.js';

import PanelComponent from '../panel/panel.jsx';
import Panels from '../../lib/panels';

import Slider, {HANDLE_WIDTH, CONTAINER_WIDTH} from '../forms/slider.jsx';
import Select from '../forms/select.jsx';
import TWColorReadout from '../tw-color-readout/tw-color-readout.jsx';

import alphaBackground from './alpha.png';
import {makeAlphaComponent} from '../../lib/tw-color-utils';
import parseColor from 'parse-color';
const hsvToHex = (h, s, v) => parseColor(`hsv(${3.6 * h}, ${s}, ${v})`).hex;

import styles from './compositing-panel.css';

const messages = defineMessages({
    normal: {
        defaultMessage: 'normal',
        description: 'Normal blend mode',
        id: 'pm.paint.compositingPanel.blend.normal'
    },
    multiplicative: {
        defaultMessage: 'multiplicative',
        description: 'Multiplicative blend mode',
        id: 'pm.paint.compositingPanel.blend.multiplicative'
    },
    screen: {
        defaultMessage: 'Screen',
        description: 'Screen blend mode',
        id: 'pm.paint.compositingPanel.blend.screen'
    },
    overlay: {
        defaultMessage: 'Overlay',
        description: 'Overlay blend mode',
        id: 'pm.paint.compositingPanel.blend.overlay'
    },
    softLight: {
        defaultMessage: 'Soft Light',
        description: 'Soft light blend mode',
        id: 'pm.paint.compositingPanel.blend.softLight'
    },
    hardLight: {
        defaultMessage: 'Hard Light',
        description: 'Hard light blend mode',
        id: 'pm.paint.compositingPanel.blend.hardLight'
    },
    colorDodge: {
        defaultMessage: 'Color Dodge',
        description: 'Color dodge blend mode',
        id: 'pm.paint.compositingPanel.blend.colorDodge'
    },
    colorBurn: {
        defaultMessage: 'Color Burn',
        description: 'Color burn blend mode',
        id: 'pm.paint.compositingPanel.blend.colorBurn'
    },
    darken: {
        defaultMessage: 'Darken',
        description: 'Darken blend mode',
        id: 'pm.paint.compositingPanel.blend.darken'
    },
    lighten: {
        defaultMessage: 'Lighten',
        description: 'Lighten blend mode',
        id: 'pm.paint.compositingPanel.blend.lighten'
    },
    difference: {
        defaultMessage: 'Difference',
        description: 'Difference blend mode',
        id: 'pm.paint.compositingPanel.blend.difference'
    },
    exclusion: {
        defaultMessage: 'Exclusion',
        description: 'Exclusion blend mode',
        id: 'pm.paint.compositingPanel.blend.exclusion'
    },
    hue: {
        defaultMessage: 'Hue',
        description: 'Hue blend mode',
        id: 'pm.paint.compositingPanel.blend.hue'
    },
    saturation: {
        defaultMessage: 'Saturation',
        description: 'Saturation blend mode',
        id: 'pm.paint.compositingPanel.blend.saturation'
    },
    color: {
        defaultMessage: 'Color',
        description: 'Color blend mode',
        id: 'pm.paint.compositingPanel.blend.color'
    },
    luminosity: {
        defaultMessage: 'Luminosity',
        description: 'Luminosity blend mode',
        id: 'pm.paint.compositingPanel.blend.luminosity'
    }
});

class CompositingPanel extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'changeOpacity',
            'onSubmitOpacity',
            'setBlendMode'
        ]);

        this.opacityBackground = this._makeOpacityBackground();
    }
    
    _makeOpacityBackground() {
        const stops = [];
        // Generate the color slider background CSS gradients by adding
        // color stops depending on the slider.
        for (let n = 100; n >= 0; n -= 10) {
            const alpha = makeAlphaComponent(n / 100);
            stops.push(`#000000${alpha}`);
        }

        // The sliders are a rounded capsule shape, and the slider handles are circles. As a consequence, when the
        // slider handle is fully to one side, its center is actually moved away from the start/end of the slider by
        // the slider handle's radius, meaning that the effective range of the slider excludes the rounded caps.
        // To compensate for this, position the first stop to where the rounded cap ends, and position the last stop
        // to where the rounded cap begins.
        const halfHandleWidth = HANDLE_WIDTH / 2;
        stops[0] += ` 0 ${halfHandleWidth}px`;
        stops[stops.length - 1] += ` ${CONTAINER_WIDTH - halfHandleWidth}px 100%`;

        let css = `linear-gradient(to left, ${stops.join(',')}), url("${alphaBackground}")`;
        return css;
    }

    changeOpacity(value) {
        getSelectedRootItems().forEach(layer => {
            layer.setOpacity(value / 100)
        });

        this.forceUpdate();
    }

    onSubmitOpacity(value) {
        this.changeOpacity(value);
        this.props.onUpdateImage();
    }

    setBlendMode(event) {
        getSelectedRootItems().forEach(layer => {
            layer.setBlendMode(event.target.value)
        });

        this.props.onUpdateImage();
    }

    render () {
        return (
            <PanelComponent panel={Panels.COMPOSITING}>
                {paper.project && getSelectedRootItems().length > 0 && (<React.Fragment>
                    <div className={styles.row}>
                        <div className={styles.rowHeader}>
                            <span className={styles.labelName}>
                                <FormattedMessage
                                    defaultMessage="Blend Mode"
                                    description="Label for the blend mode component in the compositing panel"
                                    id="pm.paint.compositingPanel.blendMode"
                                />
                            </span>
                        </div>
                        <div>
                            <Select
                                className={styles.select}
                                value={getSelectedRootItems()[0].blendMode}
                                onChange={this.setBlendMode}
                                options={[
                                    [this.props.intl.formatMessage(messages.normal), 'normal'],
                                    [this.props.intl.formatMessage(messages.multiplicative), 'multiply'],
                                    [this.props.intl.formatMessage(messages.screen), 'screen'],
                                    [this.props.intl.formatMessage(messages.overlay), 'overlay'],
                                    [this.props.intl.formatMessage(messages.softLight), 'soft-light'],
                                    [this.props.intl.formatMessage(messages.hardLight), 'hard-light'],
                                    [this.props.intl.formatMessage(messages.colorDodge), 'color-dodge'],
                                    [this.props.intl.formatMessage(messages.colorBurn), 'color-burn'],
                                    [this.props.intl.formatMessage(messages.lighten), 'lighten'],
                                    [this.props.intl.formatMessage(messages.darken), 'darken'],
                                    [this.props.intl.formatMessage(messages.difference), 'difference'],
                                    [this.props.intl.formatMessage(messages.exclusion), 'exclusion'],
                                    [this.props.intl.formatMessage(messages.hue), 'hue'],
                                    [this.props.intl.formatMessage(messages.saturation), 'saturation'],
                                    [this.props.intl.formatMessage(messages.color), 'color'],
                                    [this.props.intl.formatMessage(messages.luminosity), 'luminosity'],
                                ]}
                            />
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.rowHeader}>
                            <span className={styles.labelName}>
                                <FormattedMessage
                                    defaultMessage="Opacity"
                                    description="Label for the opacity component in the compositing panel"
                                    id="pm.paint.compositingPanel.opacity"
                                />
                            </span>
                            <TWColorReadout
                                value={getSelectedRootItems()[0].opacity * 100}
                                onChange={this.onSubmit}
                            />
                        </div>
                        <div>
                            <Slider
                                background={this.opacityBackground}
                                value={getSelectedRootItems()[0].opacity * 100}
                                onChange={this.changeOpacity}
                                onSubmit={this.onSubmitOpacity}
                            />
                        </div>
                    </div>
                </React.Fragment>)}
            </PanelComponent>
        );
    }
}

CompositingPanel.propTypes = {
    onUpdateImage: PropTypes.func.isRequired,
    intl: intlShape
};

const mapStateToProps = state => ({

});
const mapDispatchToProps = dispatch => ({
    
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {pure: false}
)(CompositingPanel));
