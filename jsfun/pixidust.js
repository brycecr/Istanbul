/* HERE FOLLOWS A COOL WATCH HACK SO I CAN WATCH THINGS *?
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
/* HERE STARTS PIXIDUST */

PIXI.Stage.prototype.add = function(graphicsObject) {
    if (graphicsObject instanceof GObject) {
        this.addChild(graphicsObject.graphics);
    }
}

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
