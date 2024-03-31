const cursor = document.querySelector('.cursor')
const holes = [...document.querySelectorAll('.hole')]
const scoreEl = document.querySelector('.score span')
let score = 0

// Preload the audio file
const sound = new Audio("assets/smash.mp3")
sound.preload = "auto";

let lastScore = 0; // Keep track of the last score to determine when to increase speedupFactor
let consecutiveMisses = 0; // Count consecutive times score hasn't increased

function run() {
    const i = Math.floor(Math.random() * holes.length)
    const hole = holes[i]
    let timer = null

    const img = document.createElement('img')
    img.classList.add('mole')
    img.src = 'assets/urk.png'

    img.addEventListener('click', () => {
        score += 10
        if (score - lastScore >= 10) {
            lastScore = score;
            consecutiveMisses = 0; // Reset consecutive misses count
        }
        sound.currentTime = 0; // Rewind the audio to the beginning to ensure it plays immediately
        sound.play()
        scoreEl.textContent = score
        img.src = 'assets/urk-whacked.png'
        clearTimeout(timer)
        setTimeout(() => {
            hole.removeChild(img)
            run()
        }, 500)
    })

    hole.appendChild(img)

    // Calculate new timeout duration using a linear function
    const baseTimeout = 1500; // Base timeout duration
    const minTimeout = 150; // Minimum timeout duration
    const speedupFactor = 0.2 + (score / 1000); // Dynamically adjust speedupFactor based on score progression
    const newTimeoutDuration = Math.max(minTimeout, baseTimeout - (speedupFactor * score));

    timer = setTimeout(() => {
        hole.removeChild(img)
        consecutiveMisses++;
        if (consecutiveMisses >= 3) {
            // Display "Game Over" screen
            alert("Game Over! Your score: " + score);
            // You can perform additional actions here, like resetting the game.
        } else {
            run(); // Start a new cycle if not game over yet
        }
    }, newTimeoutDuration)
}

run()

window.addEventListener('mousemove', e => {
    cursor.style.top = e.pageY + 'px'
    cursor.style.left = e.pageX + 'px'
})
window.addEventListener('mousedown', () => {
    cursor.classList.add('active')
})
window.addEventListener('mouseup', () => {
    cursor.classList.remove('active')
})
