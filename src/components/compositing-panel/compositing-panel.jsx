import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import paper from '@turbowarp/paper';

import { getSelectedRootItems } from '../../helper/selection.js';

import PanelComponent from '../panel/panel.jsx';
import Panels from '../../lib/panels';

import Slider, {HANDLE_WIDTH, CONTAINER_WIDTH} from '../forms/slider.jsx';
import TWColorReadout from '../tw-color-readout/tw-color-readout.jsx';

import alphaBackground from './alpha.png';
import {makeAlphaComponent} from '../../lib/tw-color-utils';
import parseColor from 'parse-color';
const hsvToHex = (h, s, v) => parseColor(`hsv(${3.6 * h}, ${s}, ${v})`).hex;

import styles from './compositing-panel.css';

class CompositingPanel extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'changeOpacity',
            'onSubmit'
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
        console.log(css);
        return css;
    }

    changeOpacity(value) {
        getSelectedRootItems().forEach(layer => {
            layer.setOpacity(value / 100)
        });

        this.forceUpdate();
    }

    onSubmit(value) {
        this.changeOpacity(value);
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
                        <div className={styles.rowSlider}>
                            <Slider
                                background={this.opacityBackground}
                                value={getSelectedRootItems()[0].opacity * 100}
                                onChange={this.changeOpacity}
                                onSubmit={this.onSubmit}
                            />
                        </div>
                    </div>
                </React.Fragment>)}
            </PanelComponent>
        );
    }
}

CompositingPanel.propTypes = {
    onUpdateImage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({

});
const mapDispatchToProps = dispatch => ({
    
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {pure: false}
)(CompositingPanel);
