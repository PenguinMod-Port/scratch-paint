import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classNames from 'classnames';

import styles from './panel.css';

const PanelComponent = ({
    children,
    ...props
}) => props.panel === props.currentPanel && (
    <div className={classNames(styles.panel, {[styles.disabled]: props.disabled})}>
        {children}
    </div>
);

PanelComponent.propTypes = {
    currentPanel: PropTypes.string,
    panel: PropTypes.string.isRequired,
    disabled: PropTypes.bool
};

const mapStateToProps = state => ({
    currentPanel: state.scratchPaint.panel,
});

export default connect(
    mapStateToProps,
    () => ({})
)(PanelComponent);