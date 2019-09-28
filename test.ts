// tests go here; this will not be compiled when this package is used as a library


namespace rpg {
    export function main() {
        const hero = initHero();
        const skelly = initSkelly();

        const b = new Battle([hero, hero, hero], [skelly, skelly, skelly]);

        b.start(); 
        game.onUpdate(() => b.update());  
    }

    function initHero() {
        // Compiler bug... Assertion fails if this constructor isn't called
        let e = new Effect(null);


        const char1 = new ActorDefinition("hero", sprites.castle.heroWalkFront1, 10);

        char1.setEntranceFrames({
            frames: [
                sprites.castle.heroWalkSideRight1,
                sprites.castle.heroWalkSideRight2,
                sprites.castle.heroWalkSideRight3,
                sprites.castle.heroWalkSideRight4
            ],
            loop: true,
            interval: 200
        })

        char1.setIdleFrames({
            frames: [
                sprites.castle.heroWalkFront1,
                sprites.castle.heroWalkFront2,
                sprites.castle.heroWalkFront3,
                sprites.castle.heroWalkFront4
            ],
            loop: true,
            interval: 200
        })

        char1.setExitFrames({
            frames: [
                sprites.castle.heroWalkSideLeft1,
                sprites.castle.heroWalkSideLeft2,
                sprites.castle.heroWalkSideLeft3,
                sprites.castle.heroWalkSideLeft4
            ],
            loop: true,
            interval: 200
        })

        return char1;
    }

    function initSkelly() {
        const char2 = new ActorDefinition("skelly", sprites.castle.skellyAttackFront1, 10);

        char2.setEntranceFrames({
            frames: [
                sprites.castle.skellyWalkLeft1,
                sprites.castle.skellyWalkLeft2
            ],
            loop: true,
            interval: 200
        })

        char2.setIdleFrames({
            frames: [
                sprites.castle.skellyAttackFront1,
                sprites.castle.skellyAttackFront2,
                sprites.castle.skellyAttackFront3,
                sprites.castle.skellyAttackFront4
            ],
            loop: true,
            interval: 200
        })


        char2.setExitFrames({
            frames: [
                sprites.castle.skellyWalkRight1,
                sprites.castle.skellyWalkRight2
            ],
            loop: true,
            interval: 200
        })
        return char2;
    }
}

rpg.main();