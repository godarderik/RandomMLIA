now = new Date();
var text;
function MainAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}
Random = {};
Random.MenuAttr = {omitDefaultItems: true};
Random.MenuModel = {
    visible: true,
    items: [ {},
        Mojo.Menu.editItem,   
        {label: $L("Help"), command: "do-Help"}            
    ]
};
MainAssistant.prototype.setup = function() {
 
 this.controller.setupWidget("spinner",
        this.attributes = {
            spinnerSize: "large"
        },
        this.model = {
            spinning: false 
        }
    );
this.controller.setupWidget(Mojo.Menu.appMenu, Random.MenuAttr, Random.MenuModel);
this.controller.setupWidget("newStory",
        this.attributes = {
            },
        this.btModel = {
            label : "Next",
            disabled: false
        });
this.controller.setupWidget("methods",
        this.attributes = {
            choices: [
                {label: "Text Messsage", value: 1},
                {label: "Email", value: 2},
				{label: "Copy", value: 3}
            ]},
        this.methodsModel = {
            value: "Share",
            disabled: false
        }
    ); 
this.newStory();
this.handleButton = this.newStory.bind(this);
	Mojo.Event.listen(this.controller.get('newStory'), Mojo.Event.tap, this.handleButton)
	Mojo.Event.listen(this.controller.get('methods'), Mojo.Event.propertyChange, this.handleUpdate.bind(this));
}

MainAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


MainAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

MainAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}
MainAssistant.prototype.getRandom = function (upper) {
    seed = now.getSeconds();
	random_number = Math.random(seed);
	adjustedNumber = random_number * upper;
	finalAdjustedNumber = Math.floor(adjustedNumber);
	return finalAdjustedNumber;
}
MainAssistant.prototype.newStory = function (upper) {
this.model.spinning = true;
this.controller.modelChanged(this.model);
storyNum = this.getRandom(1527989);
var url = "http://mylifeisaverage.com/story/" + storyNum;
var request = new Ajax.Request(url, {method: 'get', onSuccess: this.success.bind(this), onFailure: this.failure.bind(this)});
}

MainAssistant.prototype.success = function (response) {
this.model.spinning = false;
this.controller.modelChanged(this.model);
Mojo.Log.error("reached 2")
text = response.responseText;
a = text.indexOf('<div class="sc">');
b = text.indexOf('<div class="sf">');
Mojo.Log.error(a);
Mojo.Log.error(b);
text = text.substring(a,b);
this.controller.get("test").innerHTML = text;

}
MainAssistant.prototype.failure = function (e) {
this.controller.get("test").innerHTML = "Error";
}
MainAssistant.prototype.handleCommand = function(event) {    
        if(event.type == Mojo.Event.command) {
            switch(event.command) {
           
                case "do-Help":
	
                this.controller.stageController.pushAppSupportInfoScene();     
                break;
				case "do-set":
				this.controller.stageController.pushScene('settings');
                break;
     
                
            }
        }
	
};
MainAssistant.prototype.handleUpdate = function () {
Mojo.Log.error("called 1");
if(this.methodsModel.value == 1)
{
this.trim();
this.controller.serviceRequest('palm://com.palm.applicationManager', {
     method: 'launch',
     parameters: {
         id: 'com.palm.app.messaging',
         params: {
         messageText: text
         }
     },
     onSuccess: this.handleOKResponse,
     onFailure: this.handleErrResponse
 });
 this.methodsModel.value = "Share";
 
}
else if(this.methodsModel.value == 2)
{
this.controller.serviceRequest(
    "palm://com.palm.applicationManager", {
        method: 'open',
        parameters: {
            id: "com.palm.app.email",
            params: {
                text: text
            }
        }
    }
);
this.methodsModel.value = "Share";
}
else if(this.methodsModel.value == 3)
{
//Copy to clipboard
this.trim();
this.controller.stageController.setClipboard(text,true);
Mojo.Controller.getAppController().showBanner("Story Copied to Clipboard",{source: 'notification'});
this.methodsModel.value = "Share";
}
}
MainAssistant.prototype.trim = function () {
a = 16;
b = text.lastIndexOf("</div>");
text = text.substring(a,b);
}