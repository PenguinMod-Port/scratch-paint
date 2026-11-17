import paper from '@turbowarp/paper';
import {styleShape} from '../style-path';
import {endPointHit, touching} from '../snapping';
import {drawHitPoint, removeHitPoint} from '../guides';

/**
 * Tool to handle freehand drawing of lines.
 */
class FreeformTool extends paper.Tool {
    static get SNAP_TOLERANCE () {
        return 5;
    }
    
    /**
     * @param {function} clearSelectedItems Callback to clear the set of selected items in the Redux state
     * @param {!function} onUpdateImage A callback to call when the image visibly changes
     */
    constructor (clearSelectedItems, onUpdateImage) {
        super();
        this.clearSelectedItems = clearSelectedItems;
        this.onUpdateImage = onUpdateImage;

        this.colorState = null;
        this.path = null;
        this.hitResult = null;

        // Piece of whole path that was added by last stroke. Used to smooth just the added part.
        this.subpath = null;
        this.subpathIndex = 0;

        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseMove = this.handleMouseMove;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;

        this.fixedDistance = 2;
        /** Smaller numbers match the line more closely, larger numbers for smoother curves */
        this.simplifySize = 2;

        /** Whether the outline is empty */
        // For lasso fill art where you might draw a lot of these over each other
        this.fillOnly = false;
    }
    setColorState (colorState) {
        this.colorState = colorState;
    }
    setSimplifySize (simplifySize) {
        this.simplifySize = simplifySize;
    }
    drawHitPoint (hitResult) {
        // If near another path's endpoint, draw hit point to indicate that paths would merge
        if (hitResult) {
            const hitPath = hitResult.path;
            if (hitResult.isFirst) {
                drawHitPoint(hitPath.firstSegment.point);
            } else {
                drawHitPoint(hitPath.lastSegment.point);
            }
        }
    }
    handleMouseDown (event) {
        this.fillOnly = this.colorState.strokeWidth == 0;
        if (event.event.button > 0) return; // only first mouse button
        this.subpath = new paper.Path({insert: false});
        this.subpath.strokeCap = 'round';

        // If you click near a point, continue that line instead of making a new line
        this.hitResult = endPointHit(event.point, FreeformTool.SNAP_TOLERANCE);
        if (!this.fillOnly && this.hitResult) {
            this.path = this.hitResult.path;
            styleShape(this.path, {
                fillColor: this.colorState.fillColor,
                strokeColor: this.colorState.strokeColor,
                strokeWidth: this.colorState.strokeWidth
            });
            if (this.hitResult.isFirst) {
                this.path.reverse();
            }
            this.subpathIndex = this.path.segments.length;
            this.path.lastSegment.handleOut = null; // Don't interfere with the curvature of the existing path
            this.path.lastSegment.handleIn = null;
            return;
        }

        // If not near other path, start a new path
        this.path = new paper.Path();
        styleShape(this.path, {
            fillColor: this.colorState.fillColor,
            strokeColor: this.colorState.strokeColor,
            strokeWidth: this.colorState.strokeWidth
        });
        this.path.strokeCap = 'round';
        this.path.add(event.point);
        this.subpath.add(event.point);
        paper.view.draw();
    }
    handleMouseMove (event) {
        this.fillOnly = this.colorState.strokeWidth == 0;
        if(this.fillOnly) return;
        
        // If near another path's endpoint, or this path's beginpoint, clip to it to suggest
        // joining/closing the paths.
        if (this.hitResult) {
            removeHitPoint();
        }
        this.hitResult = endPointHit(event.point, FreeformTool.SNAP_TOLERANCE);
        this.drawHitPoint(this.hitResult);
    }
    handleMouseDrag (event) {
        this.fillOnly = this.colorState.strokeWidth == 0;
        if (event.event.button > 0) return; // only first mouse button

        if(!this.fillOnly) {
            // If near another path's endpoint, or this path's beginpoint, highlight it to suggest
            // joining/closing the paths.
            if (this.hitResult) {
                removeHitPoint();
                this.hitResult = null;
            }
    
            if (this.path &&
                    !this.path.closed &&
                    this.path.segments.length > 3 &&
                    touching(this.path.firstSegment.point, event.point, FreeformTool.SNAP_TOLERANCE)) {
                this.hitResult = {
                    path: this.path,
                    segment: this.path.firstSegment,
                    isFirst: true
                };
            } else {
                this.hitResult = endPointHit(event.point, FreeformTool.SNAP_TOLERANCE, this.path);
            }
            if (this.hitResult) {
                this.drawHitPoint(this.hitResult);
            }
        }
        
        this.path.add(event.point);
        this.subpath.add(event.point);
    }
    handleMouseUp (event) {
        if (event.event.button > 0) return; // only first mouse button
        
        // If I single clicked, don't do anything
        if (!this.hitResult && // Might be connecting 2 points that are very close
                (this.path.segments.length < 2 ||
                    (this.path.segments.length === 2 &&
                    touching(this.path.firstSegment.point, event.point, FreeformTool.SNAP_TOLERANCE)))) {
            this.path.remove();
            this.path = null;
            return;
        }

        // Smooth only the added portion
        const hasStartConnection = this.subpathIndex > 0;
        const hasEndConnection = !!this.hitResult;
        this.path.removeSegments(this.subpathIndex);
        
        if (this.simplifySize > 0) {
            this.subpath.simplify(this.simplifySize);
        }
        if (hasStartConnection && this.subpath.length > 0) {
            this.subpath.removeSegment(0);
        }
        if (hasEndConnection && this.subpath.length > 0) {
            this.subpath.removeSegment(this.subpath.length - 1);
        }
        this.path.insertSegments(this.subpathIndex, this.subpath.segments);
        this.subpath = null;
        this.subpathIndex = 0;

        // If I intersect other line end points, join or close
        if (this.hitResult) {
            if (touching(this.path.firstSegment.point, this.hitResult.segment.point, FreeformTool.SNAP_TOLERANCE)) {
                // close path
                this.path.closed = true;
            } else {
                // joining two paths
                if (!this.hitResult.isFirst) {
                    this.hitResult.path.reverse();
                }
                this.path.join(this.hitResult.path);
            }
            removeHitPoint();
            this.hitResult = null;
        }
        
        if (this.path) {
            this.onUpdateImage();
            this.path = null;
        }
    }
    deactivateTool () {
        this.fixedDistance = 1;
    }
}

export default FreeformTool;