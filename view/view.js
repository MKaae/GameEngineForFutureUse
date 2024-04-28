import { 
    runGame, changeDirectionDown, changeDirectionUp, 
    getTileCoord, getItems, playerSpeedChange
} from "../controller/controller.js";

start();
function start() {
    addKeyListeners();
    runGame();
}

export function displayItems(GRID_WIDTH, GRID_HEIGHT, TILE_SIZE) {
    const itemsContainer = document.getElementById("items");
    itemsContainer.innerHTML = "";
    itemsContainer.style.setProperty("--GRID_WIDTH", GRID_WIDTH);
    itemsContainer.style.setProperty("--GRID_HEIGHT", GRID_HEIGHT);
    itemsContainer.style.setProperty("--TILE_SIZE", TILE_SIZE+"px");
    const item = getItems();
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

export function createTiles(GRID_WIDTH, GRID_HEIGHT, TILE_SIZE){
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

export function displayTiles(GRID_WIDTH, GRID_HEIGHT){ 
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

export function displayPlayerAtPosition(player) {
    const visualPlayer = document.getElementById('player');
    visualPlayer.style.translate = `${player.x - player.regX}px ${player.y - player.regY}px`;
}

export function displayPlayerAnimation(player){
    const visualPlayer = document.getElementById('player');

    if(!player.moving){
        visualPlayer.classList.remove('animate');
    } else {
        visualPlayer.classList.add('animate');
        visualPlayer.classList.remove('up', 'down', 'left', 'right');
        visualPlayer.classList.add(player.direction);
    } 
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
        playerSpeedChange(240);
    } else if (key === 'd'){
        playerSpeedChange(120);
    }
}


export function highlightTile( {row, col}, GRID_WIDTH ) {
    const visualTiles = document.querySelectorAll("#background .tile");
    const visualTile = visualTiles[row * GRID_WIDTH + col];

    visualTile.classList.add('highlight');
}   

export function unHighlightTile( {row, col}, GRID_WIDTH ){
    const visualTiles = document.querySelectorAll("#background .tile");
    const visualTile = visualTiles[row * GRID_WIDTH + col];

    visualTile.classList.remove('highlight');
}

export function showDebugPlayerRect(player){
    const visualPlayer = document.getElementById('player');
    if(!visualPlayer.classList.contains('show-rect')){
        visualPlayer.classList.add('show-rect');
    }
    visualPlayer.style.setProperty("--regX", player.regX +"px")
    visualPlayer.style.setProperty("--regY", player.regY +"px")
}

export function showDebugRegistrationPoint(){
    const visualPlayer = document.getElementById('player');
    if(!visualPlayer.classList.contains('show-reg-point')){
        visualPlayer.classList.add('show-reg-point');
    }
}

export function showDebugPlayerHitbox(player) {
    const visualPlayer = document.getElementById('player');
    if(!visualPlayer.classList.contains('show-hitbox')){
        visualPlayer.classList.add('show-hitbox');
    }
    visualPlayer.style.setProperty("--hitboxX", player.hitbox.x + "px");
    visualPlayer.style.setProperty("--hitboxY", player.hitbox.y + "px");
    visualPlayer.style.setProperty("--hitboxW", player.hitbox.w + "px");
    visualPlayer.style.setProperty("--hitboxH", player.hitbox.h + "px");
}