var TimeControl = function(sessionMin, breakMin, clockRunning, session) {
  this.sessionSec = sessionMin * 60;
  this.breakSec = breakMin * 60;
  this.sessionMinDisplay = Math.floor(this.sessionSec / 60);
  this.sessionSecDisplay = Math.ceil(this.sessionSec % 60);
  this.breakMinDisplay = Math.floor(this.breakSec / 60);
  this.breakSecDisplay = Math.ceil(this.breakSec % 60);
  this.clockRunning = clockRunning;
  this.session = session;
};

var bar = new ProgressBar.Line(line, {
  strokeWidth: 1,
  //easing: 'easeInOut',
  duration: 1400,
  color: '#fff',
  trailColor: '#f19f4d',
  trailWidth: 1.25,
  svgStyle: {width: '100%', height: '100%'},
    text: {
    style: {
      color: '#f19f4d',
      position: 'absolute',
      //right: '1',
      //top: '50px',
      padding: '0',
      margin: '0',
      transform: null
    },
    autoStyleContainer: false
  },
  from: {color: '#f19f4d'},
  to: {color: '#f19f4d'},
  step: (state, bar) => {
    bar.setText(Math.round(bar.value() * 100) + ' %');
  }
});

var initialize = new TimeControl(25, 5, false, true);

TimeControl.prototype.startSession = function() {
  var self = this;
  if (!this.session) {
      this.startBreak();
    }
  if (!this.clockRunning) {
    $("#displaySessionText").show();
    $("#displayBreakText").hide();
    $(".displayMode, #controlSess").css("color", "#f19f4d");
    $("#controlBreak").css("color", "#fff");
    this.sessionInterval = setInterval(function() {
      sessionTimer();
    }, 1000);
    this.clockRunning = true;
}
  function sessionTimer() {
    var constant = parseInt($("#setSession").html()) * 60;
    self.sessionSec = self.sessionSec - 1;
    self.decimalNum = 1 - self.sessionSec / constant;
    bar.animate(self.decimalNum);
    self.sessionMinDisplay = Math.floor(self.sessionSec / 60);
    self.sessionSecDisplay = Math.ceil(self.sessionSec % 60);
    if (self.sessionSecDisplay < 10) {
      self.sessionSecDisplay = "0" + self.sessionSecDisplay;
    }
    $("#mainDisplay").html(self.sessionMinDisplay + ":" + self.sessionSecDisplay);
    if (self.sessionSec === 0) {
      clearInterval(self.sessionInterval);
      self.startBreak();
    }
  }
};
TimeControl.prototype.startBreak = function() {
  var self = this;
  this.session = false;
  $("#displayBreakText").show();
  $("#displaySessionText").hide();
  $(".displayMode, #controlBreak").css("color", "#f19f4d");
  $("#controlSess").css("color", "#fff");
  this.breakInterval = setInterval(function() {
    breakTimer();
  }, 1000);
  this.clockRunning = true;
  function breakTimer() {
    var constantBreak = parseInt($("#setBreak").html()) * 60;
    self.breakSec = self.breakSec - 1;
    self.decimalNum = 1 - self.breakSec / constantBreak;
    bar.animate(self.decimalNum);
    self.breakMinDisplay = Math.floor(self.breakSec / 60);
    self.breakSecDisplay = Math.ceil(self.breakSec % 60);
    if (self.breakSecDisplay < 10) {
      self.breakSecDisplay = "0" + self.breakSecDisplay;
    }
    $("#mainDisplay").html(self.breakMinDisplay + ":" + self.breakSecDisplay);
    if (self.breakSec === 0) {
      clearInterval(self.breakInterval);
      self.stateToStart();
    }
  }
};
TimeControl.prototype.pause = function() {
  clearInterval(this.sessionInterval);
  clearInterval(this.breakInterval);
  this.clockRunning = false;
};
TimeControl.prototype.stateToStart = function() {
  clearInterval(this.sessionInterval);
  clearInterval(this.breakInterval);
  this.sessionSec = 25 * 60;
  this.breakSec = 5 * 60;
  this.sessionMinDisplay = Math.floor(this.sessionSec / 60);
  this.sessionSecDisplay = Math.ceil(this.sessionSec % 60);
  this.breakMinDisplay = Math.floor(this.breakSec / 60);
  this.clockRunning = false;
  this.session = true;
  bar.animate(0);
  if (this.sessionSecDisplay < 10 && this.sessionSecDisplay !== '00') {
    this.sessionSecDisplay = "0" + this.sessionSecDisplay;
  }
  $("#mainDisplay").html(this.sessionMinDisplay + ":" + this.sessionSecDisplay);
  $("#setSession").html(this.sessionMinDisplay);
  $("#setBreak").html(this.breakMinDisplay);
  $("#displaySessionText").show();
  $("#displayBreakText").hide();
  $(".displayMode, .control").css("color", "#fff");
};
TimeControl.prototype.sessionTimeUpdate = function(sessionUpdate){
  this.sessionSec = sessionUpdate * 60;
};
TimeControl.prototype.breakTimeUpdate = function(breakUpdate){
  this.breakSec = breakUpdate * 60;
};
var sessionMinUpdated, breakMinUpdated;

var startSound = new 
Audio('http://soundbible.com/mp3/Pen%20Clicking-SoundBible.com-482574858.mp3');

var pauseSound = new Audio('http://soundbible.com/mp3/Click-SoundBible.com-1387633738.mp3');

var resetSound = new Audio('http://soundbible.com/mp3/sms-alert-1-daniel_simon.mp3');

$(document).ready(function() {
  initialize.stateToStart();
  
  $("#reset").click(function() {
    resetSound.play();
    initialize.stateToStart();
  });
  $("#play").click(function() {
    startSound.play();
    initialize.startSession();
  });
  $("#pause").click(function() {
    pauseSound.play();
    initialize.pause();
  });
  $("#addTime").click(function() {
    sessionMinUpdated = parseInt($("#setSession").html()) + 1;
    $("#setSession").html(sessionMinUpdated);
    initialize.sessionTimeUpdate(sessionMinUpdated);
  
  });
  $("#subtractTime").click(function() {
    if (parseInt($("#setSession").html()) > 1) {
      sessionMinUpdated = parseInt($("#setSession").html()) - 1;
      $("#setSession").html(sessionMinUpdated);
      initialize.sessionTimeUpdate(sessionMinUpdated);
    }
  });
  $("#addBreak").click(function() {
    breakMinUpdated = parseInt($("#setBreak").html()) + 1;
    $("#setBreak").html(breakMinUpdated);
    initialize.breakTimeUpdate(breakMinUpdated);
  });
  $("#subtractBreak").click(function() {
    if (parseInt($("#setBreak").html()) > 1) {
      breakMinUpdated = parseInt($("#setBreak").html()) - 1;
      $("#setBreak").html(breakMinUpdated);
      initialize.breakTimeUpdate(breakMinUpdated);
    }
  });
});