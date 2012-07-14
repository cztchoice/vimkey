const widgets = require("widget");
const tabs = require("tabs");
var pageMod = require("page-mod");
const self = require("self");

var closedTabList = [];
pageMod.PageMod({
    include: "*",
    contentScriptWhen: "start",
    contentScriptFile: self.data.url("overlay.js"),
    onAttach: function(worker) {
        //console.log("Attaching content scripts");
        worker.port.on("message", function(data) {
            console.log(data);
        });
        worker.port.on("undoRemoveTab", function(data) {
            //console.log("undoRemovetab");
            if (closedTabList.length > 0) {
                tabs.open(closedTabList[closedTabList.length - 1]);
                closedTabList.pop();
            }
            //worker.tab.
        });
        worker.port.on("removeCurrentTab", function(data) {
            //console.log("removeCurrentTab");
            worker.tab.close(function(){});
        });
        worker.port.on("createTab", function(data) {
            //console.log("createTab");
            tabs.open("about:newtab");
        });
        worker.port.on("nextTab", function(data) {
            //console.log("nextTab");
            var nextIndex = (worker.tab.index + 1) % tabs.length;
            tabs[nextIndex].activate();
        });
        worker.port.on("previousTab", function(data) {
            var nextIndex = (worker.tab.index + tabs.length - 1) % tabs.length;
            tabs[nextIndex].activate();
        });
    }
});

tabs.on("close", function(t){
    //console.log(t.url);
    //Only keep 10 closed tabs
    if(closedTabList.length > 10)
        closedTabList.shift();
    closedTabList.push(t.url);
});
//tabs.open("http://www.baidu.com/");
//console.log("The add-on is running.");
