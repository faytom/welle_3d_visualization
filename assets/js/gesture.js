// Event Label: ‘g’:
const GESTURE_CODE = {
    'DYNAMIC': {
        'Up-Down': { icon: '/img/gesture/DS.png', name: '', tutorial: '/img/gesture/DS.png' },
        'Down-Up': { icon: '/img/gesture/US.png', name: '', tutorial: '/img/gesture/US.png' },
        'Left-Right': { icon: '/img/gesture/RS.png', name: '', tutorial: '/img/gesture/RS.png' },
        'Right-Left': { icon: '/img/gesture/LS.png', name: '', tutorial: '/img/gesture/LS.png' },
        'Clockwise': { icon: '/img/gesture/CWR.png', name: '', tutorial: '/img/gesture/CWR.png' },
        'Anti-Clockwise': { icon: '/img/gesture/CCWR.png', name: '', tutorial: '/img/gesture/CCWR.png' },
        'UNKNOWN': { icon: '/img/nothing.png', name: '', tutorial: '/img/nothing.png' }
    },
    'STATIC': {
        'Left Corner': { icon: '/img/gesture/ST-ULC.png', name: '', tutorial: '/img/gesture/ST-ULC.png' },
        'Right Corner': { icon: '/img/gesture/ST-URC.png', name: '', tutorial: '/img/gesture/ST-URC.png' },
        'Upper Mid': { icon: '/img/gesture/ST-UM.png', name: '', tutorial: '/img/gesture/ST-UM.png' },
        'Bottom Left': { icon: '/img/gesture/ST-BL.png', name: '', tutorial: '/img/gesture/ST-BL.png' },
        'Bottom Right': { icon: '/img/gesture/ST-BR.png', name: '', tutorial: '/img/gesture/ST-BR.png' },
        'UNKNOWN': { icon: '/img/nothing.png', name: '', tutorial: '/img/nothing.png' }
    }
};

// GESTURE MODULE================================================================================

// Gesture 手势
function setControllerMode(controllerMode) {
    if (!controllerMode) return;
    // Options:
    // controlMode: 
    // -- STATIC: button-type gesture
    // -- DYNAMIC: swipe-type gesture
    globalControllerMode = controllerMode;
    // Debug
    setDebugStateControllerModeView(controllerMode);
}

function setGestureView(controllerMode, gesture) {
    if (!controllerMode || gesture == 'UNKNOWN') {
        return;
    } else {
        $('#gesture-icon img').attr('src', GESTURE_CODE[controllerMode][gesture].icon);
        $('#gesture-name h1').text(GESTURE_CODE[controllerMode][gesture].name || gesture);

        // Change Tutorial
        showTutorialImg(controllerMode, gesture);
    }
}

// Gesture Tutorial 教程
function setTutorialView(controllerMode) {
    var tutorialItems = [];
    var numOfGesture = Object.keys(GESTURE_CODE[controllerMode]).length; // Compatability to be checked
    for (var key in GESTURE_CODE[controllerMode]) {
        var tutorial = GESTURE_CODE[controllerMode][key]['tutorial'];
        var icon = GESTURE_CODE[controllerMode][key]['icon'];
        var tutorialImg = tutorial ? 'showTutorialImg(\'' + controllerMode + '\', \'' + key + '\')' : '';
        var itemId = 'tutorial-' + controllerMode.toLowerCase().replace(' ', '-') + '-' + key.toLowerCase().replace(' ', '-');
        var item =
            '<li onclick="' + tutorialImg + '" id="' + itemId + '">' +
            '<div class="icon flex" style="height:' + 100 / numOfGesture + '%;">' +
            '<img src="' + icon + '" class="img-responsive center-block" alt="' + key + '">' +
            '</div>' +
            '</li>';
        tutorialItems.push(item);
    }
    var tutorialHtml = tutorialItems.join('');
    $('#tutorial ul.list-unstyled').html(tutorialHtml);
    showTutorialImg(controllerMode, Object.keys(GESTURE_CODE[controllerMode])[0]); // Show the first tutorial
}

// Display Tutorial Image
function showTutorialImg(controllerMode, gesture) {
    $('#tutorial li').removeClass('selected');
    $('#tutorial-img').attr('src', GESTURE_CODE[controllerMode][gesture].tutorial);
    var itemId = 'tutorial-' + controllerMode.toLowerCase().replace(' ', '-') + '-' + gesture.toLowerCase().replace(' ', '-');
    $('#' + itemId).addClass('selected');
}