// Variables

const block = document.getElementById("block");
const chtr = document.getElementById("character");
const msg = document.getElementById("message");
const scr = document.getElementById("score");
const game = document.getElementById("game");
let score = 0;
const scoresObj = {
    highScores: []
};

// Starting

// waits for page to fully load
document.addEventListener("readystatechange", (event) => {
    if(event.target.readyState === "complete") {
        localStorage.setItem("highScores", JSON.stringify(scoresObj));
        start_game();
    }
})

// begins the game
const start_game = () => {

    block.style.display = "block";
    score = 0;
    scr.textContent = `Score = ${score}`;
    document.addEventListener('keydown', (event) => {
   
        if(event.key === ' '){
            msg.style.display = "none";
            jump();
        } 
        
        block.style.animation = "block 1s infinite linear";
    
    });
    checkCollision();
}

// Mechanics

// allows jumping
const jump = () => {

    if (chtr.classList != "animate"){
        chtr.classList.add("animate");
    }
    setTimeout(()=>{
        chtr.classList.remove("animate");
    }, 500)

}

// checks if elements collide or pass
function checkCollision() {
    
    const req = requestAnimationFrame(checkCollision);
    if (isColliding(block, chtr)) {

        // Collision detected
        cancelAnimationFrame(req);
        console.log('Collision detected!');

        block.style.display = "none";
        block.style.animation = "none";

        msg.textContent = "You Lost";

        const playerName = prompt("Enter your name:");

        // logging score
        const topScores = JSON.parse(localStorage.getItem("highScores"));
        console.log(topScores);
        topScores["highScores"].push([playerName, score]);
        topScores["highScores"].sort((a, b) => b[1] - a[1]);
        if(topScores["highScores"].length == 11){
            topScores["highScores"].pop();
        }
        localStorage.setItem("highScores", JSON.stringify(topScores));

        setTimeout(()=>{
            msg.textContent = "Play Again?";
        }, 2000);
        msg.style.display = "block";

        block.style.display = "block";
        restart();

    } else if(isPassed(block, chtr)){
        cancelAnimationFrame(req);
        console.log('Block Passed!');
        score += 1;
        console.log(score);
        scr.textContent = `Score = ${score}`;

        setTimeout(() => {
            requestAnimationFrame(checkCollision);
        }, 300);

    }
}

// defines what colliding is
const isColliding = (element1, element2) => {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

// defines what passing is
const isPassed = (element1, element2) => {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return (
        rect1.left < rect2.right
    );
}

// Restarting

// restart game
const restart = () => {

    chtr.classList.remove("animate");

    document.removeEventListener('keydown', (event) => {
   
        if(event.key === ' '){
            jump();
        }
        block.classList.add("move");
    
    });

    document.addEventListener("keydown", final_step);

}

// removes final eventListener
const final_step = (event) => {
    if (event.key === ' ') {
        event.preventDefault();

        document.removeEventListener('keydown', final_step);
        start_game()
    }
}