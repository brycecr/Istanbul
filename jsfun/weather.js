/*
 * Names of images:
 * sunny, snow_s_cloudy, snow, rain_s_cloudy, rain_light, partly_cloudy, rain
 */

var stage = setBackground(600,600,0xFFFFFF);

var IMAGE_Y = 50;
var IMAGE_WIDTH = 48;
var IMAGE_HEIGHT = 48;
var IMAGE_GAP = 10;

var TEXT_Y = 50 + IMAGE_HEIGHT + IMAGE_GAP;

var images = ['sunny.png', 'snow_s_cloudy.png', 'snow.png', 
              'rain_s_cloudy.png', 'rain_light.png', 'partly_cloudy.png', 'rain.png'];

function getColor(temp) {
    if (temp < 40) {
        return '#0000FF';   
    } else if (temp < 90) {
        return '#00FF00';   
    } else {
        return '#FF0000';
    }
}

for (var i=0; i<images.length; ++i) {
    var sprite = PIXI.Sprite.fromImage('data/'+images[i]);
    sprite.position.y = IMAGE_Y;
    sprite.position.x = IMAGE_GAP + (IMAGE_GAP+IMAGE_WIDTH)*i;
    stage.add(sprite);
    
    var temp = Math.round(Math.random()*130 - 27);
    
    var countingText = new PIXI.Text(temp, { font: "30px Verdana", fill: getColor(temp), align: "center"});
    countingText.position.x = IMAGE_GAP + (IMAGE_GAP+IMAGE_WIDTH)*i;
    countingText.position.y = TEXT_Y;
    stage.add(countingText);
}
