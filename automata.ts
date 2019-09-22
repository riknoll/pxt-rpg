namespace rpg {
    export class Automata {
        protected state: number;
        protected nextState: number;

        protected lastTransitionTime: number;
        protected nextTransitionTime: number;

        constructor() {
        }

        update() {
            if (this.nextTransitionTime == undefined) return;

            const time = control.millis();

            if (time > this.nextTransitionTime) {
                this.transitionState(this.nextState);
            }
        }

        transitionState(newState: number, delay?: number) {
            if (this.state === newState) return;

            if (delay === undefined) {
                const oldState = this.state;
                this.state = newState;

                this.lastTransitionTime = control.millis();

                this.nextState = undefined;
                this.nextTransitionTime = undefined;

                this.onStateTransition(oldState, this.state);
            }
            else {
                this.nextState = newState;
                this.nextTransitionTime = control.millis() + delay;
            }
        }

        protected onStateTransition(oldState: number, newState: number) {
            // subclass
        }
    }
}