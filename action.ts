namespace rpg {
    export class ActionDefinition {
        name: string;
        info: string;

        target: ActionTarget;
        damage: DamageProvider;
    }
}