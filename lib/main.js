const widgets = require("widget");
const tabs = require("tabs");
var pageMod = require("page-mod");
const self = require("self");

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
            console.log("undoremovetab");
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
            console.log(worker.tab.index);
            var nextIndex = (worker.tab.index + 1) % tabs.length;
            tabs[nextIndex].activate();
        });
        worker.port.on("previousTab", function(data) {
            console.log("previousTab");
            var nextIndex = (worker.tab.index - 1) % tabs.length;
            tabs[nextIndex].activate();
        });
    }
});

tabs.open("http://www.baidu.com/");
//console.log("The add-on is running.");
