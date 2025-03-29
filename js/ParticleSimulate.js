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

        if (mode === 1) {
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
            }
            if (newY < -boxHeight / 2 || newY > boxHeight / 2) {
                this.vy *= -1; // Reverse velocity in Y
            }
            this.x = newX;
            this.y = newY;
        }
    }
}

// User input for boundary, number of particles, and velocity magnitude
document.getElementById('startSimulation').addEventListener('click', function () {
    const userBoxWidth = parseFloat(document.getElementById('boxWidth').value);
    const userBoxHeight = parseFloat(document.getElementById('boxHeight').value);
    const userVelocity = parseFloat(document.getElementById('velocityMagnitude').value);
    const numParticles = parseInt(document.getElementById('numParticles').value);
    const maxSteps = parseInt(document.getElementById('maxSteps').value);
    const mode = parseInt(document.getElementById('mode').value);

    // Initialize with random starting positions
    function getRandomPosition() {
        return Math.random() * (userBoxWidth / 2) * 2 - (userBoxWidth / 2); // random between -width/2 and +width/2
    }

    // Generate random angle (in radians) between 0 and 2 * PI (360)
    function getRandomAngle() {
        return Math.random() * Math.PI * 2; // Random angle between 0 and 2π (360 degrees)
    }

    const particles = [];

    for (let i = 0; i < numParticles; i++) {
        const angle = getRandomAngle();  // Random direction (angle)

        // Calculate the x and y components of the velocity based on the random angle
        const vx = userVelocity * Math.cos(angle); // X velocity component
        const vy = userVelocity * Math.sin(angle); // Y velocity component

        const atom = new Atom(
            getRandomPosition(),
            getRandomPosition(),
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
    canvas.style.border = "2px solid black";

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
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw each atom
        for (let i = 0; i < particles.length; i++) {
            let drawX = (canvas.width / 2) + particles[i].x * 100;
            let drawY = (canvas.height / 2) - particles[i].y * 100;

            ctx.beginPath();
            ctx.arc(drawX, drawY, 5, 0, Math.PI * 2);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.closePath();
        }
    }

    let stepCount = 0;
    const timeStep = 0.50;

    const interval = setInterval(() => {
        if (stepCount >= maxSteps) {
            clearInterval(interval);
            console.log("Simulation stopped after " + maxSteps + " time steps.");
            return;
        }

        // Update positions and draw each atom
        for (let i = 0; i < particles.length; i++) {
            particles[i].updatePosition(timeStep, userBoxWidth, userBoxHeight, mode);
        }

        draw(); // Redraw all atoms
        stepCount++;
    }, 100); // 100 ms interval (roughly 10 FPS)
});

