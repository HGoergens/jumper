var actors = {};

function initLogic(){
  createActor("player");
  window.setInterval(logicTick, 1000/60);

}

function createActor(uid) {
  let actor = {
    "vX" : 1,
    "vY" : 1,
    "x" : 0,
    "y" : 0,
    "h" : 10,
    "w" : 10,
    }
  if(actors[uid] === undefined) {
    actors[uid] = actor;
    game.display.createSprite(uid, x, y, w, h);

  }

}

function logicTick(){

  for (uid in actors){

    console.log(actors[uid]);
    let actor = actors[uid];
    actor.x += actor.vX;
    actor.y += actor.vY;
    game.display.moveSprite(actor, x, y);

  }

}
