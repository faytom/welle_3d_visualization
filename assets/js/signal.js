var canvas;
//app state
var RADAR = 0,
    LANDING = 1,
    PPT = 2,
    VID = 3;

var app = {
    0: {
        button: []
    },
    1: {
        button: []
    },
    2: {button: [], slide : 0, slideNo : 5},
    3: {button: []},
    state : RADAR, 
    preState : RADAR,
    ratio : 1.5,
    device_connected : false,
    recog : false,
    icons : [], 
    radarTranslateX : 0,
    radarTranslateY : 0,
    radarWidth : 0,
    radarHeight : 0, 
    iconTranslateX : 0,
    iconTranslateY : 0
};
var video;
var resource = {};
var ch1Data = new Array(600);
var ch2Data = new Array(600);
var paths = [];

app.shrinkPlot = function(){
    this.radarTranslateX = 0;
    this.radarTranslateY = height * 0.70;
    this.radarWidth = width * 0.2;
    this.radarHeight = height * 0.3;
    this.iconTranslateX = this.radarTranslateX + this.radarWidth / 2;
    this.iconTranslateY = this.radarTranslateY + this.radarHeight / 2;
}

app.extendPlot = function(){
    this.radarWidth = width/2;
    this.radarHeight = height;
    this.radarTranslateX = width/2 - this.radarWidth/2;
    this.radarTranslateY = height/2 - this.radarHeight/2;
    this.iconTranslateX = this.radarTranslateX + this.radarWidth / 2;
    this.iconTranslateY = this.radarTranslateY + this.radarHeight / 2;
}

app.stateRadar = function() {
    this.removeVideo();
    paths = [];
    this.icons = [];
    this.extendPlot();
    this.preState = this.state;
    this.state = RADAR;
    app[this.state].button = [];
    app[this.state].button.push(new buttonRect(createVector(this.radarTranslateX, this.radarTranslateY), createVector(this.radarWidth * 0.72, this.radarHeight * 0.1), this.radarWidth * 0.09, this.radarHeight * 0.05, [this.state], null, this.toggleGestRecog, this, "Recog", this.recog));
    app[this.state].button.push(new buttonRect(createVector(this.radarTranslateX, this.radarTranslateY), createVector(this.radarWidth * 0.82, this.radarHeight * 0.1), this.radarWidth * 0.09, this.radarHeight * 0.05, [this.state], null, this.stateLanding, this, "Demo"));
    app[this.state].button.push(new buttonRect(createVector(this.radarTranslateX, this.radarTranslateY), createVector(this.radarWidth * 0.92, this.radarHeight * 0.1), this.radarWidth * 0.09, this.radarHeight * 0.05, [this.state], null, this.systemRecalibrate, this, "Recal"));
}

app.toggleGestRecog = function(){
    this.recog = !this.recog;
    var mode = !this.recog ? 'TRACKING' : 'RECOGNIZING';
    socket.emit('config', {deviceMode: mode});
}


app.stateLanding = function(){
    paths = [];
    this.recog = true;
    var mode = 'RECOGNIZING';
    socket.emit('config', {deviceMode: mode});
    this.shrinkPlot();
    this[PPT].slide = 0;
    this.preState = this.state;
    this.state = LANDING;
    app[this.state].button = [];

    app[this.state].button.push(new buttonRect(createVector(this.radarTranslateX, this.radarTranslateY), createVector(this.radarWidth * 0.75, this.radarHeight * 0.11), this.radarWidth * 0.16, this.radarHeight * 0.08, [this.state], null, this.stateRadar, this, "Back"));
    app[this.state].button.push(new buttonRect(createVector(this.radarTranslateX, this.radarTranslateY), createVector(this.radarWidth * 0.92, this.radarHeight * 0.11), this.radarWidth * 0.16, this.radarHeight * 0.08, [this.state], null, this.systemRecalibrate, this, "Recal"));

}

app.statePPT = function(){
    this.preState = this.state;
    this.state = PPT;
    app[this.state].button = [];

    app[this.state].button.push(new buttonRect(createVector(this.radarTranslateX, this.radarTranslateY), createVector(this.radarWidth * 0.75, this.radarHeight * 0.11), this.radarWidth * 0.16, this.radarHeight * 0.08, [this.state], null, this.stateRadar, this, "Back"));
    app[this.state].button.push(new buttonRect(createVector(this.radarTranslateX, this.radarTranslateY), createVector(this.radarWidth * 0.92, this.radarHeight * 0.11), this.radarWidth * 0.16, this.radarHeight * 0.08, [this.state], null, this.systemRecalibrate, this, "Recal"));

}

app.stateVideo = function(){
    this.setupVideo();
    this.makeVideoVisible();
    this.preState = this.state;
    this.state = VID;
    app[this.state].button = [];

    app[this.state].button.push(new buttonRect(createVector(this.radarTranslateX, this.radarTranslateY), createVector(this.radarWidth * 0.75, this.radarHeight * 0.11), this.radarWidth * 0.16, this.radarHeight * 0.08, [this.state], null, this.stateRadar, this, "Back"));
    app[this.state].button.push(new buttonRect(createVector(this.radarTranslateX, this.radarTranslateY), createVector(this.radarWidth * 0.92, this.radarHeight * 0.11), this.radarWidth * 0.16, this.radarHeight * 0.08, [this.state], null, this.systemRecalibrate, this, "Recal"));
    // app[this.state].button.push(new buttonRect(createVector(0, 0), createVector(width * 0.82, height * 0.1), width * 0.08, height * 0.05, [this.state], null, this.stateRadar, this, "Back"));
    // app[this.state].button.push(new buttonRect(createVector(0, 0), createVector(width * 0.92, height * 0.1), width * 0.08, height * 0.05, [this.state], null, this.systemRecalibrate, this, "Recal"));

}

// app.stateWaveform = function() {
//     this.state = WAVEFORM;
//     app[this.state].button = new buttonRect(createVector(0, 0), createVector(width * 0.9, height * 0.03), width * 0.15, height * 0.03, [WAVEFORM], null, this.stateRadar, this, "Radar");
// }

app.systemRecalibrate = function(){
    systemRecalibrate();
}

app.dataflowStart = function(){
    dataflowStart();
}

app.dataflowStop = function(){
    dataflowStop();
}

app.draw = function() {
    if (this.state == RADAR) {
        // this.drawRadar(width*0.04,height*0.68,this.width, this.height);
        this.drawRadar(this.radarTranslateX,this.radarTranslateY,this.radarWidth, this.radarHeight);

    } else if (this.state == LANDING) {
        this.drawLanding();
        this.drawRadar(this.radarTranslateX,this.radarTranslateY,this.radarWidth, this.radarHeight);
    } else if(this.state == PPT){
        this.drawPPT();
        this.drawRadar(this.radarTranslateX,this.radarTranslateY,this.radarWidth, this.radarHeight);
    } else if (this.state == VID){
        this.drawVideo();
        this.drawRadar(this.radarTranslateX,this.radarTranslateY,this.radarWidth, this.radarHeight);
    }
    
    this.drawButton();
    
}

app.drawRadar = function(translateX, translateY, width, height) {
    push();
    translate(translateX, translateY)
    this.drawGrid(width, height);
    this.drawWaveform(width, height);
    this.drawDebugInfo(width, height);
    pop();
    this.drawPath();
    this.drawIcon();
}

app.drawDebugInfo = function(width, height){
    displayText("Device: ", width * 0.72, height * 0.05, width*0.02, color(255,255,248), 'ARIAL', CENTER, CENTER);
    displayText(this.device_connected ? "Connected" : "Disconnected", width * 0.78, height * 0.05, width*0.02, color(255,255,248), 'ARIAL', LEFT, CENTER);
    displayText("fps: " + nf(frameRate(),2,0), width * 0.92, height * 0.05, width*0.02, color(255,255,248), 'ARIAL', LEFT, CENTER);
}

app.drawWaveform = function(width, height) {
    this.drawPlot(ch1Data, height * 0.05, color(77, 193, 205), width, height);
    this.drawPlot(ch2Data, height * 0.15, color(129, 140, 247), width, height);

    displayText("CH1", width * 0.02, height * 0.05, width * 0.02, color(255, 255, 248), 'ARIAL', CENTER, CENTER);
    displayText("CH2", width * 0.02, height * 0.15, width * 0.02, color(255, 255, 248), 'ARIAL', CENTER, CENTER);
}

app.drawLanding = function(){
    displayText("Draw P to Show Powerpoint", width * 0.5, height * 0.35, width * 0.05, color(255, 255, 248), 'ARIAL', CENTER, CENTER);
    displayText("Draw V to Play Video", width * 0.5, height * 0.55, width * 0.05, color(255, 255, 248), 'ARIAL', CENTER, CENTER);
}

app.drawPPT = function(){
    background(255);
    var img = resource.ppt;
    var scale = (img.width / 2) / width;

    var pptWidth = img.width / 2;
    var pptHeight = img.height / 3;

    var x = app[this.state].slide % 2 * pptWidth;
    var y = int(app[this.state].slide / 2) * pptHeight;

    imageMode(CENTER);
    image(img, x, y, pptWidth, pptHeight, width/2, height/2, pptWidth / scale, pptHeight / scale);

    displayText('Slide: ' + (app[this.state].slide+1) +'/' + app[this.state].slideNo, width * 0.95, height * 0.98, width * 0.02, color(51), 'ARIAL', CENTER, CENTER);
}

app.drawVideo = function(){
    background(255);
    var img = resource.ppt;
    var scale = (img.width / 2) / width;

    var pptWidth = img.width / 2;
    var pptHeight = img.height / 3;

    var x = app[this.state].slide % 2 * pptWidth;
    var y = int(app[this.state].slide / 2) * pptHeight;

    imageMode(CENTER);
    image(img, x, y, pptWidth, pptHeight, width/2, height/2, pptWidth / scale, pptHeight / scale);
    // displayText('Draw X to Return', width * 0.5, height * 0.35, width * 0.05, color(255, 255, 248), 'ARIAL', CENTER, CENTER);

}

app.drawPlot = function(plot, plotCenter, color, width, height) {
    var plotWidth = width * 0.3;
    var plotHeight = height * 0.08;

    var ratio = plotWidth / (plot.length - 50) * 4;
    var magnitude = 4000;
    var shift = width * 0.04;

    rectMode(CENTER);
    fill(39, 44, 52);
    noStroke();
    rect(plotWidth/2 + shift, plotCenter, plotWidth, plotHeight);

    var x = 0;

    stroke(color);
    strokeWeight(2);
    for (var i = 0; i < plot.length - 51; i+=4) {
        var yp = -this.calcY(plot[int(i + 2)], plotHeight, magnitude) + plotCenter;
        var yc = -this.calcY(plot[int(i)], plotHeight, magnitude) + plotCenter;
        line(x + ratio + shift, yp, x + shift, yc);
        x += ratio;
    }
}

app.calcY = function(i, plotHeight, magnitude){
    return (i * plotHeight) / magnitude;
}

app.drawGrid = function(width, height) {
    // ellipse(width/2, height/2, 20,20)

    var startX = 0;
    var endX = width;
    var midX = (endX - startX) / 2 + startX;
    var rangeX = 300;
    var resolX = (endX - startX) / rangeX * 10;
    var startY = round(height * 0.2);
    var endY = height * 0.8;
    var midY = (endY - startY) / 2 + startY;
    var rangeY = 220;
    var resolY = (endY - startY) / rangeY * 10;

    // fill(22,22,22);
    // noStroke();
    // rectMode(CENTER);
    // rect(width/2, height/2, width+resolX*8, height);

    fill(22,22,22);
    // fill(51,51,51);
    noStroke();
    rectMode(CENTER);
    rect(width/2, height/2, width, height);


    for (var i = endY * 2; i > 0; i -= 8 * resolY) {
        //stroke(0, 255, 0, 155);
        stroke(7, 169, 248, 155);
        strokeWeight(2);
        // fill(0, 0, 0);
        noFill();
        // ellipse(midX, startY, i, i);
        if(i > endX - startX){
            var angle = acos((endX - startX) / i);
            // console.log(angle)
            arc(midX, startY, i, i, angle, PI - angle);
        }
        else{
            arc(midX, startY, i, i, 0, PI);
        }
    }


    // for (var i = startY; i < height; i += 2*resolY) {
    //     stroke(7, 169, 248, 155);
    //     strokeWeight(2);
    //     noFill()
    //     line(startX, i, endX, i);
    // }

    // for (var i = startX; i < endX; i += 2*resolX) {
    //     stroke(7, 169, 248, 155);
    //     strokeWeight(2);
    //     noFill()
    //     line(i, startY, i, height);
    // }

    line(midX, startY, midX, height);
}

app.drawButton = function() {
  var buttons = app[app.state].button;
  if(buttons != null){
    for(var i = 0; i < buttons.length; i++){
      var button = buttons[i];
      if(button.parentState == this.state && (button.state == DISABLE || button.state == DISPLAY)){
        app[app.state].button[i].enable();
        console.log("enable");
      }
      else if(button.parentState != this.state){
        app[app.state].button[i].disable();
      }
      button.draw();
    }
  }
}

app.drawPath = function() {

    for (var i = paths.length - 1; i >= 0; i--) {
        var c = paths[i];
        if (!c.isDead()) {
            if(!this.recog)
                c.update();
            c.display();
        } else {
            paths.splice(i, 1);
        }
    }
}

app.drawIcon = function(){
    for(var i = this.icons.length - 1; i >= 0; i--){
        var c = this.icons[i];
        if(!c.isDead()){
            c.update();
            c.display();
        }else{
            this.icons.splice(i,1);
        }
    }
}

app.gestureplot = function(coor)
{
    paths = [];
    for(var i = coor.length - 1; i >= 0; i--)
    {
        paths.push(new circle(createVector(coor[i][0],coor[i][1]),20));
    }
}

app.setupVideo = function(){
    video = createVideo("video/video.ogv");
    video.style("z-index","-2");
    video.style("width","60%");
    video.position(window.innerWidth / 2 - video.elt.clientWidth/2, window.innerHeight/2 - video.elt.clientHeight*0.7);
    video.loop();
}

app.removeVideo = function() {
    if(video != undefined || video != null){
        video.remove();
    }
}

app.makeVideoVisible = function(){
    video.style("z-index","0");
}

function pushCoordinate(coor) {
    if((coor[0] != 0 || coor[1] != 0) && (abs(coor[0]) < 150 && abs(coor[1]) < 300))
        paths.push(new circle(createVector(coor[0], coor[1]), 20));
}

function pushChannelSignalData(data) {
    ch1Data = data.slice(0, data.length / 2);
    ch2Data = data.slice(data.length / 2, data.length);
}

function preload() {
    resource = {
        // sensor: loadImage('img/' + 'welle_module.png'),
        welle : loadImage('img/' + 'icon_black.png'),
        // ppt1 : loadImage('img/ppt/' + 'Welle_PPT_1.png' ),
        // ppt2 : loadImage('img/ppt/' + 'Welle_PPT_2.png' ),
        // ppt3 : loadImage('img/ppt/' + 'Welle_PPT_3.png' ),
        // ppt4 : loadImage('img/ppt/' + 'Welle_PPT_4.png' ),
        // ppt5 : loadImage('img/ppt/' + 'Welle_PPT_5.png' ),
        // ppt6 : loadImage('img/ppt/' + 'Welle_PPT_6.png' ),
        ppt  : loadImage('img/ppt/' + 'Welle_PPT.png')

    }
}

function setup() {
    // app.setupVideo();

    socket.on("coor", function(data) {
        app.gestureplot(data); // TO-DO: Modulize it
    });

    socket.emit('config', {deviceMode:'TRACKING'});

    socket.on('serialport', function(data){
        // console.log(data)
        if(data.event){
            if(data.event == 'port open'){
                app.device_connected = true;
            }
            else{
                app.device_connected = false;
            }
        }
    })

    socket.on('bleStatus', function(data){
        // console.log(data)
        if(data.event){
            if(data.event == 'connected'){
                app.device_connected = true;
            }
            else{
                app.device_connected = false;
            }
        }
    })


    socket.on('l', function(data){
        app.icons = [];
        app.icons.push(new iconDisplay(createVector(app.iconTranslateX,  app.iconTranslateY),createVector(app.radarWidth*0.7,app.radarHeight*0.7),data));
    });


    canvas = createCanvas(document.body.clientWidth*2/3, document.body.clientHeight*2/3);
    canvas.style('z-index', '-1')
    canvas.position(0, 0);
    canvas.style('width', '100%');
    canvas.style('height', '100%');

    app.radarWidth = width;
    app.radarHeight = height;

    app.stateRadar();
    var xt = 2000;
    for (var i = 0; i < ch2Data.length; i++) {
        ch1Data[i] = map(noise(xt), 0, 1, -500, 500);
        ch2Data[i] = map(noise(xt + 5000), 0, 1, -500, 500);
        xt += 0.01;
    }

    setTimeout(function(){
        var splash = window.document.getElementById('splash');
        splash.hidden = true;
    },1500);
}

function draw() {
    fill(0);
    rectMode(CENTER);
    // stroke(255);
    // strokeWeight(2);
    rect(width / 2, height / 2, width, height);
    app.draw();
}

function touchStarted() {
    var buttons = app[app.state].button;
    if(buttons != null){
        for(var i = 0; i < buttons.length; i++){
          var button = buttons[i];
          button.testTouch(createVector(mouseX/app.ratio, mouseY/app.ratio));
        }
    }
}

function touchEnded() {
    var buttons = app[app.state].button;
    if(buttons != null){
        for(var i = 0; i < buttons.length; i++){
          var button = buttons[i];
          button.released();
          button.state = ENABLE;
        }
    }
}

function keyPressed(){
    console.log(keyCode)
    if(app.state == PPT){
        if(keyCode == LEFT_ARROW){
            app[app.state].slide -= 1;
            app[app.state].slide = app[app.state].slide < 0 ? (app[app.state].slide + app[app.state].slideNo) : app[app.state].slide;
        }else if(keyCode == RIGHT_ARROW){
            app[app.state].slide += 1;
            app[app.state].slide %= app[app.state].slideNo;

        }else if(keyCode == 88 || keyCode == 120){
            app.stateRadar()
        }else if(keyCode == 118 || keyCode == 86){
            app.stateVideo();
        }
    }
    else if(app.state == LANDING){
        // P
        if(keyCode == 112 || keyCode == 80){
            app.statePPT();
        }
        // V
        else if(keyCode == 118 || keyCode == 86){
            app.stateVideo();
        }
        else if(keyCode == 88 || keyCode == 120){
            app.stateRadar();
        }
    }
    else if(app.state == VID){
        if(keyCode == 88 || keyCode == 120){
            app.removeVideo();
            app.returnBackState();
        }
        else if(keyCode == 112 || keyCode == 80){
            app.removeVideo();
            app.statePPT();
        }
    }
}

app.returnBackState = function(){
    if(this.preState == RADAR){
        this.stateRadar();
    }else if(this.preState == LANDING){
        this.stateLanding();
    }else if(this.preState == PPT){
        this.statePPT();
    }else if(this.preState == VID){
        this.stateVideo();
    }
}

function circle(pos, r) {
    this.translateX = app.radarTranslateX;
    this.translateY = app.radarTranslateY;
    this.width = app.radarWidth;
    this.height = app.radarHeight;
    this.pos = pos;
    this.opac = 255;
    this.decr = 4;
    this.r = r/width * this.width == 10 ? r : r/width * this.width;
}

circle.prototype.update = function() {
    this.opac -= this.decr;
}

circle.prototype.display = function() {
    push();
    translate(this.translateX, this.translateY);
    fill(42, 191, 205, this.opac);
    noStroke();
    ellipse(map(this.pos.x, -120, 120, -this.width * 0.5, this.width * 0.5) + this.width / 2, map(this.pos.y, -80, -300, -this.height * 0.4, this.height * 0.4) + this.height * 0.6, this.r, this.r);
    pop();
}

circle.prototype.isDead = function() {
    if (this.opac < 0) {
        return true;
    } else {
        return false;
    }
}

function windowResized() { // Richard: UNUSED FUNCTION
    resizeCanvas(document.body.clientWidth*2/3, document.body.clientHeight*2/3);
    canvas.style('z-index', '-1')
    canvas.position(0, 0);
    canvas.style('width', '100%');
    canvas.style('height', '100%');
    if(app.state == RADAR){
        app.stateRadar();
    }
    else if(app.state == LANDING){
        app.stateLanding();
    }
    else if(app.state == PPT){
        app.statePPT();
    }
    else if(app.state == VID){
        app.stateVideo();
    }
}

function displayText(content, x, y, size, color, font, verticalAlign, horizontalAlign) {
    fill(color);
    noStroke();
    textFont("ARIAL");
    textStyle(NORMAL);
    textSize(size);
    textAlign(verticalAlign, horizontalAlign);
    text(content, x, y);
}

function iconDisplay(translate, size, letter, image){
    this.translate = translate;
    this.size = size;
    this.letter = letter;
    this.image = image;
    this.opac = 300;
    this.opacDecr = 4;
}

iconDisplay.prototype.update = function(){
    this.opac -= this.opacDecr;
}

iconDisplay.prototype.display = function(){
    push();
        translate(this.translate.x, this.translate.y);
        fill(255,255,255,this.opac);
        rectMode(CENTER);
        rect(0, 0, this.size.x, this.size.y, 40);
        translate(-this.size.x/2, -this.size.y/2);
        if(this.image){
            var scale = this.image.width / (this.size.x / 2 * 0.8);
            displayText(this.letter, this.size.x/4, this.size.y/2, this.size.y*0.5, color(51,51,51, this.opac), 'ARIAL', CENTER, CENTER);
            imageMode(CENTER);
            tint(255, this.opac);
            image(this.image, 0, 0, this.image.width, this.image.height, this.size.x * 0.75, this.size.y/2, this.image.width / scale, this.image.height / scale);
        }
        else{
            displayText(this.letter, this.size.x/2, this.size.y/2, this.size.y*0.5, color(0, this.opac), 'ARIAL', CENTER, CENTER);
        }
    pop();
}

iconDisplay.prototype.isDead = function(){
    return this.opac <= 0 ? true : false;
}
