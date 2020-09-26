var actors = {};
var floor = 100;
var gravity = 1;

function initLogic(){
  createActor("player");
  window.setInterval(logicTick, 1000/60);

}

function createActor(uid) {
  let actor = {
    "vX" : 0,
    "vY" : 0,
    "x" : 0,
    "y" : 0,
    "h" : 10,
    "w" : 10,
    }
  if(actors[uid] === undefined) {
    actors[uid] = actor;
    game.display.createSprite(uid, actor.x, actor.y, actor.w, actor.h);

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
    }

  }

}
