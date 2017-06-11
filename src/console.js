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

function compileIt() {
  try {
    var getScript = function(path) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', chrome.extension.getURL(path), false);
      xhr.send();
      return xhr.responseText;
    };

    var eval_src = "";
    eval_src += getScript('bootstrap.js');
    // NOTE for some reason $ = jQuery is necessary.
    eval_src += 'window.$ = window.jQuery;';
    eval_src += 'function __define(m) {console.table(m.scraper());}';
    eval_src += editor.session.getValue().replace("define(", "__define(");

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
      } else {
        err.className = 'green';
        err.innerHTML = "Done!";
      }
    });
  } catch (e) {
    alert(e);
  }
}

var schedule = function(fn, timeout) {
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
