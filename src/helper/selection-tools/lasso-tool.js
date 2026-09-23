import Modes from '../../lib/modes';

import {getHoveredItem} from '../hover';
import {selectRootItem} from '../selection';
import BoundingBoxTool from './bounding-box-tool';
import NudgeTool from './nudge-tool';
import SelectionLassoTool from './selection-lasso-tool';
import paper from '@turbowarp/paper';

/**
 * paper.Tool that handles select mode. This is made up of 2 subtools.
 * - The selection box tool is active when the user clicks an empty space and drags.
 *   It selects all items in the rectangle.
 * - The bounding box tool is active if the user clicks on a non-empty space. It handles
 *   reshaping the item that was clicked.
 */
class LassoTool extends paper.Tool {
    /** The distance within which mouse events count as a hit against an item */
    static get TOLERANCE () {
        return 2;
    }

    static get MIN_DISTANCE () {
        return 5;
    }

    /**
     * @param {function} setHoveredItem Callback to set the hovered item
     * @param {function} clearHoveredItem Callback to clear the hovered item
     * @param {function} setSelectedItems Callback to set the set of selected items in the Redux state
     * @param {function} clearSelectedItems Callback to clear the set of selected items in the Redux state
     * @param {function} setCursor Callback to set the visible mouse cursor
     * @param {!function} onUpdateImage A callback to call when the image visibly changes
     * @param {!function} switchToTextTool A callback to call to switch to the text tool
     */
    constructor (setHoveredItem, clearHoveredItem, setSelectedItems, clearSelectedItems, setCursor, onUpdateImage,
        switchToTextTool) {
        super();
        this.setHoveredItem = setHoveredItem;
        this.clearHoveredItem = clearHoveredItem;
        this.onUpdateImage = onUpdateImage;
        this.boundingBoxTool = new BoundingBoxTool(
            Modes.LASSO,
            setSelectedItems,
            clearSelectedItems,
            setCursor,
            onUpdateImage,
            switchToTextTool
        );
        const nudgeTool = new NudgeTool(Modes.LASSO, this.boundingBoxTool, onUpdateImage);
        this.selectionLassoTool = new SelectionLassoTool(Modes.LASSO, setSelectedItems, clearSelectedItems, LassoTool.MIN_DISTANCE);
        this.selectionLassoMode = false;
        this.prevHoveredItemId = null;
        this.active = false;

        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseMove = this.handleMouseMove;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;
        this.onKeyUp = nudgeTool.onKeyUp;
        this.onKeyDown = nudgeTool.onKeyDown;

        selectRootItem();
        setSelectedItems();
        this.boundingBoxTool.setSelectionBounds();
    }
    /**
     * To be called when the hovered item changes. When the select tool hovers over a
     * new item, it compares against this to see if a hover item change event needs to
     * be fired.
     * @param {paper.Item} prevHoveredItemId ID of the highlight item that indicates the mouse is
     *     over a given item currently
     */
    setPrevHoveredItemId (prevHoveredItemId) {
        this.prevHoveredItemId = prevHoveredItemId;
    }
    /**
     * Should be called if the selection changes to update the bounds of the bounding box.
     * @param {Array<paper.Item>} selectedItems Array of selected items.
     */
    onSelectionChanged (selectedItems) {
        this.boundingBoxTool.onSelectionChanged(selectedItems);
    }
    /**
     * Returns the hit options to use when conducting hit tests.
     * @param {boolean} preselectedOnly True if we should only return results that are already
     *     selected.
     * @return {object} See paper.Item.hitTest for definition of options
     */
    getHitOptions (preselectedOnly) {
        // Tolerance needs to be scaled when the view is zoomed in in order to represent the same
        // distance for the user to move the mouse.
        const hitOptions = {
            segments: true,
            stroke: true,
            curves: true,
            fill: true,
            guide: false,
            tolerance: LassoTool.TOLERANCE / paper.view.zoom,
            match: hitResult => {
                // Don't match helper items, unless they are handles.
                if (!hitResult.item.data || !hitResult.item.data.isHelperItem) return true;
                return hitResult.item.data.isScaleHandle || hitResult.item.data.isRotHandle || hitResult.item.data.isPivotAnchor;
            }
        };
        if (preselectedOnly) {
            hitOptions.selected = true;
        }
        return hitOptions;
    }
    handleMouseDown (event) {
        if (event.event.button > 0) return; // only first mouse button
        this.active = true;
        this.clearHoveredItem();

        // If bounding box tool does not find an item that was hit, use selection box tool.
        if (!this.boundingBoxTool
            .onMouseDown(
                event,
                event.modifiers.alt,
                event.modifiers.shift,
                false,
                this.getHitOptions(false /* preseelectedOnly */))) {
            this.selectionLassoMode = true;
            this.selectionLassoTool.onMouseDown(event, event.modifiers.shift);
        }
    }
    handleMouseMove (event) {
        const hoveredItem = getHoveredItem(event, this.getHitOptions());
        if ((!hoveredItem && this.prevHoveredItemId) || // There is no longer a hovered item
                (hoveredItem && !this.prevHoveredItemId) || // There is now a hovered item
                (hoveredItem && this.prevHoveredItemId &&
                    hoveredItem.id !== this.prevHoveredItemId)) { // hovered item changed
            this.setHoveredItem(hoveredItem ? hoveredItem.id : null);
        }

        if (!this.selectionLassoMode) {
            this.boundingBoxTool.onMouseMove(event, this.getHitOptions(false));
        }
    }
    handleMouseDrag (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.selectionLassoMode) {
            this.selectionLassoTool.onMouseDrag(event);
        } else {
            this.boundingBoxTool.onMouseDrag(event);
        }
    }
    handleMouseUp (event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.selectionLassoMode) {
            this.selectionLassoTool.onMouseUpVector(event);
        } else {
            this.boundingBoxTool.onMouseUp(event, this.getHitOptions(false));
        }
        this.selectionLassoMode = false;
        this.active = false;
    }
    deactivateTool () {
        this.clearHoveredItem();
        this.boundingBoxTool.deactivateTool();
        this.setHoveredItem = null;
        this.clearHoveredItem = null;
        this.onUpdateImage = null;
        this.boundingBoxTool = null;
        this.selectionLassoTool = null;
    }
}

export default LassoTool;
