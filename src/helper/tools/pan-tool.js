import paper from '@turbowarp/paper';
import log from '../../log/log';
import Cursors from '../../lib/cursors';

/**
 * Tool for drawing rounded rectangles
 */
class PanTool extends paper.Tool {
    constructor (setCursor) {
        super();
        
        this.setCursor = setCursor
        this.setCursor(Cursors.GRAB);

        this.onMouseDown = this.handleMouseDown;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;

        this.active = false;
    }

    handleMouseDown(event) {
        if (event.event.button > 0) return; // only first mouse button
        this.setCursor(Cursors.GRABBING);
        this.active = true;
    }

    handleMouseDrag(event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button
        
        paper.view.translate(new paper.Point(event.event.movementX, event.event.movementY).divide(paper.view.zoom));
    }

    handleMouseUp(event) {
        if (event.event.button > 0) return; // only first mouse button
        this.setCursor(Cursors.GRAB);
        this.active = false;
    }

    deactivateTool () {
        this.setCursor(Cursors.DEFAULT);
    }
}

export default PanTool;
