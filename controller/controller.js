import { 
    displayPlayerAnimation, displayPlayerAtPosition, showDebugPlayerHitbox, 
    showDebugPlayerRect, showDebugRegistrationPoint, createTiles,
    highlightTile, unHighlightTile, displayTiles, displayItems
} from "../view/view.js";

import { getTiles, getItem, getEnemies, getPlayer, getControls } from "../model/model.js";

let lastTimestamp = 0;

const tiles = getTiles();
const item = getItem();
const enemies = getEnemies();
const player = getPlayer();
const controls = getControls();

const GRID_HEIGHT = tiles.length;
const GRID_WIDTH = tiles[0].length;
const TILE_SIZE = 32;

export function runGame(){
    createTiles(GRID_WIDTH, GRID_HEIGHT, TILE_SIZE);
    displayTiles(GRID_WIDTH, GRID_HEIGHT);
    displayItems(GRID_WIDTH, GRID_HEIGHT, TILE_SIZE);
    requestAnimationFrame(tick);
}

function tick(timestamp) {
    requestAnimationFrame(tick)

    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    movePlayer(deltaTime);

    displayPlayerAtPosition(player);
    displayPlayerAnimation(player);
    showDebugging();
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


export function changeDirectionUp(newInput) {
    switch (newInput) {
        case "ArrowLeft": controls.left = false; break;
        case "ArrowRight": controls.right = false; break;
        case "ArrowUp": controls.up = false; break;
        case "ArrowDown": controls.down = false; break;
    }
}

export function changeDirectionDown(newInput) {
    switch (newInput) {
        case "ArrowLeft": controls.left = true; break;
        case "ArrowRight": controls.right = true; break;
        case "ArrowUp": controls.up = true; break;
        case "ArrowDown": controls.down = true; break;
    }
}   

function canMovePlayerToPos(player, pos){
    const coords = getTilesUnderPlayer(player, pos);
    return coords.every(canMoveTo);
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



function coordsFromPos( {x, y} ){
    const row = Math.floor(y/32);
    const col = Math.floor(x/32);
    const coord = {row, col}
    return coord;
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

export function getTileCoord( {row, col} ){
    return tiles[row][col];
}

function showDebugging(){
    showDebugTilesUnderPlayer();
    showDebugPlayerRect(player);
    showDebugRegistrationPoint();
    showDebugPlayerHitbox(player);
}

let highlightedTiles = [];

function showDebugTilesUnderPlayer(){
    highlightedTiles.forEach(tileCoords => unHighlightTile(tileCoords, GRID_WIDTH));

    const tileCoords = getTilesUnderPlayer(player);
    tileCoords.forEach(coords => highlightTile(coords, GRID_WIDTH));

    highlightedTiles = tileCoords;
}

export function playerSpeedChange(speed){
    player.speed = speed;
}

export function getItems (){
    return item;
}
