console.log("init")

var game = {};

function initGame()
{
  //state
  game.state = {};
  game.state.w = 500;
  game.state.h = 400;

  //display
  game.display = {};
  game.app = new PIXI.Application({ antialias: false,width:game.state.w,height:game.state.h});
  document.body.appendChild(game.app.view);

  game.display.sprites = {};
    game.display.createSprite = function(uid,x,y,w,h)
    {
      var sprite = new PIXI.Graphics();
          sprite.beginFill(0xFF0000);
          sprite.drawRect(-w/2,-h,w,h);
          sprite.endFill();
          sprite.position.x = x;
          sprite.position.y = y;
      game.app.stage.addChild(sprite);
      game.display.sprites[uid] = sprite;
    }

    game.display.moveSprite = function(uid,x,y)
    {
      //console.log(uid,x,y)
      game.display.sprites[uid].position.x = x;
      game.display.sprites[uid].position.y = y;
    }

  //game logic
  /*
  //Mapdata worker
  game.worker = new Worker('md_worker.js');

  //Output from worker
  game.worker.addEventListener('message', function(e) {

      console.log(e);

  }, false);

//Input to worker
  game.worker.postMessage({xyz:true});
*/

  //input
  game.input = {};


  game.displayTick = function()
  {

  }
  game.displayTick();

  initLogic();
}
