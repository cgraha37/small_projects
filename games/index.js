// Variables

const block = document.getElementById("block");
const chtr = document.getElementById("character");
const msg = document.getElementById("message");
const scr = document.getElementById("score");
const game = document.getElementById("game");
const yay = document.getElementById("yay");
const dang = document.getElementById("dang");
const jeez = document.getElementById("jeez");
let score = 0;
let highest = 0;

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

    if (!chtr.classList.contains("character_jump")){
        chtr.classList.add("character_jump");
    }
    setTimeout(()=>{
        chtr.classList.remove("character_jump");
    }, 500)

}

const end_game = (cont) => {

    cancelAnimationFrame(cont);
    jeez.play();
    console.log('Collision detected!');

    block.style.display = "none";
    block.style.animation = "none";

    msg.textContent = "Game Over";

    const playerName = prompt("Enter your name:");

    // logging score
    const topScores = JSON.parse(localStorage.getItem("highScores"));
    console.log(topScores);
    topScores["highScores"].push([playerName, highest]);
    topScores["highScores"].sort((a, b) => b[1] - a[1]);
    if(topScores["highScores"].length == 11){
        topScores["highScores"].pop();
    }
    localStorage.setItem("highScores", JSON.stringify(topScores));

    setTimeout(()=>{
        msg.textContent = `Highest Score ${highest}`;
    }, 2000);
    setTimeout(()=>{
        msg.textContent = "Play Again?  (Press Space)";
    }, 4000);
    msg.style.display = "block";

    block.style.display = "block";
    restart();
}

// checks if elements collide or pass
const checkCollision = () => {
    
    const req = requestAnimationFrame(checkCollision);
    if (is_colliding(block, chtr)) {

        cancelAnimationFrame(req);
        score -= 5;
        if (score <= 0) end_game(req);
        else {
            dang.play();
            chtr.classList.add("character_blink")
            const blink = setInterval(()=>{
                chtr.classList.toggle("character_blink");
            }, 229);

            setTimeout(()=>{
                clearInterval(blink);
                chtr.classList.remove("character_blink")
            }, 1375);
            
            console.log("here");

            setTimeout(()=>{
                requestAnimationFrame(checkCollision);
                }, 1375);
        }
    } else if(is_passed(block, chtr)){
        cancelAnimationFrame(req);
        yay.play();
        console.log('Block Passed!');
        score += 1;

        if(score > highest) highest = score;

        console.log(score);

        setTimeout(() => {
            requestAnimationFrame(checkCollision);
        }, 300);
    }

    scr.textContent = `Score = ${score}`;
}

// defines what colliding is
const is_colliding = (element1, element2) => {
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
const is_passed = (element1, element2) => {
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