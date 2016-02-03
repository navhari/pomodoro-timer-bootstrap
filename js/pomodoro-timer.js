/**
 * pomodoro-timer.js
 **/
var isDebug = false;

var gHours = 0;
var gMinutes = 0;
var gSeconds = 0;

var timerDuration;
var beginTime;
var timeElapsed;
var remainingTime;
var isRunTimer = false;

var loopRenderInterval = 1000;
var nextIntervalAdjust = 20;
var deltaRenderTime = 0;
var currentRenderTime = 0;
var lastRenderTime = 0;

var beginRenderTime = 0;
var expectedRenderTime = 0;

var renderHandle;

var audio = new Audio('./sounds/beep.mp3');

$(document).ready(function() {
  onPomodoroTimer();

  beginRender();
  enableButtons();
});

function enableButtons() {
  $('#restartButton').removeAttr('disabled');
  $('#startButton').removeAttr('disabled');
  $('#stopButton').removeAttr('disabled');
}

function onPomodoroTimer(){

  stopTimer();

  gHours = 0;
  gMinutes = 25;
  gSeconds = 0;

  resetTimer();

  $('#shortButton').removeClass('btn-success active');
  $('#longButton').removeClass('btn-success active');
  $('#breakButton').removeClass('btn-success active');
  $('#shortButtonDropdownItem').removeClass('active');
  $('#longButtonDropdownItem').removeClass('active');

  $('#pomodoroButton').addClass('btn-success  active');
}

function onShortTimer(){

  stopTimer();

  gHours = 0;
  gMinutes = 5;
  gSeconds = 0;

  resetTimer();

  $('#pomodoroButton').removeClass('btn-success active');
  $('#longButton').removeClass('btn-success active');
  $('#longButtonDropdownItem').removeClass('active');

  $('#shortButton').addClass('btn-success active');
  $('#breakButton').addClass('btn-success active');
  $('#shortButtonDropdownItem').addClass('active');
}

function onLongTimer(){

  stopTimer();

  gHours = 0;
  gMinutes = 15;
  gSeconds = 0;

  resetTimer();

  $('#pomodoroButton').removeClass('btn-success active');
  $('#shortButton').removeClass('btn-success active');
  $('#shortButtonDropdownItem').removeClass('active');

  $('#longButton').addClass('btn-success active');
  $('#breakButton').addClass('btn-success active');
  $('#longButtonDropdownItem').addClass('active');

}

function onStartTimer(){
  startTimer();
};

function onStopTimer(){
  stopTimer();
};

function onResetTimer(){
  stopTimer();
  resetTimer();
}

function playAlarm(){
  audio.play();
}

function startTimer() {
  if(!isRunTimer) {
    beginTime = Date.now();
    isRunTimer = true;
  }
}

function stopTimer() {
  if(isRunTimer) {
    timerDuration = remainingTime;
    isRunTimer = false;
  }
}

function resetTimer(){

  timerDuration = (gHours*60*60*1000)+
                  (gMinutes*60*1000)+
                  (gSeconds*1000);

  remainingTime = timerDuration;

  displayTimer();
}

function formatTime(intergerValue) {
  return intergerValue > 9 ? intergerValue.toString():'0'+intergerValue.toString();
}

function decrementTimer(){

  var lastTimeElased = timeElapsed;
  var lastRemainingTime = remainingTime;

  if(remainingTime<1000){
    remainingTime = 0;

    stopTimer();
    playAlarm();
  } else {
    timeElapsed = Date.now() - beginTime;
    remainingTime = timerDuration - timeElapsed;
  }

  if(isDebug) {
    console.log('----');
    console.log('timeElapsed: ' + timeElapsed);
    console.log('timeElapsed(sec): ' + (timeElapsed/1000));
    console.log('timeDelta: ' + (timeElapsed - lastTimeElased));
    console.log('remainingTime: '+ remainingTime);
  }

  displayTimer();
}

function displayTimer(){

  var deltaTime=remainingTime;

  var hoursValue=Math.floor(deltaTime/(1000*60*60));
  deltaTime=deltaTime%(1000*60*60);

  var minutesValue=Math.floor(deltaTime/(1000*60));
  deltaTime=deltaTime%(1000*60);

  var secondsValue=Math.floor(deltaTime/(1000));

  if(isDebug) {
    console.log('----');
    console.log('hoursValue: ' + hoursValue);
    console.log('minutesValue: ' + minutesValue);
    console.log('secondsValue: ' + secondsValue);
  }

  animateTime(hoursValue, minutesValue, secondsValue);
};


function animateTime(remainingHours, remainingMinutes, remainingSeconds) {

  var $hoursValue = $('#hoursValue');
  var $minutesValue = $('#minutesValue');
  var $secondsValue =   $('#secondsValue');

  var $hoursNext = $('#hoursNext');
  var $minutesNext = $('#minutesNext');
  var $secondsNext =   $('#secondsNext');

  // position
  $hoursValue.css('top', '0em');
  $minutesValue.css('top', '0em');
  $secondsValue.css('top', '0em');

  $hoursNext.css('top', '0em');
  $minutesNext.css('top', '0em');
  $secondsNext.css('top', '0em');

  var oldHoursString = $hoursNext.text();
  var oldMinutesString = $minutesNext.text();
  var oldSecondsString = $secondsNext.text();

  var hoursString = formatTime(remainingHours);
  var minutesString = formatTime(remainingMinutes);
  var secondsString = formatTime(remainingSeconds);

  $hoursValue.text(oldHoursString);
  $minutesValue.text(oldMinutesString);
  $secondsValue.text(oldSecondsString);

  $hoursNext.text(hoursString);
  $minutesNext.text(minutesString);
  $secondsNext.text(secondsString);

  // set and animate
  if(oldHoursString !== hoursString) {
    $hoursValue.animate({top: '-1em'});
    $hoursNext.animate({top: '-1em'});
  }

  if(oldMinutesString !== minutesString) {
    $minutesValue.animate({top: '-1em'});
    $minutesNext.animate({top: '-1em'});
  }

  if(oldSecondsString !== secondsString) {
    $secondsValue.animate({top: '-1em'});
    $secondsNext.animate({top: '-1em'});
  }
}

function beginRender() {

  clearRender();

  expectedRenderTime = beginRenderTime = Date.now();
  lastRenderTime = currentRenderTime = Date.now();

  renderHandle = setTimeout(function() {
    render();
  }, loopRenderInterval);
}

function clearRender() {
  if(renderHandle) {
    clearTimeout(renderHandle);
  }
}

function render() {

  // do stuff here
  if(isRunTimer) {
    decrementTimer();
  }

  // ideal clock
  expectedRenderTime+=loopRenderInterval;

  // current clocks
  lastRenderTime = currentRenderTime;
  currentRenderTime = Date.now();

  // delta to catch up with ideal clock
  deltaRenderTime = (expectedRenderTime - currentRenderTime);

  var nextInterval = (loopRenderInterval + deltaRenderTime);
  var adjustedNextInterval = nextInterval - nextIntervalAdjust;

  if(isDebug) {
    console.log('----');
    console.log('expectedRenderTime: ' + (expectedRenderTime%(60*1000))/1000);
    console.log('currentRenderTime: ' + (currentRenderTime%(60*1000))/1000);
    console.log('lastRenderTime: ' + (lastRenderTime%(60*1000))/1000);
    console.log('drift: ' + ((currentRenderTime) - (expectedRenderTime)));
    console.log('deltaRenderTime: '+ deltaRenderTime);
    console.log('nextInterval: '+ nextInterval);
    console.log('adjustedNextInterval: '+ adjustedNextInterval);
  }

  // schedule next render
  if(renderHandle) {
    clearTimeout(renderHandle);

    renderHandle = setTimeout(function() {
      render();
    }, nextInterval);
  }
}
