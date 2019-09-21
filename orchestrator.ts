namespace rpg {
    export class Phase {
        constructor() {
        }

        onStart() {

        }

        onEnd() {

        }

        isFinished() {
            return true;
        }

        update() {

        }
    }

    export class Orchestrator {
        protected queue: Phase[];

        constructor() {
            this.queue = [];
        }

        startTurn() {

        }

        endTurn() {

        }

        update() {
            if (!this.queue.length) return;

            let current = this.queue[0];

            if (current.isFinished()) {
                current.onEnd();
                this.queue.shift();

                current = this.queue[0];
                if (current) current.onStart();
            }

            if (!current) {
                this.endTurn();
                return;
            }

            current.update();
        }
    }
}