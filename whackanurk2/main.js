document.addEventListener('DOMContentLoaded', function () {
    const cursor = document.querySelector('.cursor');
    const holes = document.querySelectorAll('.hole');
    const scoreEl = document.querySelector('.score span');
    const timerEl = document.querySelector('.timer'); // Select the timer element
    let score = 0;
    let remainingTime = 60; // Initial remaining time in seconds
    let startTime = 0; // Record the start time
    let gameStarted = false; // Flag to indicate if the game has started
    let gameLoop; // Variable to store the game loop interval

    // Preload the audio file
    const sound = new Audio("assets/smash.mp3");
    sound.preload = "auto";

    // Function to display the countdown overlay and start the game after countdown
    function displayCountdownOverlay(count) {
        const overlay = document.createElement('div');
        overlay.classList.add('countdown-overlay');
        overlay.textContent = count;
        document.body.appendChild(overlay);
        if (count > 1) {
            setTimeout(() => {
                overlay.remove();
                displayCountdownOverlay(count - 1); // Recursive call to display next count
            }, 1000);
        } else {
            setTimeout(() => {
                overlay.remove();
                startGame(); // Start the game after countdown
            }, 1000);
        }
    }

    // Function to start the game
    function startGame() {
        gameStarted = true; // Set gameStarted flag to true
        startTime = Date.now(); // Record the start time

        // Function to randomly show moles
        function showMoles() {
            const currentMoles = document.querySelectorAll('.mole').length;
            const numMolesToShow = Math.min(Math.floor(Math.random() * 4) + 1, 4 - currentMoles); // Limit to 4 moles total
            const holesArray = Array.from(holes);
            for (let i = 0; i < numMolesToShow; i++) {
                const randomHole = holesArray[Math.floor(Math.random() * holesArray.length)];
                if (!randomHole.hasChildNodes()) { // Check if the hole is empty
                    const img = document.createElement('img');
                    img.classList.add('mole');
                    img.src = 'assets/urk.png';
                    randomHole.appendChild(img);
                    const moleDuration = Math.random() * 1750 + 250; // Random time between 0.25 and 2 seconds
                    setTimeout(() => {
                        if (randomHole.contains(img)) {
                            randomHole.removeChild(img); // Remove mole if it's still there after its duration
                        }
                    }, moleDuration);
                    img.addEventListener('click', () => {
                        img.src = 'assets/urk-whacked.png';
                        score += 10;
                        sound.currentTime = 0;
                        sound.play();
                        scoreEl.textContent = score;
                        setTimeout(() => {
                            if (randomHole.contains(img)) {
                                randomHole.removeChild(img);
                            }
                        }, 700); // Remove mole after a short delay
                    });
                }
            }
        }

        // Game duration (in milliseconds)
        const gameDuration = 60 * 1000; // 60 seconds

        // Update the game state every second
        const timerInterval = setInterval(() => {
            if (gameStarted) {
                updateTimer(); // Update the timer display

                if (remainingTime <= 0) {
                    clearInterval(gameLoop); // Stop the game loop
                    clearInterval(timerInterval); // Stop the timer interval
                    const replay = confirm("Game Over! Your score: " + score + ". Do you want to replay?");
                    if (replay) {
                        restartGame(); // Replay the game if user chooses to do so
                    }
                } else {
                    showMoles(); // Show moles if there is remaining time
                }
            }
        }, 1000);

        // Run the game loop
        gameLoop = setInterval(() => {
            if (gameStarted) {
                showMoles(); // Show moles if the game has started
            }
        }, Math.random() * 3000 + 1000); // Random interval between 1 and 4 seconds
    }

	// Function to update the timer display
	function updateTimer() {
		const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000); // Calculate elapsed time in seconds
		remainingTime = Math.max(60 - elapsedSeconds, 0); // Calculate remaining time
		if (remainingTime === 0) {
			timerEl.textContent = `Time: 0s`; // Update the timer display to show 0s when the game is over
		} else {
			timerEl.textContent = `Time: ${remainingTime}s`; // Update the timer display
		}
	}

    // Function to restart the game
    function restartGame() {
        score = 0; // Reset score
        scoreEl.textContent = score; // Update score display
        remainingTime = 60; // Reset remaining time
        timerEl.textContent = `Time: ${remainingTime}s`; // Update timer display
        clearInterval(gameLoop); // Stop the game loop
        gameStarted = false; // Set gameStarted flag to false
        // Remove any existing countdown overlays
        const countdownOverlay = document.querySelector('.countdown-overlay');
        if (countdownOverlay) {
            countdownOverlay.remove();
        }
        displayCountdownOverlay(3); // Display countdown overlay to restart the game
    }

    // Display the countdown overlay when the site loads
    displayCountdownOverlay(3);

    window.addEventListener('mousemove', e => {
        cursor.style.top = e.pageY + 'px';
        cursor.style.left = e.pageX + 'px';
    });

    window.addEventListener('mousedown', () => {
        cursor.classList.add('active');
    });

    window.addEventListener('mouseup', () => {
        cursor.classList.remove('active');
    });
});
