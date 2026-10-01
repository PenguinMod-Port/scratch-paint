/* DO NOT EDIT
@todo This file is copied from GUI and should be pulled out into a shared library.
See https://github.com/LLK/scratch-paint/issues/13 */

/* NOTE:
Edited to add range prop
*/

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import styles from './select.css';

const Input = props => {
    return (
        <select
            {...props}
            className={classNames(
                styles.select,
                props.className
            )}
        >
            {props.options.map(v => <option className={styles.option} value={v[1]}>
                {v[0]}
            </option>)}
        </select>
    );
};

Input.propTypes = {
    className: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.array)
};

export default Input;
