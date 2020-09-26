var actors = {};
var statics = {};
//var floor = 100;
var gravity = 1;

function initLogic(){
  createActor("player");
  createBlock("block");
  game.display.createBlock("block", 90, 80, 20, 5);
  statics["block"].x = 90;
  statics["block"].y = 80;
  statics["block"].w = 20;
  statics["block"].h = 5;
  createBlock("floor");
  game.display.createBlock("floor", 0, 100, 500, 10);
  statics["floor"].x = 0;
  statics["floor"].y = 100;
  statics["floor"].w = 500;
  statics["floor"].h = 10;
  window.setInterval(logicTick, 1000/10);

}

function createActor(uid) {
  let actor = {
    "uid" : uid,
    "vX" : 0,
    "vY" : 0,
    "x" : 0,
    "y" : 0,
    "h" : 17,
    "w" : 15,
    "onFloor" : false,
    }
  if(actors[uid] === undefined) {
    actors[uid] = actor;
    game.display.createSprite(uid, actor.x, actor.y, actor.w, actor.h);

  }

}

function createBlock(uid) {
  let block = {
    "uid" : uid,
    "vX" : 0,
    "vY" : 0,
    "x" : 90,
    "y" : 80,
    "h" : 5,
    "w" : 20,
    "onFloor" : false,
    }
  if(statics[uid] === undefined) {
    statics[uid] = block;
    game.display.createBlock(uid, block.x, block.y, block.w, block.h);

  }

}


function controls(controller, actor){

    if(controller["pl1moveRight"] === 1){
      actor.vX += 1;

    } else if (controller["pl1moveLeft"] === 1){
      actor.vX -= 1;

    } else {

      actor.vX = 0;

    }

    if(controller["pl1jump"] === 1 && actor.onFloor === true){
      actor.vY = -10;
      actor.onFloor = false;

    } else if (controller["pl1jump"] === undefined) {
      actor.vY = Math.max(actor.vY, 0);
    }
}

function logicTick(){

  for (let uid in actors){

    let actor = actors[uid];
    actor.x += actor.vX;
    actor.y += actor.vY;
    game.display.moveSprite(uid, actor.x, actor.y);
    actor.onFloor = false;
    for(let sid in statics){
      let static = statics[sid];

      if(actor.y + actor.h >= static.y && (actor.x + actor.w) > static.x && actor.x < (static.x + static.w)  ){
        actor.vY = 0;
        actor.y = static.y-actor.h;
        actor.onFloor = true;
      }

    }
    if(actor.onFloor === false){
      actor.vY += gravity;
    }
      controls(game.input.keyspressed, actor);


  }

}
