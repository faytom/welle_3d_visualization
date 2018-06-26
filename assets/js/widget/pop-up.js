// POP-UP MODULE================================================================================
function iniPopUp() {
    // pop up
    var popUpEl = document.getElementById('pop-up');
    if (!popUpEl) {
        popUpEl = document.createElement('div');
        popUpEl.id = 'pop-up';
        popUpEl.setAttribute('class', 'animate off');
        document.body.appendChild(popUpEl);
    }
    // pop up icon
    var popUpIconEl = document.createElement('img');
    popUpIconEl.id = 'pop-up-icon';
    popUpIconEl.setAttribute('class', 'img-responsive center-block');
    popUpEl.appendChild(popUpIconEl);
    // pop up text
    var popUpTextEl = document.createElement('div');
    popUpTextEl.id = 'pop-up-text';
    popUpEl.appendChild(popUpTextEl);
}

function
setPopUp(icon, message) {
    var popUpEl = document.getElementById('pop-up');
    var popUpIconEl = document.getElementById('pop-up-icon');
    var popUpTextEl = document.getElementById('pop-up-text');
    if (icon) popUpIconEl.src = icon;
    popUpTextEl.innerText = message;
    if (popUpEl.getAttribute('class') && popUpEl.getAttribute('class').indexOf(' on') < 0) popUpEl.setAttribute('class', 'animate on');
}

function resetPopUp() {
    var popUpEl = document.getElementById('pop-up');
    popUpEl.setAttribute('class', 'animate off');
}

// Execution
iniPopUp();