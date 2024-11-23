export default class InputHandler {
    constructor (game) {
        this.game = game
        this.pressedKeys = [];
        
        window.addEventListener('keydown', (e) => {
            
            switch(e.key){
                case "ArrowLeft":
                case "ArrowRight":
                case "ArrowDown":
                case "ArrowUp":
                case "Enter":
                    if(this.pressedKeys.indexOf(e.key) === -1)
                        this.pressedKeys.push(e.key);
                    break;
                case "d":
                    this.game.debug = !this.game.debug
                    break;
            }
        })

        window.addEventListener('keyup', (e) => {
            switch(e.key){
                case "ArrowLeft":
                case "ArrowRight":
                case "ArrowDown":
                case "ArrowUp":
                case "Enter":
                    this.pressedKeys.splice(this.pressedKeys.indexOf(e.key), 1);
                    break;
            }
        })
    }
}