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
      var debugbg = new PIXI.Graphics();
          debugbg.beginFill(0xFF0000,0.2);
          debugbg.drawRect(-(w/2),-(h/2),Math.abs(w),Math.abs(h));
          debugbg.endFill();
      var sprite = new PIXI.Sprite(game.spritesheet.textures["char_stand"]);
          sprite.position.x = x;
          sprite.position.y = y;
          sprite.direction = "right";
          sprite.width = w;
          sprite.height = h;
          sprite.anchor.x = 0.5;
          sprite.anchor.y = 0.5;
          sprite.animationFrame = 0;
          sprite.uid = uid;
          sprite.addChild(debugbg);
      game.app.stage.addChild(sprite);
      game.display.sprites[uid] = sprite;
    }

    game.display.moveSprite = function(uid,x,y)
    {
      var sprite = game.display.sprites[uid];

      if(sprite.position.x > x)
      {
        sprite.scale.x = -1;
        sprite.animationFrame++;
      }
      else if(sprite.position.x < x)
      {
        sprite.scale.x = 1;
        sprite.animationFrame++;
      }
      else
      {
         sprite.animationFrame = 0;
      }

      //console.log(x,y);
      if(y !== sprite.y)
      {
        sprite.texture = game.spritesheet.textures["char_jump"];
      }
      else if(sprite.animationFrame !== 0)
      {
        sprite.animationFrame = sprite.animationFrame%12;
        sprite.texture = game.spritesheet.textures["char_run_"+sprite.animationFrame];
      }
      else
      {
        sprite.texture = game.spritesheet.textures["char_stand"];
      }

      sprite.position.x = x;
      sprite.position.y = y;
    }

    game.display.createBlock = function(uid,x,y,w,h)
    {
      var sprite = new PIXI.Graphics();
          sprite.beginFill(0x0000FF);
          sprite.drawRect(-w/2,-h/2,w,h);
          sprite.endFill();
          sprite.position.x = x;
          sprite.position.y = y;
      game.app.stage.addChild(sprite);
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


    PIXI.Loader.shared
        .add("myimage","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATAAAAAQCAYAAACRICNxAAAAAXNSR0IArs4c6QAABDhJREFUeJztWktq40AQLQ3jRTYBeeGNwBiiIxifISfwIXWCOUPIETQQDN54YYM3WWShWYTyVFotqX5WR0QPBIqi+nVVv65uC2DGjBkzJoqs6x9vq7LB+82p7nxvCF56ZsyYErDuNTVvkfXUMQX8Su2ABpQUpwar7z85dm899wL1z+KrVva7j88Q3lZlg9fQu5MjMAxKkySPxHoUpLUwU5Fgytg99aSSneGPSRFYWDySYvIsfA/ylOqwyodyWvspYvfU4xGHRHaKWzhJBxSiyovbGFEd1y2YiR91U3QSGA78dzn/GhrMKi8avIZkx56EY3ZM1y00eA3p4epNGbtUz73qQCNrrfkx5WPj9Z1Q5UXz/HRsPf8dezm2hx97JaEDuls8RN+hPu0vx9t9lRcN/p1623jdQnM+tJ/3jWdIPhL5x9f/P8xct9Dg3ym3jSE4tSTNP+IedWAZu5QH8Vb7qbA51RntdjenOnt+On6pbUSrA4sFTRVKsVzXYhksvP3lmO0WDzcd1K++xOwvx6zKi84WmDuBLDqwCzofSpHvSDqPr5CdDyVI5SkeXyG7bkEcQ18Xx7EfjpvUd2v+EZY6sOZfU/ddOro6Sk/7OFb0WRgjZxsY00MXUgmW6xqW67pXfrQzMG4CYqvm+VB+KWJO8dJVWzuBtJMHiQvJh8pxyAsgvupzY6egPnBiQB+05FnlRUPHXpo3r/wjNHVgzX+oi/tuCIwbyVyjQ2I/JJ/wDItLQjjmSEAa8gL4jP98KHvl70ZgYfHF9q8xdLX82E1IbAO0J5BGB4I7eeiEAwB4+XjnmIQu8tqc6taqxgHVgz5gDH36LLF3bfe48Mg/wlIH1gVEWvehHapHcwCutb+/HG8xcjqgIR+05MXFXTswLBrcEnHlYhMY7/u2NjFZLHy8OH6Ek1Cy4obELe2Y+mLv2kpwDqxxdcWra0UPyVcTu0aWqyeWf84PFpI6sOQfsVzX5glM508K+9gBhTuJPrytyibWtUqxOdXZcl0PLv4tAutqlTXO/PlbqM4CuroXJMLwoDp2//LxfvM5Jse1L135Q3+lqyeVp37gNiJGPGHrT+8pifbpoKBbR0nnFxKfdvskyT8+96wDS/4R2tr30mG1byEfj9gBPutwt3hQnQG6fDdV5UVvtxRD7P0h5+mqjPt2y9nDdQsteW4cKEffl5z/xXzhyKJ8+B2OdPxjOeP6j3L0/THyT2U96sCSf4Sm9mM6AHRz0CIb6gCQ16HVNgXqEeXSi8AAhoMf+tVLU4TeBKaxy0l633dLXB19GHPiaUgb5bzzb5G15D+0+9NIzJu8EOLFKFUHFtMxhgydRFbyGjqnk/g0hjwlUSt5qdr9Ad/GkPXIf2jb8+vzFARm3RF4QxSHB4FNhbw85L2/ZB6787LYvFdRj915WW1SeI1J+FmDRt5CfjGkJLEQ/wDhSqZjXGHsxwAAAABJRU5ErkJggg==")
        .load(function(loader, resources)
        {
          game.spritesheet = new PIXI.Spritesheet(resources["myimage"].texture.baseTexture, spritesheet_1);

          game.spritesheet.parse(function(){
             //console.log(game.spritesheet);
          });



              game.displayTick = function()
              {
                requestAnimationFrame(game.displayTick);

                for(var uid in game.display.sprites)
                {
                  var sprite = game.display.sprites[uid];

                  if(sprite.position.x > x)
                  {
                    //sprite.width = -1 * Math.abs(sprite.width);
                    sprite.animationFrame++;
                  }
                  else if(sprite.position.x < x)
                  {
                    //sprite.width = Math.abs(sprite.width);
                    sprite.animationFrame++;
                  }
                  else
                  {
                     sprite.animationFrame = 0;
                  }

                  if(sprite.animationFrame !== 0)
                  {
                    sprite.animationFrame = sprite.animationFrame%36;
                    sprite.texture = game.spritesheet.textures["char_run_"+Math.ceil(sprite.animationFrame/3)];
                  }
                  else
                  {
                    sprite.texture = game.spritesheet.textures["char_stand"];
                  }

                  sprite.position.x = x;
                  sprite.position.y = y;
                }
              }
              //game.displayTick();

              initLogic();

        });



}
