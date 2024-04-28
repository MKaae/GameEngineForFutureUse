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

const controls = {
    left: false,
    right: false,
    up: false,
    down: false
}

export function getTiles(){
    return tiles;
}

export function getItem(){
    return item;
}

export function getEnemies(){
    return enemies;
}

export function getPlayer(){
    return player;
}

export function getControls(){
    return controls;
}