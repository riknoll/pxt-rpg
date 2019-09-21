namespace rpg {
    export enum TargetKind {
        Selection,
        All,
        Random
    }

    export interface ActionTarget {
        kind: TargetKind;
        maxTargets?: number;
    }
}