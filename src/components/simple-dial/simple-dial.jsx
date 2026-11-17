import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import React from 'react';
import {getEventXY} from '../../lib/touch-utils';

import styles from './simple-dial.css';

class Dial extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleMouseDown',
            'handleMouseMove',
            'containerRef',
            'unbindMouseEvents'
        ]);
    }

    componentDidMount () {
        // Manually add touch/mouse handlers so that preventDefault can be used
        // to prevent scrolling on touch.
        // Tracked as a react issue https://github.com/facebook/react/issues/6436
        this.containerElement.addEventListener('mousedown', this.handleMouseDown);
        this.containerElement.addEventListener('touchstart', this.handleMouseDown);
    }

    componentWillUnmount () {
        this.unbindMouseEvents();
        this.containerElement.removeEventListener('mousedown', this.handleMouseDown);
        this.containerElement.removeEventListener('touchstart', this.handleMouseDown);
    }

    /**
     * Get direction from dial center to mouse move event.
     * @param {Event} e - Mouse move event.
     * @returns {number} Direction in degrees, clockwise, 90=horizontal.
     */
    directionToMouseEvent (e) {
        const {x: mx, y: my} = getEventXY(e);
        const bbox = this.containerElement.getBoundingClientRect();
        const cy = bbox.top + (bbox.height / 2);
        const cx = bbox.left + (bbox.width / 2);
        const angle = Math.atan2(my - cy, mx - cx);
        let degrees = angle * (180 / Math.PI);
        if (e.shiftKey) degrees = Math.round(degrees / 45) * 45;
        return (degrees + 270) % 360 - 180; // To correspond with scratch coordinate system
    }

    /**
     * Create SVG path data string for the dial "gauge", the overlaid arc slice.
     * @param {number} radius - The radius of the dial.
     * @param {number} direction - Direction in degrees, clockwise, 90=horizontal.
     * @returns {string} Path data string for the gauge.
     */
    gaugePath (radius, direction) {
        direction = ((direction + 180) % 360 + 360) % 360 - 180;
        const rads = (direction) * (Math.PI / 180);
        const path = [];
        path.push(`M ${radius} ${radius}`);
        path.push(`L ${radius + (radius * Math.sin(rads))} ${radius - (radius * Math.cos(rads))}`);
        return path.join(' ');
    }

    handleMouseMove (e) {
        this.props.onChange(this.directionToMouseEvent(e));
        e.preventDefault();
    }

    unbindMouseEvents () {
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.unbindMouseEvents);
        window.removeEventListener('touchmove', this.handleMouseMove);
        window.removeEventListener('touchend', this.unbindMouseEvents);
    }

    handleMouseDown (e) {
        // Because the drag handle is not a single point, there is some initial
        // difference between the current sprite direction and the direction to the mouse
        // Store this offset to prevent jumping when the mouse is moved.
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.unbindMouseEvents);
        window.addEventListener('touchmove', this.handleMouseMove);
        window.addEventListener('touchend', this.unbindMouseEvents);
        this.props.onChange(this.directionToMouseEvent(e));
        e.preventDefault();
    }

    containerRef (el) {
        this.containerElement = el;
    }

    render () {
        const {direction, radius} = this.props;
        return (
            <div className={styles.container}>
                <div
                    className={styles.dialContainer}
                    ref={this.containerRef}
                    style={{
                        width: `${radius * 2}px`,
                        height: `${radius * 2}px`
                    }}
                >
                    <svg
                        className={styles.gauge}
                        height={radius * 2}
                        width={radius * 2}
                    >
                        <path
                            className={styles.gaugePath}
                            d={this.gaugePath(radius, direction)}
                        />
                    </svg>
                </div>
            </div>
        );
    }
}

Dial.propTypes = {
    direction: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    radius: PropTypes.number
};

Dial.defaultProps = {
    direction: 90, // degrees
    radius: 8 // px
};

export default Dial;