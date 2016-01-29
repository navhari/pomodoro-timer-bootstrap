var gHours = 0;
var gMinutes = 0;
var gSeconds = 0;

var remainingTime;

var countdownHandle;

var audio = new Audio('./sounds/beep.mp3');

$(document).ready(function() {
  onPomodoroTimer();
});

function onPomodoroTimer(){

  stopTimer();

  gHours = 0;
  gMinutes = 55;
  gSeconds = 0;

  resetTimer();

  $('#shortButton').removeClass('btn-success');
  $('#longButton').removeClass('btn-success');
  $('#pomodoroButton').addClass('btn-success');
}

function onShortTimer(){

  stopTimer();

  gHours = 0;
  gMinutes = 5;
  gSeconds = 0;

  resetTimer();

  $('#pomodoroButton').removeClass('btn-success');
  $('#longButton').removeClass('btn-success');
  $('#shortButton').addClass('btn-success');
}

function onLongTimer(){

  stopTimer();

  gHours = 0;
  gMinutes = 15;
  gSeconds = 0;

  resetTimer();

  $('#pomodoroButton').removeClass('btn-success');
  $('#shortButton').removeClass('btn-success');
  $('#longButton').addClass('btn-success');
}

function onStartTimer(){
  stopTimer();
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
  countdownHandle=setInterval(function() {
    decrementTimer();
  },1000);
}

function stopTimer() {
  clearInterval(countdownHandle);
}

function resetTimer(){

  remainingTime = (gHours*60*60*1000)+
                  (gMinutes*60*1000)+
                  (gSeconds*1000);

  renderTimer();
}

function renderTimer(){

  var deltaTime=remainingTime;

  var hoursValue=Math.floor(deltaTime/(1000*60*60));
  deltaTime=deltaTime%(1000*60*60);

  var minutesValue=Math.floor(deltaTime/(1000*60));
  deltaTime=deltaTime%(1000*60);

  var secondsValue=Math.floor(deltaTime/(1000));

  animateTime(hoursValue, minutesValue, secondsValue);
};


function animateTime(remainingHours, remainingMinutes, remainingSeconds) {

  var $hoursValue = $('#hoursValue');
  var $minutesValue = $('#minutesValue');
  var $secondsValue =   $('#secondsValue');

  var $hoursNext = $('#hoursNext');
  var $minutesNext = $('#minutesNext');
  var $secondsNext =   $('#secondsNext');

  $hoursValue.stop();
  $minutesValue.stop();
  $secondsValue.stop();

  $hoursNext.stop();
  $minutesNext.stop();
  $secondsNext.stop();

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
    $hoursValue.animate({top: '-=1em'});
    $hoursNext.animate({top: '-=1em'});
  }

  if(oldMinutesString !== minutesString) {
    $minutesValue.animate({top: '-=1em'});
    $minutesNext.animate({top: '-=1em'});
  }

  if(oldSecondsString !== secondsString) {
    $secondsValue.animate({top: '-=1em'});
    $secondsNext.animate({top: '-=1em'});
  }
}


function formatTime(intergerValue) {
  return intergerValue > 9 ? intergerValue.toString():'0'+intergerValue.toString();
}

function decrementTimer(){

  if(remainingTime<1000){
    stopTimer();
    playAlarm();
  } else {
    remainingTime-=(1*1000);
  }

  renderTimer();
}
