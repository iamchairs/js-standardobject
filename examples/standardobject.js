/*
*	Author: Micah Williamson
*
*	Events
*	-		error
*	-		log
*	-		warning
*/

function StandardObject()
{
	this.errors = [];
	this.warnings = [];
	this.messages = [];
	this.logs = [];
	this.eventListeners = [];
	this.dispatchObservers = [];
}

StandardObject.prototype.eventListeners = null;
StandardObject.prototype.errors = null;
StandardObject.prototype.warnings = null;
StandardObject.prototype.messages = null;
StandardObject.prototype.logs = null;
StandardObject.prototype.dispatchObservers = null;

StandardObject.prototype.dispatchEvent = function(evtName, evtData)
{
	for(var i = 0; i < this.eventListeners.length; i++)
	{
		var Evt = this.eventListeners[i];
		if(Evt.name == evtName)
		{
			var callback = Evt.callback;
			
			if(Evt.callback.toString() == "Callback")
			{
				var obj = Evt.callback.obj;
				var func = Evt.callback.func;
				obj.callback = func;
				obj.callback(evtData);
			}
			else if(evtData != null)
				obj.callback(evtData);
				
			if(Evt.once)
			{
				this.removeEventListener(Evt);
				i--;
			}
		}
	}
	
	for(var i = 0; i < this.dispatchObservers.length; i++)
	{
		var DO = this.dispatchObservers[i];
		
		// We don't need to observe twice
		if(DO.observed == false)
			DO.observe(evtName);
	}
}

StandardObject.prototype.addDispatchObserver = function(eventString, eventsObserving)
{
	var DO = new DispatchObserver(eventString, eventsObserving);
	DO.setParent(this);
	
	var newArr = [];
	for(var i = 0; i < this.dispatchObservers.length; i++)
	{
		newArr.push(this.dispatchObservers[i]);	
	}
	newArr.push(DO);
	
	this.dispatchObservers = newArr;
}

StandardObject.prototype.addEventListener = function(nm, callback, once)
{
	var Evt = new Event();
	Evt.name = nm;
	Evt.callback = callback;
	Evt.once = once;
	
	var newArr = [];
	for(var i = 0; i < this.eventListeners.length; i++)
	{
		newArr.push(this.eventListeners[i]);	
	}
	newArr.push(Evt);
	
	this.eventListeners = newArr;
	
	return Evt;
}

StandardObject.prototype.removeEventListener = function(Evt)
{
	var found = false;
	var newEventStack = [];
	for(var i = 0; i < this.eventListeners.length; i++)
	{
		var E = this.eventListeners[i];
		if(E == Evt)
			found = true;
		else
			newEventStack.push(E);
	}

	this.eventListeners = newEventStack;
	
	if(found == false)
		this.warn("event attempted to be removed but not found");
}

StandardObject.prototype.error = function(str)
{
	var Lg = new Log();
	Lg.type = "error";
	Lg.message = str;
	
	this.errors.push(Lg);
	this.logs.push(Lg);
	
	this.dispatchEvent("error", Lg);
	this.dispatchEvent("log", Lg);
}

StandardObject.prototype.warn = function(str)
{
	var Lg = new Log();
	Lg.type = "warning";
	Lg.message = str;
	
	this.warnings.push(str);
	this.logs.push(Lg);
	
	this.dispatchEvent("warn", Lg);
	this.dispatchEvent("log", Lg);
}

StandardObject.prototype.message = function(str)
{
	var Lg = new Log();
	Lg.type = "message";
	Lg.message = str;
	
	this.messages.push(str);
	this.logs.push(Lg);
	
	this.dispatchEvent("message", Lg);
	this.dispatchEvent("log", Lg);
}

StandardObject.prototype.toString = function()
{
	return "StandardObject";
}

// Helper StandardObjects

function Event()
{
	this.name = "Undefined";
	this.callback = function(){};
}

function Log()
{
	this.type = "Undefined";
	this.message = "Undefined";
}

function Callback(obj, func)
{
	this.obj = obj;
	this.func = func;
}

Callback.prototype.toString = function()
{
	return "Callback";
}

/*
*	@param eventString		The event to dispatch when all events are observed. Example- 'load'
*	@param eventsObserving	An array of events being watched (string values). Example- ['preload1','preload2']
*/
function DispatchObserver(eventString, eventsObserving)
{
	this.eventString = eventString;
	this.eventsObserving = eventsObserving;	
	this.eventsObserved = [];
	
	for(var i = 0; i < eventsObserving.length; i++)
	{
		var evt = eventsObserving[i];
		this.eventsObserved.push({"event":evt,"observed":false});
	}
}

/*
* Runs through the array of events currently being observed.
* If a match is found adds to an observed events array.
* If all events are observed the event will be dispatched on the parent object.
*
* @param observe		The name of the event being observed
*/

DispatchObserver.prototype.observe = function(str)
{
	for(var i = 0; i < this.eventsObserved.length; i++)
	{
		var evt = this.eventsObserved[i];
		
		if(evt.event == str)
		{
			this.eventsObserved[i].observed = true;	
		}
	}
	
	var allObserved = true;
	
	var i = 0;
	while(allObserved && i < this.eventsObserved.length)
	{
		var evt = this.eventsObserved[i];
		if(evt.observed == false)
			allObserved = false;
					
		i++;
	}
	
	if(allObserved)
	{
		this.observed = true;
		this.Parent.dispatchEvent(this.eventString);
	}
}

DispatchObserver.prototype.setParent = function(Obj)
{
	this.Parent = Obj;
}

DispatchObserver.prototype.Parent = null;
DispatchObserver.prototype.eventString = null;
DispatchObserver.prototype.eventsObserving = null;
DispatchObserver.prototype.eventsObserved = null;
DispatchObserver.prototype.observed = false;
