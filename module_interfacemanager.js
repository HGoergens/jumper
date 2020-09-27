class class_interfaceManager
{
	constructor()
  {
    this.options = createWindow();

    document.body.appendChild(this.options);
  }

  createWindow()
  {
    var window = document.createElement("DIV");
    this.options.style.position = "abslute";
    this.options.style.width = "100px";
    this.options.style.height = "100px";
    this.options.style.backgroundColor = "red";
    this.options.style.display = "none";

    return window;
  }

  toggleMenu(param)
  {
    var _this = game.ui;
    if(param === true)
    {
      if(_this.options.style.display === "none")
      {
        //TODO: pause game
        _this.options.style.display = "block";
      }
      else
      {
        //TODO: unpause game
        _this.options.style.display = "none";
      }
    }
  }
}
