namespace rpg {
    export class Effect {
        protected value: number;
        public readonly target: Actor;

        constructor(target: Actor) {
            this.target = target;
            this.value = 1;
        }

        setValue(value: number): void {
            this.value = value;
        }

        getValue(): number {
            return this.value;
        }

        onBattleStart(): void { }

        onTurnStart(): void { }

        onTurnEnd(): void { }

        onBattleEnd(): void { }

        onDamageDealt(damaged: Actor): void { }

        modifyDamageDealt(damage: Damage): Damage {
            return damage;
        }

        modifyDamageReceived(damage: Damage): Damage {
            return damage;
        }
    }
}