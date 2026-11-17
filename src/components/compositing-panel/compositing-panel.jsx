import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {FormattedMessage, defineMessages, injectIntl, intlShape} from 'react-intl';
import bindAll from 'lodash.bindall';
import paper from '@turbowarp/paper';

import {getSelectedLeafItems} from '../../helper/selection.js';

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
        id: 'pm.paint.compositingPanel.blendMode.normal'
    },
    multiplicative: {
        defaultMessage: 'multiplicative',
        description: 'Multiplicative blend mode',
        id: 'pm.paint.compositingPanel.blendMode.multiplicative'
    },
    screen: {
        defaultMessage: 'screen',
        description: 'Screen blend mode',
        id: 'pm.paint.compositingPanel.blendMode.screen'
    },
    overlay: {
        defaultMessage: 'overlay',
        description: 'Overlay blend mode',
        id: 'pm.paint.compositingPanel.blendMode.overlay'
    },
    softLight: {
        defaultMessage: 'soft light',
        description: 'Soft light blend mode',
        id: 'pm.paint.compositingPanel.blendMode.softLight'
    },
    hardLight: {
        defaultMessage: 'hard light',
        description: 'Hard light blend mode',
        id: 'pm.paint.compositingPanel.blendMode.hardLight'
    },
    colorDodge: {
        defaultMessage: 'color dodge',
        description: 'Color dodge blend mode',
        id: 'pm.paint.compositingPanel.blendMode.colorDodge'
    },
    colorBurn: {
        defaultMessage: 'color burn',
        description: 'Color burn blend mode',
        id: 'pm.paint.compositingPanel.blendMode.colorBurn'
    },
    darken: {
        defaultMessage: 'darken',
        description: 'Darken blend mode',
        id: 'pm.paint.compositingPanel.blendMode.darken'
    },
    lighten: {
        defaultMessage: 'lighten',
        description: 'Lighten blend mode',
        id: 'pm.paint.compositingPanel.blendMode.lighten'
    },
    difference: {
        defaultMessage: 'difference',
        description: 'Difference blend mode',
        id: 'pm.paint.compositingPanel.blendMode.difference'
    },
    exclusion: {
        defaultMessage: 'exclusion',
        description: 'Exclusion blend mode',
        id: 'pm.paint.compositingPanel.blendMode.exclusion'
    },
    hue: {
        defaultMessage: 'hue',
        description: 'Hue blend mode',
        id: 'pm.paint.compositingPanel.blendMode.hue'
    },
    saturation: {
        defaultMessage: 'saturation',
        description: 'Saturation blend mode',
        id: 'pm.paint.compositingPanel.blendMode.saturation'
    },
    color: {
        defaultMessage: 'color',
        description: 'Color blend mode',
        id: 'pm.paint.compositingPanel.blendMode.color'
    },
    luminosity: {
        defaultMessage: 'luminosity',
        description: 'Luminosity blend mode',
        id: 'pm.paint.compositingPanel.blendMode.luminosity'
    },

    nonzero: {
        defaultMessage: 'non-zero',
        description: 'Non-zero fill rule',
        id: 'pm.paint.compositingPanel.fillRule.nonzero'
    },
    evenodd: {
        defaultMessage: 'even/odd',
        description: 'Even/odd fill rule',
        id: 'pm.paint.compositingPanel.fillRule.evenodd'
    }
});

class CompositingPanel extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'changeOpacity',
            'onSubmitOpacity',
            'setBlendMode',
            'setFillRule'
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
        getSelectedLeafItems().forEach(layer => {
            layer.setOpacity(value / 100)
        });

        this.forceUpdate();
    }

    onSubmitOpacity(value) {
        this.changeOpacity(value);
        this.props.onUpdateImage();
    }

    setBlendMode(event) {
        getSelectedLeafItems().forEach(layer => {
            layer.setBlendMode(event.target.value)
        });

        this.props.onUpdateImage();
    }

    setFillRule(event) {
        getSelectedLeafItems().forEach(layer => {
            layer.setFillRule(event.target.value)
        });

        this.props.onUpdateImage();
    }

    render () {
        const selectedLeafItems = paper.project ? getSelectedLeafItems() : [];
        return (
            <PanelComponent panel={Panels.COMPOSITING} disabled={selectedLeafItems.length === 0}>
                {paper.project && (<React.Fragment>
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
                                value={selectedLeafItems[0]?.opacity * 100 || 0}
                                onChange={this.onSubmitOpacity}
                            />
                        </div>
                        <div>
                            <Slider
                                background={this.opacityBackground}
                                value={selectedLeafItems[0]?.opacity * 100 || 0}
                                onChange={this.changeOpacity}
                                onSubmit={this.onSubmitOpacity}
                            />
                        </div>
                    </div>
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
                                value={selectedLeafItems[0]?.blendMode}
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
                                    defaultMessage="Fill Rule"
                                    description="Label for the fill rule component in the compositing panel"
                                    id="pm.paint.compositingPanel.fillRule"
                                />
                            </span>
                        </div>
                        <div>
                            <Select
                                className={styles.select}
                                value={selectedLeafItems[0]?.fillRule}
                                onChange={this.setFillRule}
                                options={[
                                    [this.props.intl.formatMessage(messages.nonzero), 'nonzero'],
                                    [this.props.intl.formatMessage(messages.evenodd), 'evenodd'],
                                ]}
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
