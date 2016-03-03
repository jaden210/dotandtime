var canvas, context, clockRadius, isAmbientMode;

window.requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        'use strict';
        window.setTimeout(callback, 1000 / 60);
    };

function renderDots() {
    'use strict';

    var dx = 0,
        dy = 0,
        i = 1,
        angle = null;

    context.save();

    // Assigns the clock creation location in the middle of the canvas
    context.translate(canvas.width / 2, canvas.height / 2);
}

function renderAmbientDots() {
    'use strict';

    context.save();
    //DO AMBIENT STUFF HERE
}

function renderNeedle(angle, radius) {
    'use strict';
    context.save();
    context.rotate(angle);
    context.beginPath();
    context.lineWidth = 4;
    context.strokeStyle = '#fff';
    context.moveTo(6, 0);
    context.lineTo(radius, 0);
    context.closePath();
    context.stroke();
    context.closePath();
    context.restore();

}

function renderHourNeedle(hour) {
    'use strict';

    var angle = null,
        radius = null;

    angle = ((hour-3)*-1) * (Math.PI * 2) / 12;
    radius = clockRadius * 0.55;
    //RENDER
    context.save();
    context.beginPath();
    context.arc(50* Math.cos(angle),
 		   ((50* Math.sin((hour-3)*(Math.PI * 2)/12))-11),
 		   20,0,Math.PI * 2, true);
    context.lineWidth = 4;
    context.fillStyle = '#7FFF00';
    context.fill();
    context.closePath();
    context.textAlign="center";
    context.font="32px arial,serif";
    context.fillStyle = '#FFD700';
    context.fillText(Math.floor(hour),
    		(50 * Math.cos((hour - 3) * (Math.PI * 2)/12)),
    		(50 * Math.sin((hour - 3) * (Math.PI * 2)/12)));
    context.restore();
}

function renderMinuteNeedle(minute) {
    'use strict';

    var angle = null,
        radius = null;
    	
    	
    
    angle = ((minute - 15)*-1) * (Math.PI * 2) / 60;
    radius = clockRadius * 0.85;
    //RENDER
    context.save();
    context.beginPath();
    context.arc(94* Math.cos(angle),
    		   ((94* Math.sin((minute-15)*(Math.PI * 2)/60))-11),
    		   22.5,0,Math.PI * 2, true);
    context.lineWidth = 4;
    context.fillStyle = '#800080';
    context.fill();
    context.closePath();
    context.textAlign="center";
    context.font="32px arial,serif";
    context.fillStyle = '#FFD700';
    context.fillText(Math.floor(minute),
    		(94 * Math.cos((minute-15)*(Math.PI * 2)/60)), 
    		(94 * Math.sin((minute-15)*(Math.PI * 2)/60)),45);
    context.restore();
}
function renderSecondNeedle(second) {
    'use strict';
    var angle = null,
        radius = null;
  
    angle = ((second - 15)*-1) * (Math.PI * 2) / 60;
    radius = clockRadius * 0.85;
    //RENDER
    context.save();
    context.beginPath();
    context.arc(154* Math.cos(angle),
    		   (154* Math.sin((second-15)*(Math.PI * 2)/60)),
    		   25,0,Math.PI * 2, true);
    context.lineWidth = 4;
    context.fillStyle = '#FFFF00';
    context.fill();
    context.closePath();
    context.textAlign="center";
    context.font="48px arial,serif";
    context.fillStyle = '#FFD700';
    context.fillText((Math.floor(second)),0,0,45);
    //context.fillText(((second)),0,0,450);
    context.restore();
}

function getDate() {
    'use strict';

    var date;
    try {
        date = tizen.time.getCurrentDateTime();
    } catch (err) {
        console.error('Error: ', err.message);
        date = new Date();
    }

    return date;
}

function watch() {
    'use strict';

    if (isAmbientMode === true) {
        return;
    }

    // Import the current time
    // noinspection JSUnusedAssignment
    var date = getDate(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds(),
        mili = date.getMilliseconds()*3.45,
        hour = hours + minutes /60,
        minute = minutes + seconds / 60,
        second = seconds + mili/3600,
        nextMove = 100;

    // Erase the previous time
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    renderDots();
    renderHourNeedle(hour);
    renderMinuteNeedle(minute);
    renderSecondNeedle(second);

    context.restore();

    setTimeout(function() {
        window.requestAnimationFrame(watch);
    }, nextMove);
}

function ambientWatch() {
    'use strict';

    // Import the current time
    // noinspection JSUnusedAssignment
    var date = getDate(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds(),
        hour = hours + minutes / 60,
        minute = minutes + seconds / 60;

    // Erase the previous time
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    renderAmbientDots();
    renderHourNeedle(hour);
    renderMinuteNeedle(minute);

    context.restore();
}

window.onload = function onLoad() {
    'use strict';

    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    clockRadius = document.body.clientWidth / 2;

    // Assigns the area that will use Canvas
    canvas.width = document.body.clientWidth;
    canvas.height = canvas.width;

    // add eventListener for tizenhwkey
    window.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === 'back') {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (err) {
                console.error('Error: ', err.message);
            }
        }
    });

    // add eventListener for timetick
    window.addEventListener('timetick', function() {
        console.log("timetick is called");
        ambientWatch();
    });

    // add eventListener for ambientmodechanged
    window.addEventListener('ambientmodechanged', function(e) {
        console.log("ambientmodechanged : " + e.detail.ambientMode);
        if (e.detail.ambientMode === true) {
            // rendering ambient mode case
            isAmbientMode = true;
            ambientWatch();

        } else {
            // rendering normal case
            isAmbientMode = false;
            window.requestAnimationFrame(watch);
        }
    });

    // normal case
    isAmbientMode = false;
    window.requestAnimationFrame(watch);
};
