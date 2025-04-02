class Atom {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }

    updatePosition(timeStep, boxWidth, boxHeight, mode) {
        let newX = this.x + this.vx * timeStep;
        let newY = this.y + this.vy * timeStep;

        if (mode) {
            // Wrap mode
            if (newX < -boxWidth / 2) {
                this.x = newX + boxWidth;
            } else if (newX > boxWidth / 2) {
                this.x = newX - boxWidth;
            } else {
                this.x = newX;
            }

            if (newY < -boxHeight / 2) {
                this.y = newY + boxHeight;
            } else if (newY > boxHeight / 2) {
                this.y = newY - boxHeight;
            } else {
                this.y = newY;
            }
        } else {
            // Bounce mode
            if (newX < -boxWidth / 2 || newX > boxWidth / 2) {
                this.vx *= -1; // Reverse velocity in X

                // prevents particles from getting stuck in boundaries
                this.x = Math.max(-boxWidth / 2, Math.min(boxWidth / 2, newX));
            }
            if (newY < -boxHeight / 2 || newY > boxHeight / 2) {
                this.vy *= -1; // Reverse velocity in Y

                // prevents particles from getting stuck in boundaries
                this.y = Math.max(-boxHeight / 2, Math.min(boxHeight / 2, newY));
            }
            this.x = newX;
            this.y = newY;
        }
    }
}

// User input for boundary, number of particles, and velocity magnitude
let animationId = null;
document.getElementById('startSimulation').addEventListener('click', function () {
    // clean previous animation frame resource
    if (animationId) {
        cancelAnimationFrame(animationId);
        const canvasContainer = document.getElementById('canvasContainer');
        canvasContainer.innerHTML = '';
        animationId = null;
    }

    // validate the user input
    function validateInput(input) {
        console.log("Input value: ", input);
        if (isNaN(input) || input < 0.0) {
            return false;
        }
        return true;
    }

    const userBoxWidth = parseFloat(document.getElementById('boxWidth').value);
    const userBoxHeight = parseFloat(document.getElementById('boxHeight').value);
    const userVelocity = parseFloat(document.getElementById('velocityMagnitude').value) / 10;
    const numParticles = parseInt(document.getElementById('numParticles').value);
    const mode = parseInt(document.getElementById('mode').value);

    // validate the input
    if (!validateInput(userBoxWidth) || !validateInput(userBoxHeight) || !validateInput(userVelocity)
        || !validateInput(numParticles)) {
        alert('Please enter the valid number for all fields.');
        return;
    }

    // Initialize with random starting positions
    function getRandomPosition(range) {
        return Math.random() * range * 2 - range;
    }

    // Generate random angle (in radians) between 0 and 2 * PI (360)
    function getRandomAngle() {
        return Math.random() * Math.PI * 2; // Random angle between 0 and 2π (360 degrees)
    }

    const particles = [];

    // create numParticles number of particles in a random starting position moving in a random direction
    for (let i = 0; i < numParticles; i++) {
        const angle = getRandomAngle();  // Random direction (angle)

        // Calculate the x and y components of the velocity based on the random angle
        const vx = userVelocity * Math.cos(angle); // X velocity component
        const vy = userVelocity * Math.sin(angle); // Y velocity component

        const atom = new Atom(
            getRandomPosition(userBoxWidth / 2),
            getRandomPosition(userBoxHeight / 2),
            vx,  // Random X velocity component
            vy   // Random Y velocity component
        );
        particles.push(atom);
    }

    // Canvas setup
    const canvas = document.createElement('canvas');
    canvas.id = "simulationCanvas";
    canvas.width = userBoxWidth * 100;
    canvas.height = userBoxHeight * 100;
    canvas.style.border = "1px solid black";

    const button = document.getElementById('startSimulation');
    const buttonTop = button.getBoundingClientRect().top;
    const buttonHeight = button.offsetHeight

    const canvasContainer = document.getElementById('canvasContainer');
    canvasContainer.style.position = "absolute";
    canvasContainer.style.top = `${buttonTop + buttonHeight}px`;
    canvasContainer.innerHTML = '';
    canvasContainer.style.width = `${canvas.width * 1.5}px`;
    canvasContainer.style.height = `${canvas.height * 1.5}px`;
    canvasContainer.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    function draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        // Draw each atom
        particles.forEach(atom => {
            const drawX = (canvas.width / 2) + atom.x * 100;
            const drawY = (canvas.height / 2) - atom.y * 100;

            ctx.beginPath();
            ctx.arc(drawX, drawY, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    const timeStep = 0.50;

    // replace with RAF optimize the animate playing
    let lastTimestamp = 0;

    // control animation to be 30 FPS
    // formula: final FPS = 1000 / targetFPS
    const frameInterval = 1000 / 30;
    function animate(timestamp) {
        if (timestamp - lastTimestamp >= frameInterval) {

            // update particles position
            particles.forEach(atom => {
                atom.updatePosition(timeStep, userBoxWidth, userBoxHeight, mode);
            });

            draw();
            lastTimestamp = timestamp;
        }
        animationId = requestAnimationFrame(animate);
    }
    animationId = requestAnimationFrame(animate);
});

