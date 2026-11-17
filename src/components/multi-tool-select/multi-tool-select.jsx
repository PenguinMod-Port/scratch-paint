import classNames from 'classnames';
import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import styles from './multi-tool-select.css';
import arrow from './arrow.svg';

class MultiToolSelectComponent extends React.Component {
    constructor(props) {
        super(props);
        this.indexCache = null;
    }

    render() {
        if (this.props.settingsStore && this.props.settingsStore.store.paintMultiTool === false){
            return (<React.Fragment>{this.props.tools}</React.Fragment>);
        }

        let index = this.props.modes.indexOf(this.props.mode);
        let isSelected = index !== -1;
        if (index === -1) index = this.indexCache ?? 0;
        else this.indexCache = index;

        return (<div className={classNames(styles.multiTool, {[styles.selected]: isSelected})} style={{"--index": index}}>
            <img alt="" className={styles.arrow} src={arrow} />
            <div className={styles.tools}>
                {this.props.tools.map(tool => <div className={styles.tool}>
                    {tool}
                </div>)}
            </div>
        </div>);
    }
}

MultiToolSelectComponent.propTypes = {
    tools: PropTypes.arrayOf(PropTypes.element).isRequired,
    modes: PropTypes.arrayOf(PropTypes.string).isRequired,
    mode: PropTypes.string.isRequired,
    settingsStore: PropTypes.object
};

const mapStateToProps = state => ({
    mode: state.scratchPaint.mode,
    settingsStore: state.scratchPaint.settingsStore
});

export default connect(
    mapStateToProps,
    _ => {}
)(MultiToolSelectComponent);