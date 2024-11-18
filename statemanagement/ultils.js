
export function drawStatusText(context, input, player) {
    context.fillStyle = "black"
    context.textAlign = "left"
    context.font = "40px Helvetica"
    context.fillText("Press: " + input, 20, 50)
    context.fillStyle = "white"
    context.fillText("Press: " + input, 22, 52)

    context.fillStyle = "black"
    context.textAlign = "left"
    context.fillText("Player state: " + player.currentState.state, 20, 80)
}