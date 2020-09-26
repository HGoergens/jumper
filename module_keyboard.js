/*DESCRIPTION
 * Keyboard & Gamepad input management
 * with config screen and default values
 * saves to browser cache
 * "button" features can be set with keyboard or gamepad
 * "axis" features can only be set with gamepad
*/

//TODO: check if axes need threshholds

//multi-user
class class_userinputmanager
{
	constructor(catalog)
  {
    //Input by programmer what functionalities exist
    this.catalog = catalog;

    //Tracks if default functions should be disabled (because needed for text input or key settings)
    //Set/Toggled with setTextFocus()
    this.textFocus = undefined;

    //Tracks if config window is opened
    this.configWindow = undefined;

    //Tracks all set up Buttons and Axes
    //Access this from your game tick loop to get values
    this.keyspressed = {};

    //Saves the current setting
    this.keys = {};

    //Check cache for stored settings
    var savedSettings = localStorage.getItem('keySettings');
    if(savedSettings !== null)
    {
    	this.keys = JSON.parse(savedSettings);
    }
    else
    {
    	//Fill keys-list with default values
    	for(var n in this.catalog){this.keys[this.catalog[n].default] = n;}
		}


    //Keyboard Events
    this.keydownevent = function(e)
    {
    	var effect = this.keys[e.key];
    	if(this.textFocus === undefined
      && effect !== undefined)
      {
        if(this.keyspressed[effect] === undefined)
        {
          this.keyspressed[effect] = 1;
          e.preventDefault();
        }
      }
    }
    this.keyupevent = function(e)
    {
    	var effect = this.keys[e.key];
      if(effect !== undefined)
      {
        this.keyspressed[effect] = undefined;
        e.preventDefault();
      }
    }

    //Bind event listener functions
    //TODO:Check performance
    window.addEventListener("keydown", this.keydownevent.bind(this),false);
    window.addEventListener("keyup"  , this.keyupevent.bind(this),false);




    //sets focus to UI, disables normal input events
    //and allows gamepads to send buttonIds to settings-UI
    //Call from onfocus/onbubble events
    this.setTextfocus = function(element)
    {
    	if(element)
      {
      	for(var n in this.keyspressed)
        {
        	this.keyspressed[n] = undefined;
        }

      	this.textFocus = element;
      }
      else
      {
      	this.textFocus = undefined;
      }
    }




		//Function to check for gamepads
    //Should be called from game loop (>50fps)
    this.pollGamepads = function()
    {
    	//Get gamepads from API and loop through
      var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
      for (var i = 0; i < gamepads.length; i++)
      {
        var gp = gamepads[i];
        if (gp)
        {
        	//Loop through buttons
          for (var j = 0; j < gp.buttons.length; j++)
        	{
            if(this.textFocus === undefined)
            {
            	var buttonId = "GP"+gp.index+"_"+j;
            	var effect = this.keys[buttonId];
              if(effect !== undefined)
              {
                if(gp.buttons[j].pressed)
                {
                    this.keyspressed[effect] = gp.buttons[j].value;
                }
                else
                {
                  this.keyspressed[effect] = undefined;
                }
              }
            }
            else
            {
            	//Settings mode
            	if(this.textFocus
              && this.textFocus.inputtype === "button"
              && gp.buttons[j].pressed)
              {
            		var buttonId = "GP"+gp.index+"_"+j;
								this.changeSetting(buttonId,this.textFocus);
              }
            }
        	}

          //Loop through axes (sticks etc)
          for (var j = 0; j < gp.axes.length; j++)
        	{
          	if(this.textFocus === undefined)
            {
            	var buttonId = "GP"+gp.index+"_AX"+j;
            	var effect = this.keys[buttonId];
              if(effect !== undefined)
              {
                this.keyspressed[effect] = gp.axes[j];
              }
            }
            else
            {
            	//Settings mode
            	if(this.textFocus
              && this.textFocus.inputtype === "axes"
              && Math.abs(gp.axes[j]) === 1)
              {
            		var buttonId = "GP"+gp.index+"_AX"+j;
								this.changeSetting(buttonId,this.textFocus);
              }
            }
          }
        }
      }
    }




    //Changes settings attribute, helper for settings-UI
    this.changeSetting = function(value,textfield)
    {
      if(textfield.inputManager.keys[value] !== undefined)
      {
        document.getElementById("settings_"+textfield.inputManager.keys[value]).value = "";
      }
      textfield.inputManager.keys[textfield.value] = undefined;
      textfield.inputManager.keys[value] = textfield.targetFunctionality;

      textfield.value = value;

      //make confirm button active or inactive
      if(JSON.stringify(this.keys) !== JSON.stringify(this.oldConfig))
      {
      	this.confirmButton.className = "UIbutton";
      }
      else
      {
      	this.confirmButton.className = "UIbutton inactive";
      }
    }




    //Displays settings-UI
    this.showConfig = function(w,h)
    {
      if(this.configWindow === undefined)
      {
        //Create Window
        var myWindow = document.createElement("DIV");
        		myWindow.className = "UIwindow";
            myWindow.style.width  = (w || 400)+"px";

        var myWindowHeader = document.createElement("DIV");
        		myWindowHeader.className = "UIwindowheader";
            myWindowHeader.textContent = "Button & Gamepad Settings";
        myWindow.appendChild(myWindowHeader);

        var myWindowContent = document.createElement("DIV");
        		myWindowContent.className = "UIwindowcontent";
            myWindowContent.style.maxHeight = (h || 400)+"px";
        myWindow.appendChild(myWindowContent);

        //track that window is open
      	this.configWindow = myWindow;

        //Save current config for cancel button
        this.oldConfig = JSON.parse(JSON.stringify(this.keys));

        //Loop through Interaction-Catalog
        for(var n in this.catalog)
        {
          //Find currently defined key
          var value = "";
          for(var m in this.keys)
          {
            if(this.keys[m] === n)
            {
              value = m;
            }
          }

					var label = document.createElement("DIV");

					var input = document.createElement("INPUT");
          input.value = value;
          input.id = "settings_"+n;
          input.targetFunctionality = n;
          input.inputManager = this;
        	input.className = "UIkeybindinginput";
          input.onfocus = function(){this.inputManager.setTextfocus(this);}
          input.onblur  = function(){this.inputManager.setTextfocus(undefined);}


          //If button-type input is expected
          if(this.catalog[n].type === "button")
          {
            input.inputtype = "button";
            label.textContent = n+" (button)";
            input.onkeydown = function(e)
            {
              this.inputManager.changeSetting(e.key,this);
              e.preventDefault();
            }
          }

          //If axes-type input is expected
          else if(this.catalog[n].type === "axes")
          {
            input.inputtype = "axes";
            label.textContent = n+" (axis)";
            input.onkeydown = function(e)
            {
               e.preventDefault();
            }
          }

          label.appendChild(input);
          myWindowContent.appendChild(label);
        }


        this.confirmButton = document.createElement("DIV");
        this.confirmButton.textContent = "confirm";
        this.confirmButton.inputManager = this;
        this.confirmButton.className = "UIbutton inactive";
        this.confirmButton.onclick = function()
        {
          if(this.className !== "UIbutton inactive")
          {
            localStorage.setItem('keySettings',JSON.stringify(this.inputManager.keys));
            this.inputManager.closeConfig();
          }
        }
        myWindowContent.appendChild(this.confirmButton);

        var cancelButton = document.createElement("DIV");
        cancelButton.textContent = "cancel";
        cancelButton.inputManager = this;
        cancelButton.className = "UIbutton";
        cancelButton.onclick = function()
        {
          this.inputManager.keys = this.inputManager.oldConfig;
          this.inputManager.oldConfig = undefined;
          this.inputManager.closeConfig();
        }
        myWindowContent.appendChild(cancelButton);


        var resetButton = document.createElement("DIV");
        resetButton.textContent = "reset to default";
        resetButton.inputManager = this;
        resetButton.className = "UIbutton";
        resetButton.onclick = function()
        {
          this.inputManager.keys = {};
          for(var n in this.inputManager.catalog){this.inputManager.keys[this.inputManager.catalog[n].default] = n;}
          localStorage.removeItem('keySettings');
          this.inputManager.closeConfig();
        }
        myWindowContent.appendChild(resetButton);


        return myWindow;
      }
    }

    this.closeConfig = function()
    {
    	if(this.configWindow !== undefined)
      {
      	this.configWindow.remove();
      	this.configWindow = undefined;
      }
    }

	}
}
