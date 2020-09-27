var actors = {};
var statics = {};
var gravity = 1;

function initLogic(){
  createActor("player");
  createBlock("block");
  createBlock("floor");
  game.display.createBlock("floor", 200, 100, 300, 10);
  statics["floor"].x = 200;
  statics["floor"].y = 100;
  statics["floor"].w = 300;
  statics["floor"].h = 10;
  window.setInterval(logicTick, 1000/10);

}

function createActor(uid) {
  let actor = {
    "uid" : uid,
    "vX" : 0,
    "vY" : 0,
    "maxVX" : 7,
    "x" : 250,
    "y" : 0,
    "h" : 17,
    "w" : 15,
    "onFloor" : false
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
    "y" : 50,
    "h" : 5,
    "w" : 20,
    "onFloor" : false,
    "grabbed" : false,
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

function getEdges(obj, lr){
  if(lr === "left"){
    let edges = {
      "topLeft" : (obj.x - (obj.w / 2)) + (obj.h / 2),
      "bottomeLeft" : (obj.x - (obj.w / 2)) - (obj.h / 2)
    }
    return edges;
  }
}

function getDirections(actor, obstacle){
  if ( actor.x - actor.w / 2  > obstacle.x + obstacle.w / 2 ){
    let edge = getEdges(actor, "left");
    if((actor.x - actor.w / 2) + actor.vX < obstacle.x + obstacle.w / 2){
        //console.log(actor.vX);
    }


  } else if (actor.x < obstacle.x){
    //console.log("Left");
  }
  return "Left";
}

function logicTick(){

  for (let uid in actors){

    let actor = actors[uid];
    actor.x += Math.min(actor.vX, actor.maxVX);
    actor.y += actor.vY;
    game.display.moveSprite(uid, actor.x, actor.y);
    actor.onFloor = false;
    for(let sid in statics){
      let static = statics[sid];



            if(static.uid === "block" || static.uid === "floor")
            {
                if(actor.vX > 0)
                {
                    if(actor.x+Math.floor(actor.w/2) <= static.x - static.w/2
                    && actor.x+Math.floor(actor.w/2)+actor.vX >= static.x - static.w/2)
                    {
                        var crossX = -actor.vY * ((actor.x+Math.floor(actor.w/2)-static.x)/actor.vX);
                        if(actor.y+crossX         >= static.y
                        && actor.y+crossX-actor.h <= static.y+static.h)
                        {
                            actor.vX = static.x-(actor.x+Math.floor(actor.w/2));
                        }
                    }
                }
                else if(actor.vX < 0)
                {
                    if(actor.x-Math.floor(actor.w/2)   >= static.x+static.w
                    && actor.x-Math.floor(actor.w/2)+actor.vX <= static.x+static.w)
                    {
                        var crossX = -actor.vY * (((actor.x-Math.floor(actor.w/2))-(static.x+static.w))/actor.vX);
                        if(actor.y+crossX         >= static.y
                        && actor.y+crossX-actor.h <= static.y+static.h)
                        {
                            actor.vX = static.x+static.w-(actor.x-Math.floor(actor.w/2));
                        }
                    }
                }

                if(actor.vY < 0)
                {
                    if(actor.y-actor.h >= static.y+static.h
                    && actor.y+actor.vY-actor.h < static.y+static.h)
                    {
                        var crossY = -actor.vX * (((actor.y-actor.h)-(static.y+static.h))/actor.vY);
                        if(actor.x+crossY+Math.floor(actor.w/2) > static.x
                        && actor.x+crossY-Math.floor(actor.w/2) < static.x+static.w)
                        {
                            if(actor.y !== static.y)
                            {
                                actor.vX = crossY;
                            }

                            actor.vY = (static.y+static.h+actor.h)-actor.y;

                        }
                    }
                }
            }


            //if(game.level[n].type === "block"
            //|| (game.level[n].type === "platform" && !(actor.crouch && actor.jumping === 8)))
            if(actor.vY > 0)
            {
                if(actor.y <= static.y
                && actor.y+actor.vY > static.y)
                {
                    var crossY = -actor.vX * ((actor.y-static.y)/actor.vY);
                    if(actor.x+crossY+Math.floor(actor.w/2) > static.x - static.w/2
                    && actor.x+crossY-Math.floor(actor.w/2) < static.x+static.w / 2)
                    {
                        if(actor.y !== static.y)
                        {
                            actor.vX = crossY;
                        }
                        actor.vY = static.y-actor.y;
                        actor.onFloor = true;
                        //actor.jumping = 4;
                        //actor.onwall = false;
                    }
                }
            }
            if(actor.onFloor === false){
              actor.vY += 1;
            }

        }

        controls(game.input.keyspressed, actor);
    }




  }
