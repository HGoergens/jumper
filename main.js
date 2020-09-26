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
  game.app = new PIXI.Application({ antialias: true,width:game.state.w,height:game.state.h});
  document.body.appendChild(game.app.view);


  //input
  game.input = {};


  game.tick = function()
  {

  }
}
