$("#help_icon").click(function () {
  alert("help icon is clicked");
});

$("#settings_icon").click(function () {
  alert("settings icon is clicked");
});

const ring_counts = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

$(function () {
  for (let x of ring_counts) {
    $("#ring_" + x).draggable({ cursor: "pointer" });
  }
});

var ring = "drag";
let pillar_arrays = { pillar_one: [], pillar_two: [], pillar_three: [] };
const pillar_names = ["pillar_one", "pillar_two", "pillar_three"];
function randompositions() {
  for (let i = 0; i < 9; i++) {
    var randomindex = Math.floor(Math.random() * 3);
    pillar_arrays[`${pillar_names[randomindex]}`].push(i + 1);
    var temp_ring = "drag" + (i + 1);
    var targetDiv = $(`#${pillar_names[randomindex]}`);
    var content = $(`#${temp_ring}`);
    targetDiv.append(content);
  }
}
randompositions();

var ringname;
var pillarfromselected;
function checkifmoveable(event) {
  ringname = event.currentTarget.id;
  pillarfromselected = event.target.parentNode.id;
  var lastvalueindex = pillar_arrays[`${pillarfromselected}`].length - 1;
  var lastvalue = pillar_arrays[`${pillarfromselected}`][lastvalueindex];
  if (document.getElementById(`${ringname}`).innerHTML == lastvalue) {
    $(`#${ringname}`).attr("draggable", "true");
  } else {
    $(`#${ringname}`).attr("draggable", "false");
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

var moves = 0,
  moves_left = 50;

$(document).ready(() => {
  $("#moves_left").html(50);
});

function noAllowDrop(ev) {
  ev.stopPropagation();
}

function checkwinningstate(arraytocheck) {
  for (var i = 0; i < arraytocheck.length - 1; i++) {
    if (arraytocheck[i] > arraytocheck[i + 1]) {
      continue;
    } else {
      return false;
    }
  }
  return true;
}

function undobuttondisable() {
  if (undo_arrof_objects.length == 0) {
    $("#undo").prop("disabled", true);
  } else {
    $("#undo").prop("disabled", false);
  }
}
function redobuttonondisable() {
  if (redo_arrof_objects.length == 0) {
    $("#redo").prop("disabled", true);
  } else {
    $("#redo").prop("disabled", false);
  }
}

$(document).ready(() => {
  undobuttondisable();
});

$(document).ready(() => {
  redobuttonondisable();
});

var undo_arrof_objects = [];
var redo_arrof_objects = [];
var pillartodropon;

function drop(ev) {
  if (moves_left > 0) {
    ev.preventDefault();
    var ring_name = ev.dataTransfer.getData("text");
    pillartodropon = ev.target.id;
    debugger;
    if (pillarfromselected !== pillartodropon) {
      ev.target.appendChild(document.getElementById(ring_name));
      var popedvalue = pillar_arrays[`${pillarfromselected}`].pop();
      pillar_arrays[`${pillartodropon}`].push(popedvalue);
      var arraycheck = pillar_arrays[`${pillartodropon}`];

      $("#moves_performed").text(++moves);
      $("#moves_left").text(--moves_left);
      undo_arrof_objects.push({
        previouspillarname: pillarfromselected,
        inobjring_name: ring_name,
        nextpillarname: pillartodropon,
      });
      redo_arrof_objects = [];
      if (pillar_arrays[`${pillartodropon}`].length == 9) {
        if (checkwinningstate(arraycheck)) {
          setTimeout(() => {
            alert("won");
            setTimeout(() => {
              location.reload();
            }, 1000);
          }, 10);
        }
      }
      undobuttondisable();
      redobuttonondisable();
    }
  }
}

$("#undo").click(function () {
  if (undo_arrof_objects.length >= 1) {
    var temp_obj = undo_arrof_objects.pop();
    var targetDiv = $(`#${temp_obj.previouspillarname}`);
    var content = $(`#${temp_obj.inobjring_name}`);
    targetDiv.append(content);
    var popedvalue = pillar_arrays[`${temp_obj.nextpillarname}`].pop();
    pillar_arrays[`${temp_obj.previouspillarname}`].push(popedvalue);
    $("#moves_performed").text(--moves);
    $("#moves_left").text(++moves_left);
    redo_arrof_objects.push(temp_obj);
  }

  if (pillar_arrays[`${temp_obj.previouspillarname}`].length == 9) {
    if (checkwinningstate(pillar_arrays[`${temp_obj.previouspillarname}`])) {
      setTimeout(() => {
        alert("won");
        setTimeout(() => {
          location.reload();
        }, 1000);
      }, 10);
    }
  }
  undobuttondisable();
  redobuttonondisable();
});

$("#redo").click(async function () {
  if (redo_arrof_objects.length >= 1) {
    $("#moves_performed").text(++moves);
    $("#moves_left").text(--moves_left);

    var temp_obj = redo_arrof_objects.pop();
    var targetDiv = $(`#${temp_obj.nextpillarname}`);
    var content = $(`#${temp_obj.inobjring_name}`);
    targetDiv.append(content);
    var popedvalue = pillar_arrays[`${temp_obj.previouspillarname}`].pop();
    pillar_arrays[`${temp_obj.nextpillarname}`].push(popedvalue);
    undo_arrof_objects.push(temp_obj);

    if (pillar_arrays[`${temp_obj.nextpillarname}`].length == 9) {
      if (checkwinningstate(pillar_arrays[`${temp_obj.nextpillarname}`])) {
        setTimeout(() => {
          alert("won");
          setTimeout(() => {
            location.reload();
          }, 1000);
        }, 10);
      }
    }
  }
  if (redo_arrof_objects.length == 0) {
    redo_arrof_objects = [];
  }
  undobuttondisable();
  redobuttonondisable();
});

$("#reset").click(() => {
  setTimeout(() => {
    location.reload();
  });
});

var seconds = 0,
  minute = 0;

function getNextTime() {
  seconds++;
  if (seconds > 59) {
    seconds = 0;
    minute++;
  }
}

$(document).ready(function timer() {
  setInterval(function () {
    getNextTime();
    $("#Time_taken").text(`${minute}m ${seconds}s`);
  }, 1000);
});
