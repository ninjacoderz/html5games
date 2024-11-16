
window.addEventListener("load", function() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    const CAVANS_WIDTH = canvas.width = 1400;
    const CANVAS_HEIGHT = canvas.height = 720;
    const fullScreenButton = document.getElementById("fullScreenButton")

    let enemies = []
    let score = 0;
    let gameOver = false
    class InputHandler {
        constructor(){
            this.keys = []
            this.touchY = ''
            this.touchThreshold = 30
            window.addEventListener("keydown", (e) => {
                // console.log(e.key);
                if((e.key === "ArrowDown" ||
                    e.key === "ArrowUp" ||
                    e.key === "ArrowRight" ||
                    e.key === "ArrowLeft"
                    )
                    
                    && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key)
                }
                else if(e.key === "Enter" && gameOver) {
                    restartGame();
                }
                // console.log(this.keys)
            })

            window.addEventListener("keyup", (e) => {
                if(e.key === "ArrowDown" ||
                    e.key === "ArrowUp" ||
                    e.key === "ArrowRight" ||
                    e.key === "ArrowLeft"
                    ) {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
                // console.log(this.keys)
            })

            window.addEventListener("touchstart", e =>{
                this.touchY = e.changedTouches[0].pageY
            })
            window.addEventListener("touchmove", e =>{
                const swipeDistance = e.changedTouches[0].pageY - this.touchY;
                if(swipeDistance < -this.touchThreshold && this.keys.indexOf("swipe up") === -1) this.keys.push("swipe up");
                else if(swipeDistance > this.touchThreshold && this.keys.indexOf("swipe down") === -1) {
                    this.keys.push("swipe down")
                    if(gameOver) restartGame();
                }
            })
            window.addEventListener("touchend", e =>{
                this.keys.splice(this.keys.indexOf("swipe up"), 1);
                this.keys.splice(this.keys.indexOf("swipe down"), 1)
            })
        }
    }

    const input = new InputHandler();

    class Player {
        constructor (game){
            this.width = 200;
            this.height = 200;
            this.x = 0;
            this.y = 0;
            this.image = document.getElementById("player")

            this.spriteInterval = 50
            this.gameFrame = 0

            this.spriteX = 0
            this.spriteY = 0
            
            this.speed = 0
            this.vy = 0;
            this.weight = 1.
        }

        draw(ctx){
            ctx.strokeStyle = "white"
            // ctx.strokeRect(this.x, this.y, this.width, this.height)
            ctx.beginPath();
            ctx.arc(this.x+ this.width/2, this.y+ this.height/2, this.width/2 - 30, 0, Math.PI*2)
            ctx.stroke();
            ctx.fillStyle = "black"
            ctx.drawImage(this.image, 
                this.width * this.spriteX, this.height * this.spriteY, this.width, this.height, 
                this.x, this.y, this.width, this.height)
        }
        update(input, deltaTime, enemies){
            enemies.forEach( enemy => {
                const disX = ( enemy.x + enemy.width / 2 )-  ( this.x + this.width /2 )
                const disY = ( enemy.y + enemy.height / 2 ) - (this.y + this.height/2 )
                const distance = Math.sqrt(disX* disX + disY * disY)
                if ( distance < enemy.width / 2 + this.width /2  - 30 - 20){
                    gameOver = true
                }
            })
            if(this.gameFrame < this.spriteInterval) this.gameFrame += deltaTime
            else {
                this.spriteX += 1
                this.gameFrame = 0
            }
            if(this.spriteX > 8 && this.spriteY == 0) this.spriteX = 0
            if(this.spriteX > 6 && this.spriteY == 1) this.spriteX = 0

            if(input.keys.indexOf("ArrowRight") > -1){
                this.speed = 10
            }
            else if(input.keys.indexOf("ArrowLeft") > -1) {
                this.speed = -5
            }
            else if((input.keys.indexOf("ArrowUp") > -1 || input.keys.indexOf('swipe up') > -1) && this.onGround()){
                this.vy -= 30
            }
            else {
                this.speed = 0
            }

            this.x += this.speed
            if(this.x < 0) this.x = 0
            if(this.x > CAVANS_WIDTH - this.width) this.x = CAVANS_WIDTH - this.width
            
            this.y += this.vy
            if(!this.onGround()){
                this.vy += this.weight
                this.spriteY = 1
            }
            else {
                this.vy = 0
                this.spriteY = 0
            }
            if(this.y > CANVAS_HEIGHT - this.height) this.y = CANVAS_HEIGHT - this.height
        }

        restart() {
            this.x = 100;
            this.y = CANVAS_HEIGHT - this.height

        }

        onGround () {
            return this.y >= CANVAS_HEIGHT - this.height
        }
    }

    const player = new Player()
    
    class Background {
        constructor () {
            this.height = 720
            this.width = 2400;
            this.x = 0
            this.y = 0
            this.image = background_simple
            this.speed = 5
        }
        draw(ctx){
            ctx.drawImage( this.image, this.x, this.y)
            ctx.drawImage( this.image, this.x + this.width - this.speed, this.y)
        }
        update(deltaTime){
            this.x -= this.speed
            if( this.x < 0 - this.width) this.x = 0
        }
    }

    const background = new Background();

    class Enemy {
        constructor(game){
            this.width = 160
            this.height = 119
            this.x = CAVANS_WIDTH;
            this.y = CANVAS_HEIGHT - this.height;
            this.image = document.getElementById("enemy");
            this.frameX = 0
            this.spriteInterval = 50
            this.gameFrame = 0
            this.speed = 5
            this.markForDelete = false

        }
        draw(ctx) {
            ctx.strokeStyle = "white"
            // ctx.strokeRect(this.x, this.y, this.width, this.height)
            ctx.beginPath();
            ctx.arc(this.x+ this.width/2, this.y+ this.height/2, this.width/2 - 20, 0, Math.PI*2)
            ctx.stroke();
            ctx.drawImage( this.image, this.frameX * this.width, 0, this.width, this.height, 
                this.x, this.y, this.width, this.height )
        }
        update(deltaTime){
            if(this.gameFrame < this.spriteInterval) this.gameFrame += deltaTime
            else {
                this.frameX += 1
                this.gameFrame = 0
            }
            if(this.frameX > 5 ) this.frameX = 0
            
            this.x -= this.speed
            if(this.x < 0 - this.width){
                this.markForDelete = true;
                score ++ ;
            }
        }
    }
    let lastTime = 0
    let enemyTimeInterval = 1000
    let randomEnemyTimeInterval = Math.random() * 2000 
    function handlerEnemies(detaTime) {
        lastTime += detaTime
        if(lastTime >= (enemyTimeInterval + randomEnemyTimeInterval)) {
            enemies.push ( new Enemy());
            randomEnemyTimeInterval = Math.random() * 2000 
            lastTime = 0;
        }
        
        enemies.forEach(enemy => {
            enemy.draw(ctx);
            enemy.update(detaTime);
        })
        enemies = enemies.filter(enemy => !enemy.markForDelete)

    }

    function displayStatusText(context){
        context.fillStyle = "black"
        context.textAlign = "left"
        context.font = "40px Helvetica"
        context.fillText("Score: " + score, 20, 50)
        context.fillStyle = "white"
        context.fillText("Score: " + score, 22, 52)
    }

    function displayGameOverText (context) {
        context.textAlign = "center"
        context.fillStyle = "black"
        context.font = "40px Helvetica"
        context.fillText("Game Over! Try again!", CAVANS_WIDTH / 2, CANVAS_HEIGHT / 2)
        context.fillStyle = "white"
        context.fillText("Game Over! Try again!", CAVANS_WIDTH / 2 - 5, CANVAS_HEIGHT / 2 - 5)
    }

    function restartGame() {
        player.restart();
        enemies = []
        score = 0;
        gameOver = false
        animate();
    }

    function toggleFullScreen() {
        if(!document.fullscreenElement) {
            canvas.requestFullscreen().then().catch(err => {
                alert(`Error, can't enter full-screen mode: $(err.message)`)
            })
        } else {
            document.exitFullscreen();
        }
    }
    fullScreenButton.addEventListener("click", toggleFullScreen)

    let timeStart = Date.now()
    const fps = 40
    function animate(){
        let detaTime = (Date.now() - timeStart);
        timeStart = Date.now();

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        background.draw(ctx)
        background.update(detaTime)
        player.draw(ctx);
        player.update(input, detaTime, enemies);
        displayStatusText(ctx)
        handlerEnemies(detaTime);
        
        setTimeout(() => {
            if(!gameOver)requestAnimationFrame(animate);
            else displayGameOverText(ctx);
        }, 1000 / fps - (detaTime));

    }   

    // animate();
})

