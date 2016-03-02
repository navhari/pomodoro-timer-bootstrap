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
var isSoundEnabled = true;
var isStopEnabled = false;

var loopRenderInterval = 1000;
var nextIntervalAdjust = 20;
var deltaRenderTime = 0;
var currentRenderTime = 0;
var lastRenderTime = 0;

var beginRenderTime = 0;
var expectedRenderTime = 0;

var renderHandle;

var isGestureAquired = false;
var audio = new Audio('./sounds/beep.mp3');
var unmuteAudio = new Audio('./sounds/unmute.mp3');

$(document).ready(function() {

  beginRender();

  initTimer();
});

function initTimer() {

  stopTimer();

  $('#shortButton').removeClass('btn-success');
  $('#longButton').removeClass('btn-success');
  $('#breakButton').removeClass('btn-success');
  $('#breakButtonDropdown').removeClass('btn-success');
  $('#shortButtonDropdownItem').removeClass('active');
  $('#longButtonDropdownItem').removeClass('active');

  $('#pomodoroButton').addClass('btn-success');
  $('#pomodoroButtonDropdown').addClass('btn-success');

  gHours = 0;
  gMinutes = 25;
  gSeconds = 0;

  $('#minute25DropdownItem').addClass('active');
  $('#minute55DropdownItem').removeClass('active');

  resetTimer();

  $('#restartButton').removeAttr('disabled');
  $('#startButton').removeAttr('disabled');
  $('#stopButton').removeAttr('disabled');

  updateSound();

  $('.listen-guestures').on('click', function() {
    onGuestureFixAudio();
  });
}

// Trick toplay sounds on mobile
function onGuestureFixAudio() {
  if(!isGestureAquired) {
    audio.play();
    audio.pause();
    unmuteAudio.play();
    unmuteAudio.pause();

    isGestureAquired = true;
  }
}

function onSoundToggle() {

  if(isSoundEnabled) {
    isSoundEnabled = false;
  } else {
    isSoundEnabled = true;
    unmuteAudio.pause();
    unmuteAudio.play();
  }

  updateSound();
}

function updateSound() {
  if(isSoundEnabled) {
    $("#alarmButton").removeClass("is-muted");
    $("#alarmButton > i").removeClass("fa-bell-slash");
    $("#alarmButton > i").addClass("fa-bell");
  } else {
    $("#alarmButton > i").removeClass("fa-bell");
    $("#alarmButton").addClass("is-muted");
    $("#alarmButton > i").addClass("fa-bell-slash");
  }
}

function onPomodoroTimer(isUseLong){

  stopTimer();

  $('#shortButton').removeClass('btn-success');
  $('#longButton').removeClass('btn-success');
  $('#breakButton').removeClass('btn-success');
  $('#breakButtonDropdown').removeClass('btn-success');
  $('#shortButtonDropdownItem').removeClass('active');
  $('#longButtonDropdownItem').removeClass('active');

  $('#pomodoroButton').addClass('btn-success');
  $('#pomodoroButtonDropdown').addClass('btn-success');

  if(isUseLong) {
    gHours = 0;
    gMinutes = 55;
    gSeconds = 0;

    $('#minute55DropdownItem').addClass('active');
    $('#minute25DropdownItem').removeClass('active');
  } else {
    gHours = 0;
    gMinutes = 25;
    gSeconds = 0;

    $('#minute25DropdownItem').addClass('active');
    $('#minute55DropdownItem').removeClass('active');
  }

  resetTimer();
  startTimer();

}

function onShortTimer(){

  stopTimer();

  $('#pomodoroButton').removeClass('btn-success');
  $('#pomodoroButtonDropdown').removeClass('btn-success');
  $('#minute55DropdownItem').removeClass('active');
  $('#minute25DropdownItem').removeClass('active');
  $('#longButton').removeClass('btn-success');
  $('#longButtonDropdownItem').removeClass('active');

  $('#shortButton').addClass('btn-success');
  $('#breakButton').addClass('btn-success');
  $('#breakButtonDropdown').addClass('btn-success');
  $('#shortButtonDropdownItem').addClass('active');

  gHours = 0;
  gMinutes = 5;
  gSeconds = 0;

  resetTimer();
  startTimer();

}

function onLongTimer(){

  stopTimer();

  $('#pomodoroButton').removeClass('btn-success');
  $('#pomodoroButtonDropdown').removeClass('btn-success active');
  $('#minute55DropdownItem').removeClass('active');
  $('#minute25DropdownItem').removeClass('active');
  $('#shortButton').removeClass('btn-success');
  $('#shortButtonDropdownItem').removeClass('active');

  $('#longButton').addClass('btn-success');
  $('#breakButton').addClass('btn-success');
  $('#breakButtonDropdown').addClass('btn-success');
  $('#longButtonDropdownItem').addClass('active');

  gHours = 0;
  gMinutes = 15;
  gSeconds = 0;

  resetTimer(true);
  startTimer();

}

function onStartTimer(){
  startTimer();
};

function onStopTimer(){
  stopTimer();
};

function onResetTimer(){
  stopTimer();
  resetTimer(true);
}

function afterStop() {

    $('#restartButton').addClass('hidden');
    $('#startButton').removeClass('hidden');
    $('#stopButton').addClass('hidden');

}

function afterStart() {

    $('#restartButton').removeClass('hidden');
    $('#startButton').addClass('hidden');

    if(isStopEnabled) {
        $('#stopButton').removeClass('hidden');
    }

}


function playAlarm(){
  if(isSoundEnabled) {
    audio.pause();
    audio.play();
  }
}

function startTimer() {
  if(!isRunTimer) {

    beginTime = Date.now();

      // give 1 second delay
    beginTime+= (1 * 1000);

    isRunTimer = true;
    afterStart();
  }
}

function stopTimer() {
  if(isRunTimer) {
    timerDuration = remainingTime;

    isRunTimer = false;
    afterStop();
  }
}

function resetTimer(forceAnimate){

  timerDuration = (gHours*60*60*1000)+
                  (gMinutes*60*1000)+
                  (gSeconds*1000);

  remainingTime = timerDuration;

  displayTimer(forceAnimate);
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

function displayTimer(forceAnimate){

  var deltaTime=remainingTime;

  var hoursValue=Math.floor(deltaTime/(1000*60*60));
  hoursValue = hoursValue > 0 ? hoursValue : 0;
  deltaTime=deltaTime%(1000*60*60);

  var minutesValue=Math.floor(deltaTime/(1000*60));
  minutesValue = minutesValue > 0 ? minutesValue : 0;
  deltaTime=deltaTime%(1000*60);

  var secondsValue=Math.floor(deltaTime/(1000));
  secondsValue = secondsValue > 0 ? secondsValue : 0;

  if(isDebug) {
    console.log('----');
    console.log('hoursValue: ' + hoursValue);
    console.log('minutesValue: ' + minutesValue);
    console.log('secondsValue: ' + secondsValue);
  }

  animateTime(hoursValue, minutesValue, secondsValue, forceAnimate);
};


function animateTime(remainingHours, remainingMinutes, remainingSeconds, forceAnimate) {

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
  if(forceAnimate || oldHoursString !== hoursString) {
    $hoursValue.stop();
    $hoursNext.stop();
    $hoursValue.animate({top: '-1em'});
    $hoursNext.animate({top: '-1em'});
  }

  if(forceAnimate || oldMinutesString !== minutesString) {
    $minutesValue.stop();
    $minutesNext.stop();
    $minutesValue.animate({top: '-1em'});
    $minutesNext.animate({top: '-1em'});
  }

  if(forceAnimate || oldSecondsString !== secondsString) {
    $secondsValue.stop();
    $secondsNext.stop();
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
