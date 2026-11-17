/**
 * Turns pointer speed into a brush size multiplier, so that strokes can be drawn
 * thin while moving quickly and full width while moving slowly or holding still.
 */
class SpeedTaper {
    /**
     * The multiplier used at the fastest speeds. Strokes never taper below this,
     * so that a fast flick still leaves a visible line.
     */
    // TODO: make this configurable on scratch-gui
    static get MIN_SCALE () {
        return 0.25;
    }

    /**
     * Speed at which the multiplier bottoms out
     * at MIN_SCALE. Roughly a brisk flick across the canvas.
     */
    static get FAST_SPEED () {
        return 1.5;
    }

    /**
     * Weight given to the newest speed sample. Lower means smoother strokes and
     * more lag, higher means more responsive but more jittery.
     */
    static get SMOOTHING () {
        return 0.35;
    }

    constructor () {
        this.lastPoint = null;
        this.lastTime = null;
        this.smoothedSpeed = 0;
    }

    /**
     * Forget the current stroke so that the next one starts at full width.
     * Called when the pointer goes down.
     */
    reset () {
        this.lastPoint = null;
        this.lastTime = null;
        this.smoothedSpeed = 0;
    }

    /**
     * Record a pointer position and update the smoothed speed.
     * @param {?object} point paper.js Point of this event.
     * @param {?number} timeStamp timestamp of the underlying DOM event.
     */
    update (point, timeStamp) {
        if (!point || typeof timeStamp !== 'number') {
            return;
        }
        if (this.lastPoint && typeof this.lastTime === 'number') {
            // Ignore events that arrive out of order or share a timestamp with the previous one,
            // since either would produce a nonsense speed.
            const elapsed = timeStamp - this.lastTime;
            if (elapsed > 0) {
                const distance = point.subtract(this.lastPoint).length;
                const speed = distance / elapsed;
                this.smoothedSpeed =
                    (this.smoothedSpeed * (1 - SpeedTaper.SMOOTHING)) +
                    (speed * SpeedTaper.SMOOTHING);
            }
        }
        this.lastPoint = point;
        this.lastTime = timeStamp;
    }

    /**
     * The brush size multiplier for the current speed. 1 means full brush size,
     * and slower pointers stay at 1 indefinitely.
     * @return {number} multiplier between MIN_SCALE and 1
     */
    getScale () {
        const fraction = Math.min(1, Math.max(0, this.smoothedSpeed / SpeedTaper.FAST_SPEED));
        return 1 - (fraction * (1 - SpeedTaper.MIN_SCALE));
    }
}

export default SpeedTaper;
