let vendors = ['webkit', 'moz'];
for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
        window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}

let requests = [];
let goals = [];
let textInterface = new TextInterface();
let game = new Game();
let gameState = new GameState();
let level = new Levels(0);
let canvas = document.getElementById('canvas'),
    cw = canvas.width,
    ch = canvas.height,
    fps = 30,
    interval = 1000 / fps,
    lastTime = (new Date()).getTime(),
    currentTime = 0,
    delta = 0;
cx = canvas.getContext('2d');

let Background = new TileSheet(cx);
let testTile = new TestTile(cx);
let music = new Music();


function areAllRequestsConnected(){
    let completed = true;
    requests.forEach(request => {
        if(request.isConnected(level.getCurrentLevel().map) === false){
            completed = false;
        }
    });
    if(completed){
        console.log('you did good');
        level.setNextLevel();
        if(level.currentLevel === 3){
            gameState.state = 'end';
        }else{
            gameState.initiateLevel(level.getCurrentLevel());
        }

    }else{
        gameState.state = 'dead';
        console.log('lost!!!');
    }
}

let state = {
    pressedKeys: {
        space: false,
        left: false,
        right: false,
        up: false,
        down: false
    }
};

let keyMap = {
    'Enter': 'we tryin',
    'ArrowRight': 'right',
    'ArrowLeft': 'left',
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'Space': 'space'
};

function keydown(event) {
    let key = keyMap[event.code];
    state.pressedKeys[key] = true;

}

function keyup(event) {
    let key = keyMap[event.code];
    state.pressedKeys[key] = false
}

function onClick(event) {
    level.changeTile(event.pageX, event.pageY);
}

window.addEventListener("keydown", keydown, false);
window.addEventListener("keyup", keyup, false);

// mouse click
window.addEventListener("click", onClick, false);

/*
// Test array include
let array1 = [[0,1],[0,2]];
let array2 = [[1],2,3];
console.log(array2.includes([1]));
let a = [1];
let b = [1];
if(a===b){
    console.log("they match");
}

console.log(searchForArray(array1,[0,2])); // 0
*/
function searchForArray(haystack, needle){
    var i, j, current;
    for(i = 0; i < haystack.length; ++i){
        if(needle.length === haystack[i].length){
            current = haystack[i];
            for(j = 0; j < needle.length && needle[j] === current[j]; ++j);
            if(j === needle.length)
                return i;
        }
    }
    return -1;
}

function gameLoop() {
    window.requestAnimationFrame(gameLoop);

    testTile.x=3*64;
    testTile.y=3*64;

    // Press Space in main menu
    if(state.pressedKeys.space && gameState.state==='start_menu'){
        gameState.initiateLevel(level.getCurrentLevel());
        gameState.state='level1';
    }

    // Press Space if dead
    if(state.pressedKeys.space && gameState.dead===true){
        gameState.initiateLevel(level.getCurrentLevel());
        gameState.state='inGame';
    }

    currentTime = (new Date()).getTime();
    delta = (currentTime - lastTime);

    if (delta > interval) {

        cx.clearRect(0, 0, cw, ch);

        // Stage
        if(gameState.state==='start_menu'){
            cx.clearRect(0, 0, cw, cw);
            textInterface.renderStart();
        }else if(gameState.state==='end'){
            cx.clearRect(0, 0, cw, cw);
            textInterface.renderEnd();
        }else if(gameState.state==='dead'){
            game.update();
            textInterface.renderDead();
        }else{
            game.update();

        }

        lastTime = currentTime - (delta % interval);
    }
}


// get images
Promise.all([
    loadImage("assets/images/ground.png"),
    loadImage("assets/images/robot.png"),
    loadImage("assets/images/objects.png"),
    loadImage("assets/images/enemy.png"),
])
    .then(() => {
        // draw images to canvas

        gameLoop();

    });


// function to retrieve an image
function loadImage(url) {
    return new Promise((fulfill) => {
        let imageObj = new Image();
        imageObj.onload = () => fulfill(imageObj);
        imageObj.src = url;
    });
}

// A * STAR Example needed for isConnected
var graph = new Graph([
    [1,1,1,1],
    [0,0,0,0],
    [0,0,1,1]
]);
var start1 = graph.grid[0][0];
var end1 = graph.grid[2][2];
var result = astar.search(graph, start1, end1);
console.log(result);
