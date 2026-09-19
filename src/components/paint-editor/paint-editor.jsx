import paper from '@turbowarp/paper';
import classNames from 'classnames';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';

import PaperCanvas from '../../containers/paper-canvas.jsx';
import ScrollableCanvas from '../../containers/scrollable-canvas.jsx';

import BitBrushMode from '../../containers/bit-brush-mode.jsx';
import BitLineMode from '../../containers/bit-line-mode.jsx';
import BitOvalMode from '../../containers/bit-oval-mode.jsx';
import BitRectMode from '../../containers/bit-rect-mode.jsx';
import BitFillMode from '../../containers/bit-fill-mode.jsx';
import BitEraserMode from '../../containers/bit-eraser-mode.jsx';
import BitSelectMode from '../../containers/bit-select-mode.jsx';
import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import ButtonGroup from '../button-group/button-group.jsx';
import BrushMode from '../../containers/brush-mode.jsx';
import EraserMode from '../../containers/eraser-mode.jsx';
import FillColorIndicatorComponent from '../../containers/fill-color-indicator.jsx';
import FillMode from '../../containers/fill-mode.jsx';
import InputGroup from '../input-group/input-group.jsx';
import LineMode from '../../containers/line-mode.jsx';
import Loupe from '../loupe/loupe.jsx';
import FixedToolsContainer from '../../containers/fixed-tools.jsx';
import ModeToolsContainer from '../../containers/mode-tools.jsx';
import OvalMode from '../../containers/oval-mode.jsx';
import RectMode from '../../containers/rect-mode.jsx';
import ReshapeMode from '../../containers/reshape-mode.jsx';
import SelectMode from '../../containers/select-mode.jsx';
import LassoMode from '../../containers/lasso-mode.jsx';
import BitLassoMode from '../../containers/bit-lasso-mode.jsx';
import PanMode from '../../containers/pan-mode.jsx';
import BitPanMode from '../../containers/bit-pan-mode.jsx';
import FreeformMode from '../../containers/freeform-mode.jsx';
import StrokeColorIndicatorComponent from '../../containers/stroke-color-indicator.jsx';
import StrokeWidthIndicatorComponent from '../../containers/stroke-width-indicator.jsx';
import TextMode from '../../containers/text-mode.jsx';

import Formats, {isBitmap, isVector} from '../../lib/format';
import styles from './paint-editor.css';

import bitmapIcon from './icons/bitmap.svg';
import zoomInIcon from './icons/zoom-in.svg';
import zoomOutIcon from './icons/zoom-out.svg';
import zoomResetIcon from './icons/zoom-reset.svg';
import themeIcon from './icons/theme.svg';
import fullscreenIcon from './icons/fullscreen.svg';
import unfullscreenIcon from './icons/unfullscreen.svg';

import MultiToolSelectComponent from '../multi-tool-select/multi-tool-select.jsx';
import Modes from '../../lib/modes';

const messages = defineMessages({
    bitmap: {
        defaultMessage: 'Convert to Bitmap',
        description: 'Label for button that converts the paint editor to bitmap mode',
        id: 'paint.paintEditor.bitmap'
    },
    vector: {
        defaultMessage: 'Convert to Vector',
        description: 'Label for button that converts the paint editor to vector mode',
        id: 'paint.paintEditor.vector'
    }
});

const PaintEditorComponent = props => (
    <div
        ref={props.containerRef}
        className={styles.editorContainer}
        dir={props.rtl ? 'rtl' : 'ltr'}
        data-paint-theme={props.theme}
    >
        {props.canvas !== null ? ( // eslint-disable-line no-negated-condition
            <div className={styles.editorContainerTop}>
                {/* First row */}
                <div className={styles.row}>
                    <FixedToolsContainer
                        canRedo={props.canRedo}
                        canUndo={props.canUndo}
                        name={props.name}
                        onRedo={props.onRedo}
                        onUndo={props.onUndo}
                        onUpdateImage={props.onUpdateImage}
                        onUpdateName={props.onUpdateName}
                        width={props.width}
                    />
                    <Button
                        className={styles.fullscreenButton}
                        onClick={props.onToggleFullscreen}
                    >
                        <img src={fullscreenIcon} />
                    </Button>
                </div>
                {/* Second Row */}
                {isVector(props.format) ?
                    <div className={styles.row}>
                        <InputGroup
                            className={classNames(
                                styles.row,
                                styles.modDashedBorder,
                                styles.modLabeledIconHeight
                            )}
                        >
                            {/* fill */}
                            <FillColorIndicatorComponent
                                className={styles.modMarginAfter}
                                onUpdateImage={props.onUpdateImage}
                            />
                            {/* stroke */}
                            <StrokeColorIndicatorComponent
                                onUpdateImage={props.onUpdateImage}
                            />
                            {/* stroke width */}
                            <StrokeWidthIndicatorComponent
                                onUpdateImage={props.onUpdateImage}
                            />
                        </InputGroup>
                        <InputGroup className={styles.modModeTools}>
                            <ModeToolsContainer
                                onUpdateImage={props.onUpdateImage}
                                onManageFonts={props.onManageFonts}
                            />
                        </InputGroup>
                    </div> :
                    isBitmap(props.format) ?
                        <div className={styles.row}>
                            <InputGroup
                                className={classNames(
                                    styles.row,
                                    styles.modDashedBorder,
                                    styles.modLabeledIconHeight
                                )}
                            >
                                {/* fill */}
                                <FillColorIndicatorComponent
                                    className={styles.modMarginAfter}
                                    onUpdateImage={props.onUpdateImage}
                                />
                            </InputGroup>
                            <InputGroup className={styles.modModeTools}>
                                <ModeToolsContainer
                                    onUpdateImage={props.onUpdateImage}
                                    onManageFonts={props.onManageFonts}
                                />
                            </InputGroup>
                        </div> : null
                }
            </div>
        ) : null}

        <div className={styles.topAlignRow}>
            {/* Modes */}
            {props.canvas !== null && isVector(props.format) ? ( // eslint-disable-line no-negated-condition
                <div className={styles.modeSelector}>
                    <MultiToolSelectComponent
                        tools={[
                            <SelectMode
                                onUpdateImage={props.onUpdateImage}
                            />,
                            <LassoMode
                                onUpdateImage={props.onUpdateImage}
                            />,
                            <ReshapeMode
                                onUpdateImage={props.onUpdateImage}
                            />
                        ]}
                        modes={[
                            Modes.SELECT,
                            Modes.LASSO,
                            Modes.RESHAPE
                        ]}
                    />
                    <PanMode />
                    <BrushMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <EraserMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <FillMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <TextMode
                        textArea={props.textArea}
                        onUpdateImage={props.onUpdateImage}
                    />
                    <MultiToolSelectComponent
                        tools={[
                            <LineMode
                                onUpdateImage={props.onUpdateImage}
                            />,
                            <FreeformMode
                                onUpdateImage={props.onUpdateImage}
                            />
                        ]}
                        modes={[
                            Modes.LINE,
                            Modes.FREEFORM
                        ]}
                    />
                    <MultiToolSelectComponent
                        tools={[
                            <RectMode
                                onUpdateImage={props.onUpdateImage}
                            />,
                            <OvalMode
                                onUpdateImage={props.onUpdateImage}
                            />
                        ]}
                        modes={[
                            Modes.RECT,
                            Modes.OVAL
                        ]}
                    />
                </div>
            ) : null}

            {props.canvas !== null && isBitmap(props.format) ? ( // eslint-disable-line no-negated-condition
                <div className={styles.modeSelector}>
                    <MultiToolSelectComponent
                        tools={[
                            <BitSelectMode
                                onUpdateImage={props.onUpdateImage}
                            />,
                            <BitLassoMode
                                onUpdateImage={props.onUpdateImage}
                            />
                        ]}
                        modes={[
                            Modes.BIT_SELECT,
                            Modes.BIT_LASSO
                        ]}
                    />
                    <BitPanMode />
                    <BitBrushMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <BitEraserMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <BitFillMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <TextMode
                        isBitmap
                        textArea={props.textArea}
                        onUpdateImage={props.onUpdateImage}
                    />
                    <BitLineMode
                        onUpdateImage={props.onUpdateImage}
                    />
                    <MultiToolSelectComponent
                        tools={[
                            <BitRectMode
                                onUpdateImage={props.onUpdateImage}
                            />,
                            <BitOvalMode
                                onUpdateImage={props.onUpdateImage}
                            />
                        ]}
                        modes={[
                            Modes.BIT_RECT,
                            Modes.BIT_OVAL
                        ]}
                    />
                </div>
            ) : null}

            <div className={styles.controlsContainer}>
                {/* Canvas */}
                <ScrollableCanvas
                    canvas={props.canvas}
                    hideScrollbars={props.isEyeDropping}
                    style={styles.canvasContainer}
                >
                    <PaperCanvas
                        canvasRef={props.setCanvas}
                        image={props.image}
                        imageFormat={props.imageFormat}
                        imageId={props.imageId}
                        rotationCenterX={props.rotationCenterX}
                        rotationCenterY={props.rotationCenterY}
                        theme={props.theme}
                        zoomLevelId={props.zoomLevelId}
                        onUpdateImage={props.onUpdateImage}
                    />
                    <textarea
                        className={styles.textArea}
                        ref={props.setTextArea}
                        spellCheck={false}
                    />
                    {props.isEyeDropping &&
                        props.colorInfo !== null &&
                        !props.colorInfo.hideLoupe ? (
                            <Box className={styles.colorPickerWrapper}>
                                <Loupe
                                    colorInfo={props.colorInfo}
                                    pixelRatio={paper.project.view.pixelRatio}
                                    theme={props.theme}
                                />
                            </Box>
                        ) : null
                    }
                </ScrollableCanvas>
                <div className={styles.canvasControls}>
                    {isVector(props.format) ?
                        <Button
                            className={styles.bitmapButton}
                            onClick={props.onSwitchToBitmap}
                        >
                            <img
                                className={styles.bitmapButtonIcon}
                                draggable={false}
                                src={bitmapIcon}
                            />
                            <span className={styles.buttonText}>
                                {props.intl.formatMessage(messages.bitmap)}
                            </span>
                        </Button> :
                        isBitmap(props.format) ?
                            <Button
                                className={styles.bitmapButton}
                                onClick={props.onSwitchToVector}
                            >
                                <img
                                    className={styles.bitmapButtonIcon}
                                    draggable={false}
                                    src={bitmapIcon}
                                />
                                <span className={styles.buttonText}>
                                    {props.intl.formatMessage(messages.vector)}
                                </span>
                            </Button> : null
                    }
                    {/* Zoom controls */}
                    <InputGroup className={styles.zoomControls}>
                        <ButtonGroup>
                            <Button
                                className={styles.buttonGroupButton}
                                onClick={props.onZoomOut}
                            >
                                <img
                                    alt="Zoom Out"
                                    className={styles.buttonGroupButtonIcon}
                                    draggable={false}
                                    src={zoomOutIcon}
                                />
                            </Button>
                            <Button
                                className={styles.buttonGroupButton}
                                onClick={props.onZoomReset}
                            >
                                <img
                                    alt="Zoom Reset"
                                    className={styles.buttonGroupButtonIcon}
                                    draggable={false}
                                    src={zoomResetIcon}
                                />
                            </Button>
                            <Button
                                className={styles.buttonGroupButton}
                                onClick={props.onZoomIn}
                            >
                                <img
                                    alt="Zoom In"
                                    className={styles.buttonGroupButtonIcon}
                                    draggable={false}
                                    src={zoomInIcon}
                                />
                            </Button>
                            <span style={{ paddingTop: "0.55rem" }} className={styles.buttonGroupButton}>{paper.project ? Math.round(paper.project.view.zoom * 200) : 100}%</span>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button
                                className={styles.buttonGroupButton}
                                onClick={props.onChangeTheme}
                            >
                                <img
                                    alt="Change theme"
                                    className={styles.buttonGroupButtonIcon}
                                    draggable={false}
                                    src={themeIcon}
                                />
                            </Button>
                        </ButtonGroup>
                    </InputGroup>
                </div>
            </div>
        </div>
    </div>
);

PaintEditorComponent.propTypes = {
    canRedo: PropTypes.func.isRequired,
    canUndo: PropTypes.func.isRequired,
    canvas: PropTypes.instanceOf(Element),
    colorInfo: Loupe.propTypes.colorInfo,
    format: PropTypes.oneOf(Object.keys(Formats)),
    image: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(HTMLImageElement)
    ]),
    imageFormat: PropTypes.string,
    imageId: PropTypes.string,
    intl: intlShape,
    isEyeDropping: PropTypes.bool,
    name: PropTypes.string,
    onChangeTheme: PropTypes.func.isRequired,
    onManageFonts: PropTypes.func,
    onRedo: PropTypes.func.isRequired,
    onSwitchToBitmap: PropTypes.func.isRequired,
    onSwitchToVector: PropTypes.func.isRequired,
    onToggleFullscreen: PropTypes.func.isRequired,
    onUndo: PropTypes.func.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    onUpdateName: PropTypes.func.isRequired,
    onZoomIn: PropTypes.func.isRequired,
    onZoomOut: PropTypes.func.isRequired,
    onZoomReset: PropTypes.func.isRequired,
    rotationCenterX: PropTypes.number,
    rotationCenterY: PropTypes.number,
    rtl: PropTypes.bool,
    setCanvas: PropTypes.func.isRequired,
    setTextArea: PropTypes.func.isRequired,
    textArea: PropTypes.instanceOf(Element),
    theme: PropTypes.string,
    width: PropTypes.number,
    zoomLevelId: PropTypes.string
};

export default injectIntl(PaintEditorComponent);
