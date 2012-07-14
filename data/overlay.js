var Vimium = {
	init: function() {
		// initialization code
		this.initialized = true;
		document.addEventListener('keydown', Vimium.onKeydown, true);
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
    goBack: function(count) { history.go(-count); },
    goForward: function(count) { history.go(count); },
    undoRemoveTab: function() {
        // body...
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

	keymap: {
		'j': function() { Vimium.scrollDown(); },
		'k': function() { Vimium.scrollUp(); },
		'J': function() { Vimium.scrollPageDown(); },
		'K': function() { Vimium.scrollPageUp(); },
		'u': function() { Vimium.undoRemoveTab(); },
		'r': function() { Vimium.reload(); },
		'd': function() { Vimium.removeCurrentTab(); },
		't': function() { Vimium.createTab(); },
		'l': function() { Vimium.nextTab(); },
		'h': function() { Vimium.previousTab(); },
		'H': function() { Vimium.goBack(1); },
		'L': function() { Vimium.goForward(1); },
		//'t': function() { gBrowser.selectedTab = gBrowser.loadOneTab("about:newtab",null,null,null,false,false);  },
		'gg': function() { Vimium.scrollToTop(); },
		'G': function() { Vimium.scrollToBottom(); }
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
		var keyChar = String.fromCharCode(e.keyCode).toLowerCase();
        //console.log(keyChar);
		if (e.shiftKey)
			keyChar = keyChar.toUpperCase();
		if( e.altKey )
			return;
		if(!doc.vimium)
			doc.vimium = Vimium.initDoc();
		var editable = Vimium.isEditable(e.target);
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
                switch(typeof(action)) {
                    case "function":
                        action();
                        break;
                    case "string":
                        eval(action);
                        break;
                }
                doc.vimium.cmd_search = '';
            }
            if(matched.length <= 0)
                doc.vimium.cmd_search = '';
        } 
    },
};

//window.alert("ContentScript loaded!");
window.addEventListener("load", function(e) { Vimium.init(); }, false); 
