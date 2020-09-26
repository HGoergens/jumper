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

  //game logic
  //Mapdata worker
  game.worker = new Worker('md_worker.js');

  //Output
  game.worker.addEventListener('message', function(e) {

      for(var n in e.data)
      {

      }

  }, false);

//Input
  game.worker.postMessage({xyz:true});


  //input
  game.input = {};


  game.tick = function()
  {

  }
  game.tick();
}
