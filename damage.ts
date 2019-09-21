namespace rpg {
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
}