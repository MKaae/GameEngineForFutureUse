let lastTimestamp = 0;

const player = {
    x: 14,
    y: 14,
    regX: 11,
    regY: 12,
    hitbox: {
        x: 6,
        y: 13,
        w: 11,
        h: 13,
    },
    speed: 120,
    moving: false,
    direction: undefined,
}

const tiles = [
    [1,3,4,0,4,3,0,0,6,6,6,6,6,1,0,0],
    [1,0,0,0,0,0,0,0,6,8,8,8,6,5,2,2],
    [1,0,4,3,4,0,4,3,6,8,8,8,6,1,0,4],
    [1,1,1,1,1,1,1,1,6,8,8,8,6,1,4,0],
    [0,4,0,0,0,0,4,1,6,8,8,8,6,1,0,0],
    [0,0,0,4,0,0,0,1,6,6,9,6,6,1,0,0],
    [0,3,3,3,0,3,0,1,11,4,0,4,11,1,0,4],
    [4,3,0,3,0,3,4,1,11,3,0,3,11,1,4,0],
    [0,3,0,3,0,3,0,1,1,1,1,1,1,1,1,1],
    [4,3,0,0,0,3,0,1,2,2,2,1,0,4,0,4],
    [0,3,3,3,3,3,0,1,2,3,2,5,2,2,2,2],
    [0,4,0,0,0,0,4,1,2,2,2,1,4,0,0,4]
];

const item = [
    {type: "gold", row: 0, col: 7, pickedUp: false},
    {type: "gold", row: 0, col: 15, pickedUp: false},
]

const enemies = [
    {type: "ghost", row: 5, col: 8, alive: true},
    {type: "ghost", row: 12, col: 6, alive: true}
]

const GRID_HEIGHT = tiles.length;
const GRID_WIDTH = tiles[0].length;
const TILE_SIZE = 32;

function displayItems() {
    const itemsContainer = document.getElementById("items");
    itemsContainer.innerHTML = "";
    itemsContainer.style.setProperty("--GRID_WIDTH", GRID_WIDTH);
    itemsContainer.style.setProperty("--GRID_HEIGHT", GRID_HEIGHT);
    itemsContainer.style.setProperty("--TILE_SIZE", TILE_SIZE+"px");

    item.forEach((item) => {
        if (!item.pickedUp) {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item", item.type);
            itemDiv.style.gridRowStart = item.row + 1;
            itemDiv.style.gridColumnStart = item.col + 1;
            itemsContainer.appendChild(itemDiv);
        }
    })
}


function getTileCoord( {row, col} ){
    return tiles[row][col];
}

function createTiles(){
    const background = document.getElementById("background");

    for(let i = 0; i < GRID_HEIGHT; i++){
        for(let j = 0; j < GRID_WIDTH; j++){
            const tile = document.createElement("tile");
            tile.classList.add("tile");
            background.append(tile);
        }
    }
    background.style.setProperty("--GRID_WIDTH", GRID_WIDTH);
    background.style.setProperty("--GRID_HEIGHT", GRID_HEIGHT);
    background.style.setProperty("--TILE_SIZE", TILE_SIZE+"px");
}

function displayTiles(){ 
    const visualTiles = document.querySelectorAll("#background .tile");

    for(let i = 0; i < GRID_HEIGHT; i++){
        for(let j = 0; j < GRID_WIDTH; j++){
            const modelTile = getTileCoord( {row: i, col: j} )
            const visualTile = visualTiles[i * GRID_WIDTH + j];

            visualTile.classList.add( getClassForTileType( modelTile ));
        }
    }
}

function getClassForTileType(tiletype){
    switch(tiletype){
        case 0: return "grass"; break;
        case 1: return "path"; break;
        case 2: return "water"; break;
        case 3: return "tree"; break;
        case 4: return "flower"; break;
        case 5: return "planks"; break;
        case 6: return "housewall"; break;
        case 7: return "pot"; break;
        case 8: return "floor"; break;
        case 9: return "door"; break;
        case 10: return "fencehor"; break;
        case 11: return "fencever"; break;
        case 12: return "gold"; break;
        case 13: return "chest"; break;
    }
}

const controls = {
    left: false,
    right: false,
    up: false,
    down: false
}
start();
function start() {
    console.log("JS Running");
    addKeyListeners();
    requestAnimationFrame(tick);
    createTiles();
    displayTiles();
    displayItems();
}

function displayPlayerAtPosition() {
    const visualPlayer = document.getElementById('player');
    visualPlayer.style.translate = `${player.x - player.regX}px ${player.y - player.regY}px`;
}

function tick(timestamp) {
    requestAnimationFrame(tick)

    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    movePlayer(deltaTime);

    displayPlayerAtPosition();
    displayPlayerAnimation();
    showDebugging();
}

function displayPlayerAnimation(){
    const visualPlayer = document.getElementById('player');

    if(!player.moving){
        visualPlayer.classList.remove('animate');
    } else {
        visualPlayer.classList.add('animate');
        visualPlayer.classList.remove('up', 'down', 'left', 'right');
        visualPlayer.classList.add(player.direction);
    } 
}

function coordsFromPos( {x, y} ){
    const row = Math.floor(y/32);
    const col = Math.floor(x/32);
    const coord = {row, col}
    return coord;
}

function posFromCoord( {row, col} ){

}

function getTilesUnderPlayer( player, newPos={x:player.x, y:player.y} ){
    const tileCoords = [];

    const topLeft = {x: newPos.x - player.regX + player.hitbox.x, y: newPos.y - player.regY + player.hitbox.y}
    const topRight = {x: topLeft.x + player.hitbox.w, y: topLeft.y}
    const bottomLeft = {x: topLeft.x, y: topLeft.y + player.hitbox.h}
    const bottomRight = {x: topLeft.x + player.hitbox.w, y: topLeft.y + player.hitbox.h}

    const topLeftCoords = coordsFromPos(topLeft);
    const topRightCoords = coordsFromPos(topRight);
    const bottomLeftCoords = coordsFromPos(bottomLeft);
    const bottomRightCoords = coordsFromPos(bottomRight);

    tileCoords.push(topLeftCoords);
    tileCoords.push(topRightCoords);
    tileCoords.push(bottomLeftCoords);
    tileCoords.push(bottomRightCoords);

    return tileCoords;
}

function movePlayer(deltaTime) {
    player.moving = false;

    const newPos = {
        x: player.x,
        y: player.y
    }

    if (controls.right) {
        player.moving = true;
        player.direction = "right";
        newPos.x += player.speed * deltaTime;
    } else if (controls.left) {
        player.moving = true;
        player.direction = "left";
        newPos.x -= player.speed * deltaTime;
    }

    if (controls.up) {
        player.moving = true;
        player.direction = "up";
        newPos.y -= player.speed * deltaTime;
    } else if (controls.down) {
        player.moving = true;
        player.direction = "down";
        newPos.y += player.speed * deltaTime;
    }
    
    if(canMovePlayerToPos(player, newPos)){
        player.x = newPos.x;
        player.y = newPos.y;
    } else {
        player.moving = false;
        const newXpos = {
            x: newPos.x,
            y: player.y
        }
        const newYpos = {
            x: player.x,
            y: newPos.y
        }
        if(canMovePlayerToPos(player, newXpos)){
            player.moving = true;
            player.x = newPos.x;
            player.y = player.y;
        }
        if(canMovePlayerToPos(player, newYpos)) {
            player.moving = true;
            player.x = player.x;
            player.y = newPos.y;
        } 
    } 
}

function canMovePlayerToPos(player, pos){
    const coords = getTilesUnderPlayer(player, pos);
    return coords.every(canMoveTo);
}

function canMoveTo({row, col}){
    if(row < 0 || row >= GRID_HEIGHT || col < 0 || col >= GRID_WIDTH){
       return false;
    } 
    const tileType = getTileCoord( {row, col} );
    switch(tileType){
        case 0: return true; break;
        case 1: return true; break;
        case 2: return false; break;
        case 3: return false; break;
        case 6: return false; break;
        case 7: return false; break;
        case 9: return false; break;
        case 10: return false; break;
        case 11: return false; break;
        case 12: return false; break;
        case 13: return false; break;
    }
    return true;
}

function addKeyListeners() {
    document.addEventListener('keydown', () => keyDown(event))
    document.addEventListener('keyup', () => keyUp(event))
}

function keyUp(event) {
    const key = event.key;
    changeDirectionUp(key);
}

function keyDown(event) {
    const key = event.key;
    changeDirectionDown(key);
    if(key === 'a'){
        player.speed = 240;
    } else if (key === 'd'){
        player.speed = 120;
    }
}

function changeDirectionUp(newInput) {
    switch (newInput) {
        case "ArrowLeft": controls.left = false; break;
        case "ArrowRight": controls.right = false; break;
        case "ArrowUp": controls.up = false; break;
        case "ArrowDown": controls.down = false; break;
    }
}

function changeDirectionDown(newInput) {
    switch (newInput) {
        case "ArrowLeft": controls.left = true; break;
        case "ArrowRight": controls.right = true; break;
        case "ArrowUp": controls.up = true; break;
        case "ArrowDown": controls.down = true; break;
    }
}   

function showDebugging(){
    showDebugTilesUnderPlayer();
    showDebugPlayerRect();
    showDebugRegistrationPoint();
    showDebugPlayerHitbox();
}


let highlightedTiles = [];

function showDebugTilesUnderPlayer(){
    highlightedTiles.forEach(unHighlightTile);

    const tileCoords = getTilesUnderPlayer(player);
    tileCoords.forEach(highlightTile);

    highlightedTiles = tileCoords;
}

function highlightTile( {row, col} ) {
    const visualTiles = document.querySelectorAll("#background .tile");
    const visualTile = visualTiles[row * GRID_WIDTH + col];

    visualTile.classList.add('highlight');
}   

function unHighlightTile( {row, col} ){
    const visualTiles = document.querySelectorAll("#background .tile");
    const visualTile = visualTiles[row * GRID_WIDTH + col];

    visualTile.classList.remove('highlight');
}

function showDebugPlayerRect(){
    const visualPlayer = document.getElementById('player');
    if(!visualPlayer.classList.contains('show-rect')){
        visualPlayer.classList.add('show-rect');
    }
    visualPlayer.style.setProperty("--regX", player.regX +"px")
    visualPlayer.style.setProperty("--regY", player.regY +"px")
}

function showDebugRegistrationPoint(){
    const visualPlayer = document.getElementById('player');
    if(!visualPlayer.classList.contains('show-reg-point')){
        visualPlayer.classList.add('show-reg-point');
    }
}

function showDebugPlayerHitbox() {
    const visualPlayer = document.getElementById('player');
    if(!visualPlayer.classList.contains('show-hitbox')){
        visualPlayer.classList.add('show-hitbox');
    }
    visualPlayer.style.setProperty("--hitboxX", player.hitbox.x + "px");
    visualPlayer.style.setProperty("--hitboxY", player.hitbox.y + "px");
    visualPlayer.style.setProperty("--hitboxW", player.hitbox.w + "px");
    visualPlayer.style.setProperty("--hitboxH", player.hitbox.h + "px");
}