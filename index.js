"use strict";
const Canvas = require("drawille-canvas");
const blessed = require('blessed');
const screen = blessed.screen({
    fastCSR: true
});

let c;
let flush;

let canvas = new Canvas();
c = canvas.getContext('2d');

if (typeof document !== 'undefined') {
    document.body.appendChild(canvas);
    flush = function() {};
}
else {
    flush = function() {
        console.log(c.toString());
    };
}

const snake = {
    body: [
        {x:10,y:10},
        {x:11,y:10},
        {x:12,y:10},
        {x:13,y:10},
        {x:14,y:10},
    ],
    direction: "left",
};
screen.key("w",(ch,key)=>snake.direction!="down"?snake.direction="up":0);
screen.key("s",(ch,key)=>snake.direction!="up"?snake.direction="down":0);
screen.key("a",(ch,key)=>snake.direction!="right"?snake.direction="left":0);
screen.key("d",(ch,key)=>snake.direction!="left"?snake.direction="right":0);
screen.key(["esc","C-c"],()=> process.exit(0));

let fruits = [
    {x:100,y:100}
];

let i = 0;
function move(){
    const eaten = fruits.filter(f => f.x-snake.body[0].x==0&&f.y-snake.body[0].y == 0).length > 0?0:1;
    fruits = fruits.filter(f => f.x-snake.body[0].x!=0||f.y-snake.body[0].y != 0);
    const collisionMap = snake.body.reduce((acc,curr)=>{
        acc[JSON.stringify(curr)] = acc[JSON.stringify(curr)]!=undefined?acc[JSON.stringify(curr)]+1:1;
        return acc;
    },{});
    if(Object.values(collisionMap).filter(v => v > 1).length > 0) process.exit(0);
    switch(snake.direction){
        case "up":
        snake.body = [{x:snake.body[0].x,y:(snake.body[0].y-1+canvas.height)%canvas.height},...snake.body.slice(0,snake.body.length-eaten)];
        break
        case "down":
        snake.body = [{x:snake.body[0].x,y:(snake.body[0].y+1+canvas.height)%canvas.height},...snake.body.slice(0,snake.body.length-eaten)];
        break
        case "left":
        snake.body = [{x:(snake.body[0].x-1+canvas.width)%canvas.width,y:snake.body[0].y},...snake.body.slice(0,snake.body.length-eaten)];
        break
        case "right":
        snake.body = [{x:(snake.body[0].x+1+canvas.width)%canvas.width,y:snake.body[0].y},...snake.body.slice(0,snake.body.length-eaten)];
        break
    }
    if(i%100 == 0){
        fruits.push({x:Math.round(Math.random()*canvas.width),y:Math.round(Math.random()*canvas.height)})
    }
    i++;
}
function draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    snake.body.forEach(e => c.strokeRect(e.x,e.y, 0, 0))
    fruits.forEach(f => c.strokeRect(f.x,f.y, 0, 0))
    flush();
}

setInterval(draw, 1000/15);
setInterval(move, 1000/30);