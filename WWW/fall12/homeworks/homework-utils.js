function createField(labelText, helpText, name) {
  var container = document.createElement('div');
  container.style.marginTop = container.style.marginBottom = 20;
  var label = document.createElement('label');
  label.innerHTML = labelText.bold();
  container.appendChild(label);

  var help = document.createElement('div');
  help.innerHTML = helpText.italics();
  container.appendChild(help);

  var box = document.createElement('input');
  box.setAttribute('id', labelText);
  box.setAttribute('type', 'text');
  box.setAttribute('name', name);
  box.setAttribute('size', 20);
  box.setAttribute('class', 'standardField');
  container.appendChild(box);
  return container;
}

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  } else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}
function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
function eraseCookie(name) {
  createCookie(name,"",-1);
}

var editorIdToValue = {};
function repopulate(cookieValue) {
  var sections = cookieValue.split("|");
  entries = sections[0].split(",");
  // Form entry fields
  for (var i = 0; i < entries.length; i++) {
    parts = entries[i].split(":");
    if(parts.length > 1 && parts[1]) {
      editorIdToValue[parts[0]] = unescape(parts[1]);
    }
  }
  // Standard fields like sunetid, name, collaborators
  entries = sections[1].split(",");
  for (var i = 0; i < entries.length; i++) {
    parts = entries[i].split(":");
    if(parts.length > 1 && parts[1]) {
      document.getElementsByName(parts[0])[0].value = parts[1]
    }
  }
}
function init_callback(inst) {
  var cookieValue = editorIdToValue[inst.editorId];
  if (cookieValue) {
    inst.setContent(cookieValue);
  }
}

function onSubmit() {
  var sunetId = document.getElementById('SUNetID').value;
  if (sunetId == null || sunetId == "") {
    alert('Need valid sunetId');
    return false;
  }
  return true;
}

function onLoad(formkey, homeworkName) {
  var container = document.getElementById('headerFields');
  var header = document.createElement('h2');
  header.innerHTML = document.title;
  container.appendChild(header);

  if (typeof(homeworkName)!=='undefined') {
    var textAreas = document.body.getElementsByTagName("textarea");
    for (var i = 0; i < textAreas.length; i++) {
      textAreas[i].style.visibility = 'hidden';
      textAreas[i].style.width = 0;
      textAreas[i].style.height = 0;
    }
    var container = document.getElementById('footerFields');
    var pDisclaimer = document.createElement('p');
    pDisclaimer.innerHTML = '<b>SUBMISSION INSTRUCTIONS</b>: Write your answers for all of ' + homeworkName + ' in one PDF document named ' + homeworkName + '.pdf (we will only accept PDF files).  Include your name and SUNet ID.  Copy the PDF onto corn.stanford.edu, ssh in to the machine, type <tt>/usr/class/cs221/WWW/submit</tt> (like what you did for the projects).';
    container.appendChild(pDisclaimer);
    return;
  }

  var field = 0;
  function newField() { return 'entry.' + (field++) + '.single'; }

  var form = document.getElementsByTagName('form')[0];
  if (form) {
    form.action = 'https://docs.google.com/spreadsheet/formResponse?formkey=' + formkey + '&amp;ifq';
    form.method = 'POST';
  }

  // Header
  container.appendChild(createField('SUNetID', 'This is your login @stanford.edu (e.g., psl), not your university ID number.', newField()));
  container.appendChild(createField('Name', 'Enter your full name (e.g., Percy Liang).', newField()));
  container.appendChild(createField('Collaborators', 'Enter the SUNetIDs of people you discussed this homework.', newField()));

  // Assign names to the answers
  var responses = document.getElementsByTagName('textarea');
  for (var i = 0; i < responses.length; i++) {
    var response = responses[i];
    response.name = newField();
    response.setAttribute('rows', 10);
    response.setAttribute('cols', 80);
  }

  var container = document.getElementById('footerFields');
  //container.appendChild(createField('Difficulty', 'How hard on a scale of 1-10 did you think this problem was?', newField()));
  var p = document.createElement('p');
  p.innerHTML = 'When you submit, your responses will be recorded in a Google spreadsheet.  You will <b>not</b> be able to access your submission, so please save a copy if you want to reference it!  If you submit multiple times, only your last submission (before the deadline) will be graded.';
  container.appendChild(p);
  var pDisclaimer = document.createElement('p');
  pDisclaimer.innerHTML = '<b>WARNING</b>: Saved responses are stored as cookies. Clearing your browser cache will delete all progress. Also, this is in Beta, we <b>highly</b> suggest you still back up your work.';
  container.appendChild(pDisclaimer);

  // Submit button
  var submit = document.createElement('input');
  submit.type = 'submit';
  submit.value = 'Submit';
  container.appendChild(submit);
  
  // Save button
  var save = document.createElement('input');
  save.type = 'button';
  save.value = 'Save';
  save.onclick = function() {
    var values = "";
    var len = tinyMCE.editors.length;
    if (len == 0) { alert("Error: Wait for editors to load."); return; }
    for (var i = 0; i < len; i++) {
      values += tinyMCE.editors[i].editorId + ":" + escape(tinyMCE.editors[i].getContent({format: "raw"})) + ",";
    }
    values += "|";
    var standardFields = document.getElementsByClassName("standardField");
    for (var i = 0; i < standardFields.length; i++) {
      values += standardFields[i].name + ":" + standardFields[i].value + ",";
    }
    createCookie(formkey, values, 16);
  };
  container.appendChild(save);
  
  // handle repopulating cookie values
  var field = 0;
  if (document.cookie) {
    var cookieVal = readCookie(formkey);
    if (cookieVal) {
      repopulate(cookieVal);
    }
  }

  tinyMCE.init({
    plugins : "equation,spellchecker,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
    mode : "textareas",
    theme : "advanced",
    theme_advanced_buttons1 :"undo,redo,|,bold,italic,|,sub,sup,charmap,equation",
    theme_advanced_buttons2 : "",
    theme_advanced_buttons3 : "",
    theme_advanced_toolbar_location : "top",
    theme_advanced_toolbar_align : "left",
    theme_advanced_statusbar_location : "bottom",
    init_instance_callback : "init_callback"
  });
}
