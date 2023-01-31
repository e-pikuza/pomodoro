import { alarm } from "./alarm.js";
import { state } from "./state.js";

const minutesElem = document.querySelector('.time__minutes ');
const secondsElem = document.querySelector('.time__seconds ');

const format = (n) => n < 10 ? ('0' + n) : n;

const showTime = (seconds) => {
    minutesElem.textContent = format(Math.floor(seconds / 60));
    secondsElem.textContent = format(seconds % 60);
}

export const startTimer = () => {
    state.timrLeft -= 1;

    showTime(state.timrLeft);

    if (state.timrLeft > 0 && state.isActive) {
        state.timerId = setTimeout(startTimer, 1000);
    }

    if (state.timrLeft <= 0) {
        alarm();
    }
};