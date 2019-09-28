namespace rpg {
    export interface AnimationDefinition {
        frames: Image[];
        interval?: number;
        loop?: boolean;
        path?: string;
        loopPath?: boolean;
    }

    export class AnimationOptions {
        public startX: number;
        public startY: number;
        public destroyAtEnd: boolean;
        public loopAfter: AnimationDefinition;

        constructor(public duration: number, startX?: number, startY?: number) {
            this.startX = startX;
            this.startY = startY;
        }
    }

    export class QueuedAnimation {
        constructor(public definition: AnimationDefinition, public target: Sprite, public opts: AnimationOptions) { }
    }

    export class AnimationQueue {
        protected queue: QueuedAnimation[];
        protected active: QueuedAnimation;

        protected nextTime: number;

        constructor() {
            this.queue = [];
            this.nextTime = null;
        }

        enqueue(anim: QueuedAnimation) {
            this.queue.push(anim);
        }

        isEmpty() {
            return !!this.queue.length;
        } 

        update() {
            const time = control.millis();

            if (time > this.nextTime && this.active) {
                animation.stopAnimation(animation.AnimationTypes.All, this.active.target);

                if (this.active.opts.destroyAtEnd) {
                    this.active.target.destroy();
                }
                else if (this.active.opts.loopAfter) {
                    animation.runImageAnimation(
                        this.active.target,
                        this.active.opts.loopAfter.frames,
                        this.active.opts.loopAfter.interval,
                        true
                    );
                    if (this.active.opts.loopAfter.path) {
                        animation.runMovementAnimation(
                            this.active.target,
                            this.active.opts.loopAfter.path,
                            this.active.opts.loopAfter.interval,
                            true
                        );
                    }
                }

                this.active = undefined;
                this.nextTime = null;
            }

            if (this.nextTime == null && this.queue.length) {
                this.active = this.queue.shift();
                this.nextTime = time + this.active.opts.duration;

                if (this.active.opts.startX != undefined) {
                    this.active.target.x = this.active.opts.startX;
                }

                if (this.active.opts.startY != undefined) {
                    this.active.target.y = this.active.opts.startY;
                }

                const interval =
                    this.active.definition.interval || ((this.active.opts.duration / this.active.definition.frames.length) | 0)
                
                animation.runImageAnimation(
                    this.active.target,
                    this.active.definition.frames,
                    interval,
                    this.active.definition.loop
                );

                if (this.active.definition.path) {
                    animation.runMovementAnimation(
                        this.active.target,
                        this.active.definition.path,
                        this.active.opts.duration,
                        this.active.definition.loopPath
                    );
                }
            } 
        }
    }
}