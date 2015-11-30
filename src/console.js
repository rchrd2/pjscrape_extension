var tabId = chrome.devtools.inspectedWindow.tabId;
var err = document.getElementById('error');
var editor = ace.edit("cc-editor");

editor.setTheme("ace/theme/clouds");
editor.setTheme("ace/theme/clouds");
editor.session.setMode("ace/mode/javascript");
editor.session.setUseSoftTabs(true);
editor.session.setUseWrapMode(true);
editor.session.setTabSize(2);
editor.setShowPrintMargin(false);



function compileIt(){
    console.log("compileIt");
    //alert(RICHARD);
    // chrome.tabs.executeScript(null, {file: "pjscrape/client/jquery.js"});
    // chrome.tabs.executeScript(null, {file: "pjscrape/client/pjscrape_client.js"});
    // chrome.tabs.executeScript(null, {file: "pjscrape/client/pjscrape_init.js"});
    // alert(window.pjs);

    // TEST send message
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //   chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
    //     alert(response);
    //   });
    // });

      // chrome.tabs.sendMessage(tabId, {greeting: "hello"}, function(response) {
      //   alert(response);
      // });


    //
    // chrome.tabs.executeScript({
    //     file: 'pjscrape/client/jquery.dev.js'
    // });

    // load injected script
    var getScript = function(path) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', chrome.extension.getURL(path), false);
      xhr.send();
      return xhr.responseText;
    }

    var eval_src = "";

    eval_src += getScript('pjscrape/client/jquery.dev.js');
    eval_src += getScript('pjscrape/client/pjscrape_client.js');
    eval_src += getScript('pjscrape/client/pjscrape_init.js');

    module_src = editor.session.getValue();
    module_src = module_src.replace("define(", "window.pjs.define(");
    eval_src += module_src;

    chrome.devtools.inspectedWindow["eval"](eval_src, function(result, exception) {

      if (exception && (exception.isError || exception.isException)) {
          if (exception.isError) {
            err.className = '';
            err.innerHTML = "Error " + exception.code + ": " + exception.description;
          }
          if (exception.isException) {
            err.className = '';
            err.innerHTML = "Exception: " + exception.value;
          }
        }
      else {
          err.className = 'green';
          err.innerHTML = "Done!";
        }
    });
}



schedule = function(fn, timeout) {
    if (fn.$timer) return;
    fn.$timer = setTimeout(function() {fn.$timer = null; fn();}, timeout || 10);
};


var compileOptions = {
    name: "compileIt",
    exec: compileIt,
    bindKey: "Ctrl-Return|Command-Return|Shift-Return"
};

editor.commands.addCommand(compileOptions);


document.getElementById('runcc').addEventListener('click', compileIt);
editor.session.setValue(localStorage.getItem("state" + tabId));
schedule(function(){ editor.focus();}, 20);
