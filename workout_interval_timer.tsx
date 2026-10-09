import { useEffect, useRef } from "react"
import type { ButtonProperties, NumberInputProperties, RangeInputProperties, SingleSettingProperties } from "./workout_interval_timer.types"

function NumberInput({ref, min, max, onInput}: NumberInputProperties) {
    return (
        <input type="number" className="WITPageNumberInput" ref={ref} min={min} max={max} onInput={onInput}/>
    )
}

function RangeInput({ref, min, max, onMouseMove}: RangeInputProperties) {
    return (
        <input type="range" className="WITPageRangeInput" ref={ref} min={min} max={max} onMouseMove={onMouseMove}/>
    )
}

function Button({children, onClick, style} : ButtonProperties) {
    return (
         <a className="WITPageButton" onClick={onClick} style={style}>{children}</a>
    )
}

function SingleSetting({title, ref_num, ref, min, max, onInput, onMouseMove} : SingleSettingProperties) {
    // label unten
    return (
        <div className="WITPage-combined-single-setting">
            <h3>{title}</h3>
            <NumberInput ref={ref_num} min={min} max={max} onInput={onInput}/>
            <RangeInput ref={ref} min={min} max={max} onMouseMove={onMouseMove}/> 
            
        </div>
    )
}



let beep = new Audio('https://www.myinstants.com/media/sounds/3-2-1-countdown.mp3');
beep.addEventListener('loadedmetadata', () => {
    console.log(beep.duration * 1000); // Gibt die korrekte Länge in ms aus
});

const dialog = document.getElementById('timer-dialog') as HTMLDialogElement;

class Interval {
    timerIsRunning: boolean;
    roundIdentifier: number;
    roundStartTime: number;
    workTime: number;
    pauseTime: number;
    rounds: number;
    countedRounds: number;
    beeped: boolean;
    soundActive: boolean;

    pause: boolean;
    warmup: false;
    constructor() {
        
        this.timerIsRunning = false;
        this.roundIdentifier = -1;
        this.roundStartTime = 0;

        this.workTime = 0;
        this.pauseTime = 0;
        this.rounds = 0;
        this.warmup = false;
        this.countedRounds = 0;
        this.beeped = false;
        this.soundActive = false;
        this.pause = false;
    }
}

const INTERVAL = new Interval()

const time = document.getElementById('WITPage-time')!;
const round = document.getElementById('WITPage-round')!;
const roundIdentifier = document.getElementById('WITPage-roundIdentifier')!;
class WorkoutTimerInterval {
    constructor() {
        
    }
    SetWarmup() {
        const warmupDiv = useRef<HTMLInputElement>(null);
        console.log(warmupDiv.checked);
    }
    SetSound() {
        const soundDiv = useRef<HTMLInputElement>(null);
        console.log(soundDiv.checked);
    }
    SetRange() {
        const work_lengthDiv = useRef<HTMLInputElement>(null);
        const work_length_numDiv = useRef<HTMLInputElement>(null);
        const pause_lengthDiv = useRef<HTMLInputElement>(null);
        const roundsDiv = useRef<HTMLInputElement>(null);
        const rounds_numDiv = useRef<HTMLInputElement>(null);

        work_lengthDiv.value = work_length_numDiv.value;
        pause_lengthDiv.value = pause_length_numDiv.value;
        roundsDiv.value = rounds_numDiv.value;
    }
    SetLabels() {
        const work_lengthDiv = useRef<HTMLInputElement>(null);
        const pause_lengthDiv = useRef<HTMLInputElement>(null);
        const pause_length_numDiv = useRef<HTMLInputElement>(null);
        const roundsDiv = useRef<HTMLInputElement>(null);
        const rounds_numDiv = useRef<HTMLInputElement>(null);
        const work_length_numDiv = useRef<HTMLInputElement>(null);
        

        work_length_numDiv.value = work_lengthDiv.value;
        pause_length_numDiv.value = pause_lengthDiv.value;
        rounds_numDiv.value = roundsDiv.value;
    }
    StartTimer() {
        const work_lengthDiv = useRef<HTMLInputElement>(null);
        const pause_lengthDiv = useRef<HTMLInputElement>(null);
        const roundsDiv = useRef<HTMLInputElement>(null);
        const soundDiv = useRef<HTMLInputElement>(null);

        console.log('Start')
        dialog.showModal();
        
        time.classList.remove('finished');
        INTERVAL.countedRounds = 0;
        INTERVAL.roundStartTime = Date.now();
        INTERVAL.timerIsRunning = true;
        INTERVAL.roundIdentifier = 0;
        INTERVAL.rounds = parseInt(roundsDiv.value);
        INTERVAL.soundActive = soundDiv.checked;

        INTERVAL.workTime = parseInt(work_lengthDiv.value);
        INTERVAL.pauseTime = parseInt(pause_lengthDiv.value);
    }
    StopTimer() {
        dialog.close();
        INTERVAL.timerIsRunning = false;
    }
    intervalTimer() {
        
        if (!INTERVAL.timerIsRunning) {
            return;
        }
        
        const ntime = Date.now() - INTERVAL.roundStartTime;


        let mins = Math.floor(ntime / 1000 / 60);
        let secs = Math.floor(ntime / 1000 % 60);
        const secss = secs;
        let ns = Math.floor(ntime % 1000 / 100);
        let minutes_0 = mins < 10 ? `0${mins}` : `${mins}`;
        let seconds_0 = mins < 10 ? `0${mins}` : `${mins}`;

        time.innerText = `${minutes_0}:${seconds_0}.${ns}`
        roundIdentifier.innerText = `${INTERVAL.roundIdentifier ? "Pause" : "Work"}`;
        round.innerText = `Runde: ${INTERVAL.countedRounds + 1} / ${INTERVAL.rounds}`;
        
        

        if (INTERVAL.roundIdentifier == 0 && secss >= INTERVAL.workTime){
            console.log('Work finished -> Pause!');
            INTERVAL.roundIdentifier = 1;
            INTERVAL.roundStartTime = Date.now();
            INTERVAL.beeped = false;
            
            
        } else if (INTERVAL.roundIdentifier == 1 && secss >= INTERVAL.pauseTime){
            console.log('Pause finished -> Work!');
            INTERVAL.roundIdentifier = 0;
            INTERVAL.countedRounds++;
            INTERVAL.roundStartTime = Date.now();
            INTERVAL.beeped = false;
        }

        if (INTERVAL.countedRounds >= INTERVAL.rounds) {
                INTERVAL.timerIsRunning = false;

                time.innerText = 'Workout finished!'
                time.className = 'finished';
                INTERVAL.beeped = false;
                return;
            }
        
    }
    intervalTimerBeep() {
        if (!INTERVAL.soundActive) {
            return;
        }
        if (!INTERVAL.timerIsRunning) {
            return;
        }
        if (INTERVAL.beeped) {
            return;
        }
        const ntime = Date.now() - INTERVAL.roundStartTime;
        let ms = Math.floor(ntime) - 500;

        console.log(INTERVAL.pauseTime, INTERVAL.workTime)
        if (INTERVAL.roundIdentifier == 0 && ms + (beep.duration * 1000) > INTERVAL.workTime * 1000) {
            beep.play()
        }
        if (INTERVAL.roundIdentifier == 1 && ms + (beep.duration * 1000) > INTERVAL.pauseTime * 1000) {
            beep.play()
        }
        INTERVAL.beeped = true;
    }
    
}

const WIT = new WorkoutTimerInterval()
setInterval(WIT.intervalTimer, 10)
setInterval(WIT.intervalTimerBeep, 10)


export const WorkoutIntervalTimer = () => {
    const INTERVAL = new Interval()

    const time = document.getElementById('WITPage-time')!;
    const round = document.getElementById('WITPage-round')!;
    const roundIdentifier = document.getElementById('WITPage-roundIdentifier')!;

    const work_lengthDiv = useRef<HTMLInputElement>(null);
    const work_length_numDiv = useRef<HTMLInputElement>(null);
    const pause_lengthDiv = useRef<HTMLInputElement>(null);
    const roundsDiv = useRef<HTMLInputElement>(null);
    const rounds_numDiv = useRef<HTMLInputElement>(null);
    const pause_length_numDiv = useRef<HTMLInputElement>(null);
    const warmupDiv = useRef<HTMLInputElement>(null);
    const soundDiv = useRef<HTMLInputElement>(null);
    

    function SetRanges(){
        work_lengthDiv.value = work_length_numDiv.value;
        pause_lengthDiv.value = pause_length_numDiv.value;
        roundsDiv.value = rounds_numDiv.value;
    }
    function SetLabels() {
        work_length_numDiv.value = work_lengthDiv.value;
        pause_length_numDiv.value = pause_lengthDiv.value;
        rounds_numDiv.value = roundsDiv.value;
    }
    function StartTimer() {
        console.log('Start')
        dialog.showModal();
        
        time.classList.remove('finished');
        INTERVAL.countedRounds = 0;
        INTERVAL.roundStartTime = Date.now();
        INTERVAL.timerIsRunning = true;
        INTERVAL.roundIdentifier = 0;
        INTERVAL.rounds = parseInt(roundsDiv.value);
        INTERVAL.soundActive = soundDiv.checked;

        INTERVAL.workTime = parseInt(work_lengthDiv.value);
        INTERVAL.pauseTime = parseInt(pause_lengthDiv.value);
    }
    function StopTimer() {
        INTERVAL.timerIsRunning = false;
    }

    useEffect(() => {
        let interval: NodeJS.Timeout;
        setInterval(() => {
            if (!INTERVAL.timerIsRunning) {
                return;
            }
            
            const ntime = Date.now() - INTERVAL.roundStartTime;


            let mins = Math.floor(ntime / 1000 / 60);
            let secs = Math.floor(ntime / 1000 % 60);
            const secss = secs;
            let ns = Math.floor(ntime % 1000 / 100);
            let minutes_0 = mins < 10 ? `0${mins}` : `${mins}`;
            let seconds_0 = mins < 10 ? `0${mins}` : `${mins}`;

            time.innerText = `${minutes_0}:${seconds_0}.${ns}`
            roundIdentifier.innerText = `${INTERVAL.roundIdentifier ? "Pause" : "Work"}`;
            round.innerText = `Runde: ${INTERVAL.countedRounds + 1} / ${INTERVAL.rounds}`;
            
            

            if (INTERVAL.roundIdentifier == 0 && secss >= INTERVAL.workTime){
                console.log('Work finished -> Pause!');
                INTERVAL.roundIdentifier = 1;
                INTERVAL.roundStartTime = Date.now();
                INTERVAL.beeped = false;
                
                
            } else if (INTERVAL.roundIdentifier == 1 && secss >= INTERVAL.pauseTime){
                console.log('Pause finished -> Work!');
                INTERVAL.roundIdentifier = 0;
                INTERVAL.countedRounds++;
                INTERVAL.roundStartTime = Date.now();
                INTERVAL.beeped = false;
            }

            if (INTERVAL.countedRounds >= INTERVAL.rounds) {
                    INTERVAL.timerIsRunning = false;

                    time.innerText = 'Workout finished!'
                    time.className = 'finished';
                    INTERVAL.beeped = false;
                    return;
                }
        }, 10);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        setInterval(() => {
            
            if (!INTERVAL.soundActive) {
                return;
            }
            if (!INTERVAL.timerIsRunning) {
                return;
            }
            if (INTERVAL.beeped) {
                return;
            }
            const ntime = Date.now() - INTERVAL.roundStartTime;
            let ms = Math.floor(ntime) - 500;

            console.log(INTERVAL.pauseTime, INTERVAL.workTime)
            if (INTERVAL.roundIdentifier == 0 && ms + (beep.duration * 1000) > INTERVAL.workTime * 1000) {
                beep.play()
            }
            if (INTERVAL.roundIdentifier == 1 && ms + (beep.duration * 1000) > INTERVAL.pauseTime * 1000) {
                beep.play()
            }
            INTERVAL.beeped = true;
        }, 10)

        return () => clearInterval(interval);
    }, [INTERVAL]);

    return (
        <>
        <div id="settings">
            <div><h1>Workout Interval Timer</h1></div>
            <div><h3>&copy; 2026 - Justus Decker - Written in HTML, CSS & JS </h3></div>
            <SingleSetting title={"Work"} ref={work_lengthDiv} ref_num={work_length_numDiv} min={20} max={60} onInput={() => SetRanges()} onMouseMove={() => SetLabels()}/>
            <SingleSetting title={"Pause"} ref={pause_lengthDiv} ref_num={pause_length_numDiv} min={20} max={60} onInput={() => SetRanges()} onMouseMove={() => SetLabels()}/>
            <SingleSetting title={"Runden"} ref={roundsDiv} ref_num={rounds_numDiv} min={1} max={60} onInput={() => SetRanges()} onMouseMove={() => SetLabels()}/>
            <div>
                <input type="checkbox" ref={soundDiv} id="sound_active" name="sound_active" onClick={() => WIT.SetSound()}/>
                Aktuell keine Funktion
            </div>
            <div>
                <input type="checkbox" ref={warmupDiv} id="warmup_active" name="warmup_active" onClick={() => WIT.SetWarmup()}/>
                Aktuell keine Funktion
            </div>

            <div className="WITPage-start-and-share-div">
                <Button onClick={() => StartTimer()}>START</Button>
                <Button>TEILEN</Button>
            </div>
        </div>
        <dialog id="WITPage-timer-dialog">
            <div className="WITPage-timer">
                <div id="roundIdentifier" style={{fontSize: "12em", textAlign: "center"}}>Work</div>
                <div id="WITPage-time">null</div>
                <div id="WITPage-round">0</div>
                <div className="WITPage-dialog-btn-rearrange">
                    <Button style={{backgroundColor: "#cfd66e"}}>PAUSE</Button>
                    <Button style={{backgroundColor: "#83d66e"}}>Rundenneustart</Button>
                    <Button style={{backgroundColor: "#d66e6e"}} onClick={() => WIT.StopTimer()}>STOP</Button>
                </div>
            </div>
        </dialog>

        </>
    )
}