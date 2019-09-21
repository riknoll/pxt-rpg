namespace rpg {
    export interface AnimationDefinition {
        frames: Image[];
        interval?: number;
        loop?: boolean;
    }

    export class ActorDefinition {
        idleFrames: AnimationDefinition;
        entranceFrames: AnimationDefinition;
        exitFrames: AnimationDefinition;

        baseActions: ActionDefinition[];

        constructor(public readonly name: string, public staticImage: Image, public readonly health: number) {
        }

        setIdleFrames(anim: AnimationDefinition) {
            this.idleFrames = anim;
        }

        setEntranceFrames(anim: AnimationDefinition) {
            this.entranceFrames = anim;
        }

        setExitFrames(anim: AnimationDefinition) {
            this.exitFrames = anim;
        }

        getInstance(): Actor {
            return new Actor(this);
        }
    }

    export enum ActorState {
        Entering,
        Exiting,
        Idle,
        Hidden

    }

    export class Actor {
        public sprite: Sprite;
        protected state: ActorState;
        protected transitionTime: number;

        constructor(public readonly def: ActorDefinition) {
            this.state = ActorState.Hidden;
        }

        enterScene(entrancePath: string, duration: number) {
            if (!this.sprite) this.sprite = sprites.create(this.def.staticImage);

            this.state = ActorState.Entering;
            this.transitionTime = control.millis() + duration;
            this.moveAndAnimate(entrancePath, duration, this.def.entranceFrames);
        }

        exitScene(exitPath: string, duration: number) {
            if (!this.sprite) this.sprite = sprites.create(img`1`);

            this.state = ActorState.Exiting;
            this.transitionTime = control.millis() + duration;
            this.moveAndAnimate(exitPath, duration, this.def.exitFrames);
        }

        update() {
            if (this.transitionTime != undefined) {
                const time = control.millis();

                if (time > this.transitionTime) {
                    this.stopAllAnimations();

                    switch (this.state) {
                        case ActorState.Entering:
                            this.state = ActorState.Idle;
                            if (this.def.idleFrames) {
                                this.applyAnimation(
                                    this.def.idleFrames.frames, 
                                    this.def.idleFrames.interval || 100, 
                                    !!this.def.idleFrames.loop
                                );
                            }
                            else {
                                this.sprite.setImage(this.def.staticImage);
                            }
                            break;
                        case ActorState.Exiting:
                            this.state = ActorState.Hidden;
                            this.dispose();
                            break;
                    }

                    this.transitionTime = undefined;
                }
            }
        }

        dispose() {
            if (!this.sprite) return;
            this.sprite.destroy();
            this.sprite = undefined;
        }

        protected moveAndAnimate(movePath: string, duration: number, anim: AnimationDefinition) {
            this.stopAllAnimations();
            animation.runMovementAnimation(this.sprite, movePath, duration);
            
            if (anim) {
                const interval = anim.interval || (duration / anim.frames.length);
                this.applyAnimation(anim.frames, interval, !!anim.loop);
            }
            else {
                this.sprite.setImage(this.def.staticImage);
            }
        }

        protected applyAnimation(frames: Image[], interval: number, loop: boolean) {
            if (this.sprite) {
                animation.runImageAnimation(
                    this.sprite,
                    frames,
                    interval | 0,
                    loop
                );
            }
        }

        protected stopAllAnimations() {
            animation.stopAnimation(animation.AnimationTypes.All, this.sprite);
        }
    }
}