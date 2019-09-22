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

    export enum BattleState {
        Hidden,
        Starting,
        Idle,
        Ending
    }

    export class Battle extends Automata {
        protected party: Actor[];
        protected enemies: Actor[];

        constructor(party: ActorDefinition[], enemies: ActorDefinition[]) {
            super();
            this.party = party.map(def => new Actor(def));
            this.enemies = enemies.map(def => new Actor(def));
        }

        start() {
            const entranceDuration = 1000;
            this.transitionState(BattleState.Starting);
            this.transitionState(BattleState.Idle, entranceDuration);

            let y = 20;
            for (const a of this.party) {
                a.enterScene(-16, y, `l 36 0`, entranceDuration);
                y += 35;
            }

            y = 20;
            for (const a of this.enemies) {
                a.enterScene(176, y, `l -36 0`, entranceDuration);
                y += 35;
            }
        }

        update() {
            super.update();
            this.party.forEach(a => a.update());
            this.enemies.forEach(a => a.update());
        }

        dispose() {
            this.party.forEach(a => a.dispose());
            this.enemies.forEach(a => a.dispose());
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