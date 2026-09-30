import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import styles from './panel.css';

const PanelComponent = ({
    children,
    ...props
}) => props.panel === props.currentPanel && (
    <div className={styles.panel}>
        {children}
    </div>
);

PanelComponent.propTypes = {
    currentPanel: PropTypes.string,
    panel: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    currentPanel: state.scratchPaint.panel,
});

export default connect(
    mapStateToProps,
    () => ({})
)(PanelComponent);