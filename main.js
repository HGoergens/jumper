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

    game.display.createBlock = function(uid,x,y,w,h)
    {
      var sprite = new PIXI.Graphics();
          sprite.beginFill(0x0000FF);
          sprite.drawRect(0,0,w,h);
          sprite.endFill();
          sprite.position.x = x;
          sprite.position.y = y;
      game.app.stage.addChild(sprite);
      game.display.sprites[uid] = sprite;
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

  //----------------------------------------------------------

    //Create class with Interaction-Catalog
    //Read values in your game loop from "Input.keyspressed"
    //Button default allows single characters or Gamepad in syntax "GP"+<gamepadId>+"_"+<buttonId>
    //Axis default needs Gamepad in syntax "GP"+<gamepadId>+"_AX"+<axisId>
    game.input = new class_userinputmanager({
        pl1jump: {default:" ",      type:"button"},
        pl1moveLeft:  {default:"a",      type:"button"},
        pl1dash:   {default:"s",      type:"button"},
        pl1moveRight:   {default:"d",      type:"button"},
        pl1menu:   {default:"m",      type:"button"},
        pl1NS_move:{default:"",				type:"axes"},
        pl1EW_move:{default:"",       type:"axes"},
        pl2attack: {default:"GP0_0",  type:"button"},
        pl2block:  {default:"GP0_1",  type:"button"},
        pl2dash:   {default:"GP0_2",  type:"button"},
        pl2jump:   {default:"GP0_3",  type:"button"},
        pl2menu:   {default:"GP0_4",  type:"button"},
        pl2NS_move:{default:"GP0_AX1",type:"axes"},
        pl2EW_move:{default:"GP0_AX0",type:"axes"}
      });




    //TMP - Open settings UI
    //document.body.appendChild(game.input.showConfig());



  game.displayTick = function()
  {

  }
  game.displayTick();

  initLogic();
}
