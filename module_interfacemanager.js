class class_interfaceManager
{
	constructor()
  {
    this.options = document.createElement("DIV");
    this.options.style.position = "abslute";
    this.options.style.width = "100px";
    this.options.style.height = "100px";
    this.options.style.backgroundColor = "red";
    this.options.style.display = "none";

    document.body.appendChild(this.options);
  }

  toggleMenu(param)
  {
    var _this = game.ui;
    if(param === true)
    {
      if(_this.options.style.display === "none")
      {
        //pause game
        _this.options.style.display = "block";
      }
      else
      {
        //unpause game
        _this.options.style.display = "none";
      }
    }
  }
}
