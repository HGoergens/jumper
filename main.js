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
 //console.log();
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

      if(sprite.animationFrame !== 0)
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
        .add("myimage","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARAAAAAPCAYAAAAs/ZDvAAAAAXNSR0IArs4c6QAAA5RJREFUaIHtWk1KM0EQrfn4XLgJxEU2AyI4RwiewRPkkDmBZ5AcIUIIZOMigWxcuBgX8kLZ6Z7p+pk/sWAg0Xmvq6teV1c3KajBdouqxueH923R9G6beXL92Z/9VsM60a4RK17K888yyBiMF6Yp22+Zh4d5xmJKceW+Wv224CXYSRcQTFQbLC9xeSV7SNF48YwlFp5cQ+PHbJMtIGFSpEnyFpdXEbPyDDmfscTCk8trTlL8VI75jQUEkxjb/UdOMtbzssbThh9K8F11DE285yXVeCw8nljN+15cXepEi/dYI31x/E/9I3YeG6oq8uQ+3dxG3wl9W50Ol+/reVnj+xjafKLvhXzcX/9dGmOpH7MNXfjPS6rxfQzHltByY6HRB6wrnVjj2dclqNWPaAcSAz68bwtLUO7utyockro6HYqnm9sLD/evbZKr06FYz8vaQ6hWHuz+x311hZHgU11ELg/RdzE5L0k1Hw8fwlhKYwEOqz5gVp146EO7TlI8qe7Ky4/e70Akk4ntCMd99UMkueLgO5NFqBaRonCgeHBsLn62oWK2oYLzaOYD477k8sAPiw/reVnznGhy6qkPmFYnHvoI+STvh4Y4oLhqedr86LyAhIl9fjxkY1PtJHZOqQ9E10LV8sAkIuXiJiJ6/fzIHbr1uKFZLJwHvoCnTThWH1JHDYl56QNm1YlHXjTrJByPc2niIPGjlw4EycDuKcGGSeEBClvonItBiAtPrj+h4LWLFYmR4lPFI2ex51wQon3H07RrhYXQem9jPaenuFJHrC50YtUH7O5+S8d9RdJ1EuMhIjVPrh/RApJqvbRBeXkr1We71I6NYsQnGO48/PPr58fF/xhW4odmhwt9t+6QRD/z0XTWRXHg7+IzL2Zod3NaXn50kbbbYfGxtOsSffD/eevEqg+YZa148rj44fXbgvW8TF62NVkMkyM2vvPsFlW9W1Sqi6SQM+SQzAlYjpH6hAu63aJSxZMXGStPiJPMBViO6VMfHO+lE6s+YNq1EuMh0q9dK5442KOAEOUFtO12X5vgLgqIdnytsGI+af2x+mIZ21JEu9KHFW/VRzj+VIpI8ncg3pZ739D0TtvZ3BvHk/jyVpL2Nhvjgy/36MQFablJT5nkDoj78vx4UJ+tMSb4pPPqQh9avJc+YrzWO5BRmFcH4llN+8J5cXiMHzNrTLV4r87D24bqPDzG5uYZI+6XpQtpwn4BqjsFTilDIyIAAAAASUVORK5CYII=")
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
