class class_display
{
	constructor(w,h)
  {
    this.app = new PIXI.Application({ antialias: false,width:w,height:h});
    this.sprites = {};
  }

  createSprite(uid,x,y,w,h)
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
    this.app.stage.addChild(sprite);
    this.sprites[uid] = sprite;
  }

  moveSprite(uid,x,y)
  {
    var sprite = this.sprites[uid];

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

  createBlock(uid,x,y,w,h)
  {
    var sprite = new PIXI.Graphics();
        sprite.beginFill(0x0000FF);
        sprite.drawRect(-w/2,-h/2,w,h);
        sprite.endFill();
        sprite.position.x = x;
        sprite.position.y = y;
    this.app.stage.addChild(sprite);
  }


  tick()
  {
    requestAnimationFrame(this.tick);

    for(var uid in this.sprites)
    {
      //do animation stuff
    }
  }

}
