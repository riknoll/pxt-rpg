namespace battle {
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
}