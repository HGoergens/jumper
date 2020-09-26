var actors = {};
var statics = {};
var floor = 100;
var gravity = 1;

function initLogic(){
  createActor("player");
  createBlock("block");
  window.setInterval(logicTick, 1000/10);

}

function createActor(uid) {
  let actor = {
    "uid" : uid,
    "vX" : 0,
    "vY" : 0,
    "x" : 0,
    "y" : 0,
    "h" : 10,
    "w" : 10,
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
    "x" : 0,
    "y" : 0,
    "h" : 10,
    "w" : 10,
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

  for (uid in actors){

    let actor = actors[uid];
    actor.x += actor.vX;
    actor.y += actor.vY;
    game.display.moveSprite(uid, actor.x, actor.y);
    if(actor.y < floor){
      actor.vY += gravity;


    } else {
      actor.vY = 0;
      actor.y = floor;
      actor.onFloor = true;
    }
    if(actor)
    controls(game.input.keyspressed, actor);
  }

}
