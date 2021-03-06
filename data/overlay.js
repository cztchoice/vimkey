var Vimium = {
	init: function() {
		// initialization code
        var url = window.location.href;
        self.port.emit("checkExcludedUrl", url);
        self.port.on("isExculdedUrl", function(isExcluded){
            if(!isExcluded){
                this.initialized = true;
                document.addEventListener('keydown', Vimium.onKeydown, true);       
            }
        })
		
	},
    scrollToBottom: function() { window.scrollTo(window.pageXOffset, document.body.scrollHeight); },
    scrollToTop: function() { window.scrollTo(window.pageXOffset, 0); },
    scrollToLeft: function() { window.scrollTo(0, window.pageYOffset); },
    scrollToRight: function() { window.scrollTo(document.body.scrollWidth, window.pageYOffset); },
    scrollUp: function() {  window.scrollBy(0,-25);},
    scrollDown: function() {  window.scrollBy(0,25); },
    scrollPageUp: function() { window.scrollBy(0,-1 * window.innerHeight / 2); },
    scrollPageDown: function() { window.scrollBy(0, window.innerHeight / 2); },
    scrollFullPageUp: function() { window.scrollBy(0, -1 * window.innerHeight); },
    scrollFullPageDown: function() { window.scrollBy(0, window.innerHeight); },
    scrollLeft: function() { window.scrollBy(-25,0); },
    scrollRight: function() { window.scrollBy(25,0); },
    reload: function() { window.location.reload(); },
    goBack: function(count) { history.go(-1); },
    goForward: function(count) { history.go(1); },
    undoRemoveTab: function() {
        self.port.emit("undoRemoveTab");
    },
    removeCurrentTab: function() {
        self.port.emit("removeCurrentTab");
    },
    createTab: function() {
        self.port.emit("createTab");
    },
    nextTab: function() {
        self.port.emit("nextTab");
    },
    previousTab: function() {
        self.port.emit("previousTab");
    },

    goUp: function(count) {
        var url = window.location.href;
        if (url[url.length-1] == '/')
            url = url.substring(0, url.length - 1);

        var urlsplit = url.split('/');
        // make sure we haven't hit the base domain yet
        if (urlsplit.length > 3) {
            urlsplit = urlsplit.slice(0, Math.max(3, urlsplit.length - count));
            window.location.href = urlsplit.join('/');
        }
    },//}
    testFunc: function(message) {
        console.log(message);
    },
    invokeCommandString: function(str) {
        //var components = str.split('.');
        //var obj = window;
        //for (var i = 0; i < components.length - 1; i++)
        //obj = obj[components[i]];
        //var func = obj[components.pop()];
        var func = Vimium[str];
        
        //func();   //This usage is ok, too. But cannot return value.
        return func.apply(Vimium);
    },   

	keymap: {
		'j': "scrollDown",
		'k': "scrollUp",
		'J': "scrollPageDown",
		'K': "scrollPageUp",
		'u': "undoRemoveTab",
		'r': "reload",
		'd': "removeCurrentTab",
		't': "createTab",
		'l': "nextTab",
		'h': "previousTab",
		'H': "goBack",
		'L': "goForward",
		'g': "scrollToTop",
		'G': "scrollToBottom",
    },
    isEditable: function(target) {
	  if (target.isContentEditable)
	    return true;
	  var nodeName = target.nodeName.toLowerCase();
	  // use a blacklist instead of a whitelist because new form controls are still being implemented for html5
	  var noFocus = ["radio", "checkbox", "button", "submit"];
	  if (nodeName == "input" && noFocus.indexOf(target.type) == -1)
	    return true;
	  var focusableElements = ["textarea", "select"];
	  return focusableElements.indexOf(nodeName) >= 0;
	},
    suppressEvent: function(event) {
        event.preventDefault();
        event.stopPropagation();
    },
    // Vimium
    initDoc: function() {
		var vimium = {};
		vimium.cmd_search = '';
		vimium.search = '';
		return(vimium);
	},
	onKeydown: function(e) { 
		//var doc = document;
        var doc = document;
		var editable = Vimium.isEditable(e.target);
        // isEscape, if user press ESC key when they are in edit mode, blur it
        if (editable && e.keyCode == 27) {
            // Remove focus so the user can't just get himself back into insert mode by typing in the same input
            // box.
            //console.log("in isEscape");
            e.target.blur();
            //exitInsertMode();
            Vimium.suppressEvent(e);
        }
		var keyChar = String.fromCharCode(e.keyCode).toLowerCase();
        //console.log(keyChar);
		if (e.shiftKey)
			keyChar = keyChar.toUpperCase();
		if( e.altKey )
			return;
		if(!doc.vimium)
			doc.vimium = Vimium.initDoc();
        if(!editable && e.target.innerHTML && !e.ctrlKey) {
            doc.vimium.cmd_search += keyChar;
            var match, matched = [];
            for(var key in Vimium.keymap) {
                match = key.substr(0, doc.vimium.cmd_search.length) == doc.vimium.cmd_search;
                if(match)
                    matched.push(key);
            }
            if(matched.length == 1 && matched[0] == doc.vimium.cmd_search) {
                var action = Vimium.keymap[matched[0]];
                Vimium.invokeCommandString(action);
                Vimium.suppressEvent(e);
                doc.vimium.cmd_search = '';
            }
            if(matched.length <= 0)
                doc.vimium.cmd_search = '';
        } 

    },
};

//window.alert("ContentScript loaded!");
//if(Vimium.initialized == false)
{
    window.addEventListener("load", function(e) { Vimium.init(); }, false); 
}
