// *********************** VARIABLE DECLARATIONS AND EVENT HANDLING *************************** //

// TIMER VARIABLE
// properties for different modes of the timer
const timer = {
	pomodoro: 45,
	shortBreak: 5,
	longBreak: 15,
};


// START/STOP BUTTON
// assigns mainButton with a reference to the HTML element with id 'js-btn'
const mainButton = document.getElementById("js-btn");

mainButton.addEventListener("click", () => {
	// buttonSound.play();

	const { action } = mainButton.dataset;

	if (action === "start") {
		startTimer();
	} else {
		stopTimer();
	}
});


// MODE BUTTONS
const modeButtons = document.querySelector("#js-mode-buttons"); // gets the group of mode buttons
modeButtons.addEventListener("click", handleMode); // calls function handleMode when a button is clicked

document.addEventListener("DOMContentLoaded", () => {
	switchMode("pomodoro");
});


// RESTART BUTTON
const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
	switchMode(timer.mode);
	stopTimer();
});

// SETTINGS BUTTON AND MODAL
// bootstrap takes care of this

let interval;


// SOUND EFFECTS
// assigns buttonSound a new instance of the Audio object, a built-in object in javascript that represents an audio file
// const buttonSound = new Audio('button-sound.mp3');


// CHANGE COLOR
let newColor = "#000000";

// listen for any new colour input, and store the newest value
const colorInput = document.getElementById("color-input");

colorInput.addEventListener("input", () => {
	// store the newly selected colour, but don't change anything yet
	newColor = colorInput.value;
});

// only once the save button is clicked, change the background color to the previously saved newColor
const saveColor = document.getElementById("save-color-btn");

saveColor.addEventListener("click", () => {
	document.body.style.backgroundImage = "none";
	document.body.style.backgroundColor = newColor;
});


// CHANGE THEME
let newTheme = "Sunny Prairie"; // default
let newThemeId = "sunny-prairie";

// listen for any new theme input, and store the newest value
const dropdownItems = document.querySelectorAll("#theme-input .dropdown-item");
const themeButton = document.getElementById("theme-button");

// add event listener to each dropdown item
dropdownItems.forEach((item) => {
	item.addEventListener("click", function () {
		newTheme = item.textContent;
        newThemeId = item.getAttribute('id');
		themeButton.textContent = newTheme; // change the theme name that displays on the dropdown
        console.log(`theme name: ${newTheme}`);
        console.log(`theme id: ${newThemeId}`);
    });
});

// change the background colour once the save button is clicked
const saveTheme = document.getElementById('save-theme-btn');
saveTheme.addEventListener('click', () => {
    console.log(`'url("backgrounds/${newThemeId}.jpg")'`);
    document.body.style.backgroundImage = `url("backgrounds/${newThemeId}.jpg")`;
});



// *********************** TIMER FUNCTIONS *************************** //

function getRemainingTime(endTime) {
	const currentTime = Date.parse(new Date());

	// get the number of milliseconds left
	const difference = endTime - currentTime;
	// get the number of seconds left
	const total = Number.parseInt(difference / 1000, 10); // Number.parseInt parses a string arg and returns an integer of the specified base

	// we want to exclude completed hours from the minutes, and completed minutes from the seconds
	const minutes = Number.parseInt((total / 60) % 60, 10);
	const seconds = Number.parseInt(total % 60);

	return {
		total,
		minutes,
		seconds,
	};
}

// calls getRemainingTime and updates the clock every second
function startTimer() {
	let { total } = timer.remainingTime;

	// Date.parse(new Date()) is the current moment in milliseconds, which we add to the remaining time
	const endTime = Date.parse(new Date()) + total * 1000;

	// once the timer starts, the value of the data-action attribute and its text content changes to "stop"
	mainButton.dataset.action = "stop";
	mainButton.textContent = "stop";
	// mainButton.classList.add('active');

	// setInterval is a built in function that executes once every set interval
	// get the remaining time and update the clock every 1 second
	interval = setInterval(function () {
		timer.remainingTime = getRemainingTime(endTime);
		updateClock();

		total = timer.remainingTime.total;

		if (total <= 0) {
			clearInterval(interval);
		}
	}, 1000);
}

function stopTimer() {
	// clearInterval stops setInterval from running
	clearInterval(interval);

	mainButton.dataset.action = "start";
	mainButton.textContent = "start";
	mainButton.classList.remove("active");
}

// updates the value displayed on the clock to match the new mode

function updateClock() {
	// this is equivalent to writing const remainingTime = timer.remainingTime;
	const { remainingTime } = timer;

	// pad the remaining seconds with zeroes so that the number always has a width of 2 (eg: 8 becomes 08)
	const minutes = `${remainingTime.minutes}`.padStart(2, "0");
	const seconds = `${remainingTime.seconds}`.padStart(2, "0");

	// update the value displayed
	const minutes_value = document.getElementById("js-minutes");
	const seconds_value = document.getElementById("js-seconds");
	minutes_value.textContent = minutes;
	seconds_value.textContent = seconds;

	document.title = `${minutes}:${seconds} | Pomodoro Timer`;

	// set the value of the progress bar to be the total time - remaining time
	const progress = document.getElementById("js-progress");
	progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;

	// the UI is updated with webkit-progress-bar in the stylesheet
}

// sets the mode property of timer
// sets the active/inactive classes
// sets the progress bar
function switchMode(mode) {
	// adding new properties to the timer object
	timer.mode = mode; // sets the current mode, which could be pomodoro, shortBreak, or longBreak

	timer.remainingTime = {
		total: timer[mode] * 60, // total seconds remaining, initialized to the number of minutes of the current mode multiplied by 60
		minutes: timer[mode],
		seconds: 0,
	};

	// remove active class from all buttons with attribute "data-mode"
	document.querySelectorAll("button[data-mode]").forEach((e) => e.classList.remove("active"));

	// add active class to the button that was clicked
	// backticks: template literal
	// square brackets: select based on attribute
	document.querySelector(`[data-mode="${mode}"]`).classList.add("active");
	document.body.style.backgroundColor = `var(--${mode})`;

	// progress bar
	document.getElementById("js-progress").setAttribute("max", timer.remainingTime.total);

	updateClock();
}

// calls switchMode() when a mode button is clicked
function handleMode(event) {
	// event.target is the button that was clicked
	// gets the value of the "data-mode" attribute from the clicked element and stores it in a new variable "mode"
	const { mode } = event.target.dataset;

	// check if the mode was actually extracted from the button
	if (!mode) {
		return;
	}

	// if one of the buttons was clicked, we switch the mode
	switchMode(mode);

	// stop the timer after the mode is switched
	stopTimer();
}
