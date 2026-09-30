import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl, intlShape} from 'react-intl';
import {connect} from 'react-redux';

import Button from '../button/button.jsx';
import {changePanel} from '../../reducers/panels.js';

import styles from './panel-select-base.css';

const PanelSelectComponent = props => (
    <Button
        className={
            classNames(props.className, styles.modToolSelect, {
                [styles.isSelected]: props.currentPanel === props.panel
            })
        }
        disabled={props.disabled}
        title={props.intl.formatMessage(props.imgDescriptor)}
        onClick={() => props.setPanel(props.currentPanel === props.panel ? null : props.panel)}
    >
        <img
            alt={props.intl.formatMessage(props.imgDescriptor)}
            className={styles.toolSelectIcon}
            draggable={false}
            src={props.imgSrc}
        />
    </Button>
);

PanelSelectComponent.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    imgDescriptor: PropTypes.shape({
        defaultMessage: PropTypes.string,
        description: PropTypes.string,
        id: PropTypes.string
    }).isRequired,
    imgSrc: PropTypes.string.isRequired,
    intl: intlShape.isRequired,

    currentPanel: PropTypes.string,
    panel: PropTypes.string.isRequired,
    setPanel: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    currentPanel: state.scratchPaint.panel,

});
const mapDispatchToProps = dispatch => ({
    setPanel: panel => {
        dispatch(changePanel(panel));

        // resize canvas properly
        window.dispatchEvent(new Event('resize'));
    }
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(PanelSelectComponent));
