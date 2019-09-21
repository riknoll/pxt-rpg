namespace battle {
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

    export class BattleMenu extends sprites.BaseSprite {
        protected root: ui.Element;
        
        constructor() {
            super(101);
        }

        __visible() {
            return !!this.root;
        }

        __drawCore(camera: scene.Camera) {
            this.root.draw();
        }

        show() {
            if (!this.root) this.buildMenu();
        }

        protected buildMenu() {
            // this.root = 
        }
    }

    export enum DamageKind {
        Normal
    }

    export interface Damage {
        kind: DamageKind;
        amount: number;
    }

    export interface DamageProvider {
        getDamage(targets: number): Damage[];
    }

    export enum TargetKind {
        Selection,
        All,
        Random
    }

    export interface ActionTarget {
        kind: TargetKind;
        maxTargets?: number;
    }

    export class ActionDefinition {
        name: string;
        info: string;

        target: ActionTarget;
        damage: DamageProvider;
    }
}