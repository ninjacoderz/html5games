import { ClimbingEnemy, Enemy, FlyingEnemy, GroundEnemy } from "./enemy.js";
import InputHandler from "./input.js";
import { Background } from "./layer.js";
import Player from "./player.js";
import { stateKeys } from "./state.js";
import { UI } from "./UI.js";

window.addEventListener ( "load", function () {
    
    const canvas = document.getElementById("canvas")
    const context = canvas.getContext("2d");

    const loading = document.getElementById("loading")
    loading.style.display = 'none';

    canvas.width = window.innerWidth
    canvas.height = 720

    class Game {
        constructor ( width, height ){
            this.width = width;
            this.height = height;
           
            this.groundMargin = 120;
            this.speed = 0
            this.maxSpeed = 4
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false
            this.fontColor = 'black'
            this.score = 0;

            this.particles = []
            this.maxParticles = 50

            this.background = new Background(this)
            this.UI = new UI(this)
            this.input = new InputHandler(this)
            this.player = new Player(this)

            this.player.currentState = this.player.states[stateKeys.IDLE];
            this.player.currentState.enter()
        }
        update(deltaTime){
            this.player.update(this.input.pressedKeys, deltaTime)
            this.background.update()
            
            if(this.enemyTimer > this.enemyInterval) {
                this.addEnemy()
                this.enemyTimer = 0
            }
            else {
                this.enemyTimer += deltaTime
            }

            this.enemies.forEach((enemy, index) => {
                enemy.update(deltaTime)
                if(enemy.markedForDeletion) this.enemies.splice(index, 1);
            })

            this.particles.forEach((particle, index) => {
                particle.update();
                if(particle.markedForDeletion) this.particles.splice(index, 1)
            })

            if(this.particles.length > this.maxParticles ) this.particles = this.particles.slice(0, this.maxParticles)

        }
        draw() {
            this.background.draw(context)
            this.player.draw(context);
            this.enemies.forEach( enemy => {
                enemy.draw(context)
            })
            this.UI.draw(context)

            this.particles.forEach((particle) => {
                particle.draw(context);
            })

        }
        addEnemy() {
            if(this.speed > 0  && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            else if(this.speed > 0  && Math.random() > 0.5) this.enemies.push(new ClimbingEnemy(this))
            this.enemies.push(new FlyingEnemy(this))
        }
    }

    const game = new Game(canvas.width, canvas.height)

    let timeStart = Date.now()
    const fps = 100
    function animate(){
        context.clearRect(0, 0, canvas.width, canvas.height)

        let detaTime = (Date.now() - timeStart);
        timeStart = Date.now();
        
        game.update(detaTime)
        game.draw();
        
        setTimeout(() => {
            requestAnimationFrame(animate);
        }, 1000 / fps - (detaTime));

    }
    animate();
})