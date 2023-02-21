// *********************** VARIABLE AND OBJECT DECLARATIONS *************************** //

console.log(Notification.permission);

// timer variable with the following properties
const timer = {
    pomodoro: 45, 
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 2
};

let interval;

// adding sound effects
const buttonSound = new Audio('button-sound.mp3');

// start/stop button
const mainButton = document.getElementById('js-btn');

mainButton.addEventListener('click', () => {
    // buttonSound.play();
    const { action } = mainButton.dataset;
    
    if(action === 'start'){
        startTimer();
    }
    else{
        stopTimer();
    }
});

// mode buttons
const modeButtons = document.querySelector('#js-mode-buttons'); // gets the group of mode buttons
modeButtons.addEventListener('click', handleMode); // calls function handleMode when a button is clicked

document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro');
});

const restartButton = document.querySelector('#restart-button');
restartButton.addEventListener('click', clearInterval(interval));

// *********************** FUNCTIONS *************************** //

function getRemainingTime(endTime){
    const currentTime = Date.parse(new Date());

    // get the number of milliseconds left
    const difference = endTime - currentTime;
    // get the number of seconds left
    const total = Number.parseInt(difference / 1000, 10); // Number.parseInt parses a string arg and returns an integer of the specified base

    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60);

    return{
        total,
        minutes, 
        seconds,
    };
}

function startTimer(){
    let { total } = timer.remainingTime;

    // Date.parse(new Date()) is the current moment in milliseconds, which we add to the remaining time
    const endTime = Date.parse(new Date()) + total * 1000;

    // once the timer starts, the value of the data-action attribute and its text content changes to "stop"
    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    // mainButton.classList.add('active');

    // get the remaining time and update the clock every 1 second
    interval = setInterval(function(){
        timer.remainingTime = getRemainingTime(endTime);
        updateClock();

        total = timer.remainingTime.total;

        if(total <= 0){
            clearInterval(interval);
        }
    }, 1000);
}

function stopTimer(){
    clearInterval(interval);

    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active');
}

function updateClock(){
    // this is equivalent to writing const remainingTime = timer.remainingTime;
    const { remainingTime } = timer;

    // pad the remaining seconds with zeroes so that the number always has a width of 2 (eg: 8 becomes 08)
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');

    // update the value displayed
    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    min.textContent = minutes;
    sec.textContent = seconds;

    // const text = timer.mode === 'pomodoro' ? 'Get back to work!' : 
    document.title = `${minutes}:${seconds} | Pomodoro Timer`;

    // set the value of the progress bar to be the total time - remaining time
    const progress = document.getElementById('js-progress');
    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
    // the UI is updated with webkit-progress-bar in the stylesheet
}

function switchMode(mode){
    // adding new properties to the timer object
    timer.mode = mode; // sets the current mode, which could be pomodoro, shortBreak, or longBreak

    timer.remainingTime = {
        total: timer[mode] * 60, // total seconds remaining, initialized to the number of minutes of the current mode multiplied by 60
        minutes: timer[mode],
        seconds: 0
    };

    // remove active class from all buttons with attribute "data-mode"
    document
        .querySelectorAll('button[data-mode]')
        .forEach(e => e.classList.remove('active'));
    
    // add active class to the button that was clicked
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor = `var(--${mode})`;

    // progress bar
    document
        .getElementById('js-progress')
        .setAttribute('max', timer.remainingTime.total);

    updateClock();
}

// calls switchMode() when a mode button is clicked
function handleMode(event){
    // event.target is the button that was clicked
    // dataset gets the value of the attribute "data-mode" of the object that was clicked
    const { mode } = event.target.dataset; 

    if (!mode){ // if what was clicked is not one of the buttons
        return;
    } 
    
    // if one of the buttons was clicked, we switch the mode
    switchMode(mode); 

    // stop the timer after the mode is switched
    stopTimer();
}




















