import { initControl } from "./control.js";
import { state } from "./state.js";

const initPomodoro = () => {
    initControl();

    state.activeTodo = {
        id: 'default',
        pomodoro: 3,
        title: 'title',
    }
}

initPomodoro();