/*
* pixidust.js
* a collection of wrappers on pixi.js functionality for the sake 
* of making the interface more obvious for students who have
* been introduced to graphical programming by cs106A.
*/

/* HERE FOLLOWS A COOL WATCH HACK SO I CAN WATCH THINGS 
* It is included here for modularity. I don't want to 
* include another file in the html for the sake of keeping it 
* minimal and transparent for students. Pixidust is an all-or
* nothing package
*/
/*
* object.watch polyfill
*
* 2012-04-03
*
* By Eli Grey, http://eligrey.com
* Public Domain.
* NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
*/
 
// object.watch
if (!Object.prototype.watch) {
Object.defineProperty(Object.prototype, "watch", {
enumerable: false
, configurable: true
, writable: false
, value: function (prop, handler) {
var
oldval = this[prop]
, newval = oldval
, getter = function () {
return newval;
}
, setter = function (val) {
oldval = newval;
return newval = handler.call(this, prop, oldval, val);
}
;
if (delete this[prop]) { // can't watch constants
Object.defineProperty(this, prop, {
get: getter
, set: setter
, enumerable: true
, configurable: true
});
}
}
});
}

 
// object.unwatch
if (!Object.prototype.unwatch) {
Object.defineProperty(Object.prototype, "unwatch", {
enumerable: false
, configurable: true
, writable: false
, value: function (prop) {
var val = this[prop];
delete this[prop]; // remove accessors
this[prop] = val;
}
});
}



/* HERE STARTS PIXIDUST
* LET THE GAMES BEGIN
*/ 



/* Init and Utility functions */

/* hack to let GObjects be treated like graphics elements
 * to the eyes of the stage */
PIXI.Stage.prototype.add = function(graphicsObject) {
    if (graphicsObject instanceof GObject) {
        this.addChild(graphicsObject.graphics);
        this.gobjects.push(graphicsObject);
    }
}

/* hack to let GObjects be treated like graphics elements
 * to the eyes of the stage */
PIXI.Stage.prototype.remove = function(graphicsObject) {
    if (graphicsObject instanceof GObject) {
        this.removeChild(graphicsObject.graphics);
        var i = this.gobjects.indexOf(graphicsObject);
        if (i > -1) {
            this.gobjects.splice(i, 1);   
        }
    }
}

PIXI.Stage.prototype.getElementAt = function(x, y, notelem) {
    var children = stage.gobjects;
    for (var i=0; i<children.length; ++i) {
        var child = children[i];
        if (child.position.x < x && (child.position.x + child.width > x)
            && child.position.y < y && (child.position.y + child.height > y))
        {
            return children[i];
        }
    }
    return null;
}

var stage;
var renderer;
    function setBackground(width, height, color) {
        var checkLoad = function() {   
        document.readyState !== "complete" ? setTimeout(checkLoad,11) : function(){};   
    };  

    checkLoad();  
        
    /* SETUP */
    stage = new PIXI.Stage(0xFFFFFF); // make a white stage
    stage.gobjects = [];

    renderer = PIXI.autoDetectRenderer(width, height);

    document.body.appendChild(renderer.view);

    requestAnimFrame(animate);
        /* End Setup */
    return stage;
}

function animate() {
    requestAnimFrame(animate);
    if (typeof(drawFrame) === 'function') {
        drawFrame();
    }
    renderer.render(stage);
}

/* End init and utility funcitons */

/* GObject */
function GObject(startx,starty) {
    this.filled = true;
    this.graphics = new PIXI.Graphics();
    this.color = 0x000000;
    this.position = {x:startx, y:starty, gobject:this};
    this.position.watch('x', function(prop, oldval, newval) { 
        this.gobject.refresh(); 
        return newval;
    }); 
    this.position.watch('y', function(prop, oldval, newval) { 
        this.gobject.refresh(); 
        return newval;
    }); 
}

GObject.prototype = {
    setColor: function(color) { this.color = color; this.refresh(); },
    refresh: function() { 
        this.graphics.clear();
        if (this.filled) {
            this.graphics.beginFill(this.color);
        } else {
            this.graphics.lineStyle(1, this.color, 1.0);
        }
        this.draw();
        if (this.filled) {
            this.graphics.endFill(this.color);
        } 
    },
    draw: function() { /*ABSTRACT: override to draw something*/ }
};
/* End GObject */

/* GRect */
function GRect(x, y, width, height) {
    GObject.call(this, x, y);
    this.width = width;
    this.height = height;
    this.refresh();
}

GRect.prototype = Object.create(GObject.prototype);
GRect.prototype.constructor = GRect;
GRect.prototype.getWidth = function() { return this.width; };
GRect.prototype.getHeight = function() { return this.height; };
GRect.prototype.setWidth = function(width) { this.width = width; this.refresh(); };
GRect.prototype.setHeight = function(height) { this.height = height; this.refresh(); };
GRect.prototype.draw = function() { this.graphics.drawRect(this.position.x, this.position.y, this.width, this.height); }
/* End GRect */

/* GOval */
function GOval(x, y, radiusx, radiusy) {
    GObject.call(this, x, y);
    this.radiusx = radiusx;
    this.radiusy = radiusy;
    this.refresh();
}

GOval.prototype = Object.create(GObject.prototype);
GOval.prototype.constructor = GOval;
GOval.prototype.getRadiusX = function() { return this.radiusx; }
GOval.prototype.setRadiusX = function(radius) { this.radiusx = radiusx; this.referesh(); }
GOval.prototype.getRadiusY = function() { return this.radiusy; }
GOval.prototype.setRadiusY = function(radius) { this.radiusy = radiusy; this.referesh(); }
GOval.prototype.draw = function() { this.graphics.drawEllipse(this.position.x, this.position.y, this.radiusx, this.radiusy); }
/* End GOval */

/* GCircle */
function GCircle(x, y, radius) {
    GOval.call(this, x, y, radius, radius);
    this.radius = radius;
    this.refresh();
}

GCircle.prototype = Object.create(GOval.prototype);
GCircle.prototype.constructor = GCircle;
GCircle.prototype.getRadius = function() { return this.radius; }
GCircle.prototype.setRadius = function(radius) { this.setRadiusX(radius); this.setRadiusY(radius); this.radius = radius; }
/* End GCircle */




