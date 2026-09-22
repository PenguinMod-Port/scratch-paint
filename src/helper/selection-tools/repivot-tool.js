import paper from '@turbowarp/paper';

/**
 * Tool to handle moving the pivot location of the rotation tool.
 */
class RepivotTool {
    constructor () {
        this.anchorCrosshair = null;
        this.anchorPosition = null;
    }

    onMouseDown (hitProperties, boundsPath, anchorCrosshair, anchorPosition) {
        if (hitProperties.doubleClicked) this.anchorPosition.set(boundsPath.bounds.center);
        this.anchorPosition = anchorPosition;
        this.anchorCrosshair = anchorCrosshair;
        this.anchorCrosshair.position = this.anchorPosition;
    }
    onMouseDrag (event) {
        const point = event.point;
        const dragVector = point.subtract(event.downPoint);
        this.anchorCrosshair.position = this.anchorPosition.add(dragVector);
    }
    onMouseUp (event) {
        this.anchorPosition.set(this.anchorCrosshair.position);
    }
}

export default RepivotTool;
