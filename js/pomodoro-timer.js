var gHours = 0;
var gMinutes = 0;
var gSeconds = 0;

var beginTime;
var timerDuration;
var timeElapsed;
var remainingTime;

var countdownHandle;

var audio = new Audio('./sounds/beep.mp3');

$(document).ready(function() {
  onPomodoroTimer();
});

function onPomodoroTimer(){

  stopTimer();

  gHours = 0;
  gMinutes = 50;
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

  beginTime = Date.now();

  countdownHandle=setInterval(function() {
    decrementTimer();
  },1000);
}

function stopTimer() {

  timerDuration = remainingTime;

  clearInterval(countdownHandle);
}

function resetTimer(){

  timerDuration = (gHours*60*60*1000)+
                  (gMinutes*60*1000)+
                  (gSeconds*1000);

  remainingTime = timerDuration;

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

  timeElapsed = Date.now() - beginTime;
  remainingTime = timerDuration - timeElapsed;

  if(remainingTime<1000){
    remainingTime = 0;

    stopTimer();
    playAlarm();
  }

  renderTimer();
}
