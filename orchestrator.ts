namespace rpg {
    export enum BattleState {
        Hidden,
        Starting,
        UserTurn,
        EnemyTurn,
        Ending
    }

    export enum TurnState {
        Starting,
        Action,
        Application,
        Ending,
        Ended
    }

    export enum PhaseState {
        Starting,
        SelectAction,
        SelectTarget,
        Confirmation,
        Application,
        Ending,
        Ended
    }

    export class BattlePhase extends Automata {
        public selectedAction: Action;
        public selectedTarget: ActionTarget;

        constructor(public actor: Actor) {
            super();
            this.transitionState(PhaseState.Starting);
        }

        isFinished() {
            return this.state === PhaseState.Ended;
        }

        onPhaseStart() {
            this.transitionState(PhaseState.SelectAction);
        }

        onActionSelectionStart() {

        }

        onTargetSelectionStart() {

        }

        onConfirmationStart() {

        }

        onApplicationStart() {
            this.transitionState(PhaseState.Ending);
        }

        onPhaseEnd() {
            this.transitionState(PhaseState.Ended);
        }

        onStateTransition(oldState: number, newState: number) {
            switch (newState) {
                case PhaseState.Starting:
                    this.onPhaseStart();
                    break;
                case PhaseState.SelectAction:
                    this.onActionSelectionStart();
                    break;
                case PhaseState.SelectTarget:
                    this.onTargetSelectionStart();
                    break;
                case PhaseState.Confirmation:
                    this.onConfirmationStart();
                    break;
                case PhaseState.Application:
                    this.onApplicationStart();
                    break;
                case PhaseState.Ending:
                    this.onPhaseEnd();
                    break;
            }
        }
    }

    export class BattleTurn extends Automata {
        protected phases: BattlePhase[];
        protected activeIndex: number;

        constructor(public actors: Actor[]) {
            super();

            this.phases = this.actors.map(a => new BattlePhase(a));
            this.activeIndex = 0;

            this.transitionState(TurnState.Starting);
        }

        onTurnStart() {
            for (const actor of this.actors) {
                for (const effect of actor.effects) {
                    effect.onTurnStart();
                }
            }

            this.transitionState(TurnState.Action);
        }

        onTurnEnd() {
            for (const actor of this.actors) {
                for (const effect of actor.effects) {
                    effect.onTurnEnd();
                }
            }

            this.transitionState(TurnState.Ended);
        }

        update() {
            if (this.state === TurnState.Ended) return;

            super.update();

            for (const phase of this.phases) {
                phase.update();
            }

            if (this.state === TurnState.Action && this.activeIndex < this.phases.length) {
                if (this.phases[this.activeIndex].isFinished()) {
                    this.activeIndex++;

                    if (this.activeIndex >= this.phases.length) {
                        this.transitionState(TurnState.Ending);
                    }
                }
            }
        }

        onStateTransition(oldState: number, newState: number) {
            switch (newState) {
                case TurnState.Starting:
                    this.onTurnStart();
                    break;
                case TurnState.Ending:
                    this.onTurnEnd();
                    break;
            }
        }

        isFinished() {
            return this.state === TurnState.Ended;
        }
    }

    export class Battle extends Automata {
        protected party: Actor[];
        protected enemies: Actor[];

        protected activeTurn: BattleTurn;

        constructor(party: ActorDefinition[], enemies: ActorDefinition[]) {
            super();
            this.party = party.map(def => new Actor(def));
            this.enemies = enemies.map(def => new Actor(def));
        }

        start() {
            const entranceDuration = 1000;

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

            this.transitionState(BattleState.Starting);
        }

        update() {
            super.update();
            this.party.forEach(a => a.update());
            this.enemies.forEach(a => a.update());
            if (this.activeTurn) {
                this.activeTurn.update();

                if (this.activeTurn.isFinished()) {
                    this.activeTurn = undefined;

                    if (this.isBattleOver()) this.transitionState(BattleState.Ending)
                    else if (this.state === BattleState.UserTurn) this.transitionState(BattleState.EnemyTurn)
                    else this.transitionState(BattleState.UserTurn)
                }
            }
        }


        dispose() {
            this.party.forEach(a => a.dispose());
            this.enemies.forEach(a => a.dispose());
        }

        onStateTransition(oldState: number, newState: number) {
            switch (newState) {
                case BattleState.Starting:
                    this.onBattleStart();
                    break;
                case BattleState.UserTurn:
                    this.onUserTurnStart();
                    break;
                case BattleState.EnemyTurn:
                    this.onEnemyTurnStart();
                    break;
                case BattleState.Ending:
                    this.onBattleEnd();
                    break;
            }
        }

        onBattleStart() {
            for (const actor of this.party) {
                for (const effect of actor.effects) {
                    effect.onBattleStart();
                }
            }
            for (const actor of this.enemies) {
                for (const effect of actor.effects) {
                    effect.onBattleStart();
                }
            }
        }

        onBattleEnd() {
            for (const actor of this.party) {
                for (const effect of actor.effects) {
                    effect.onBattleEnd();
                }
            }
            for (const actor of this.enemies) {
                for (const effect of actor.effects) {
                    effect.onBattleEnd();
                }
            }
        }

        onUserTurnStart() {
            this.activeTurn = new BattleTurn(this.party);
        }

        onEnemyTurnStart() {
            this.activeTurn = new BattleTurn(this.enemies);
        }

        isBattleOver() {
            return false;
        }
    }
}