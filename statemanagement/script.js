import Player from "./player.js"
import InputHandler from "./input.js";
import { drawStatusText } from "./ultils.js";
window.addEventListener ( "load", function () {
    const loading = document.getElementById("loading")
    loading.style.display = 'none';
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const player = new Player(canvas.width, canvas.height)
    const inputHandler = new InputHandler();
    

    let timeStart = Date.now()
    const fps = 40
    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        let detaTime = (Date.now() - timeStart);
        timeStart = Date.now();
       
        player.update(inputHandler.lastKey, detaTime);
        player.draw(ctx);

        drawStatusText(ctx, inputHandler.lastKey, player)
        setTimeout(() => {
            requestAnimationFrame(animate);
        }, 1000 / fps - (detaTime));

    }
    // animate();
})