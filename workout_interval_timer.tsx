import { useEffect, useRef } from "react"
import type { ButtonProperties, NumberInputProperties, RangeInputProperties, SingleSettingProperties } from "./workout_interval_timer.types"
import './wit.css';
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

function Null() {}



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


export const WorkoutIntervalTimer = () => {
    const INTERVAL = new Interval()

    const dialog = useRef<HTMLDialogElement>(null);
    const time = useRef<HTMLInputElement>(null);
    const round = useRef<HTMLInputElement>(null);
    const roundIdentifier = useRef<HTMLInputElement>(null);

    const work_lengthDiv = useRef<HTMLInputElement>(null);
    const work_length_numDiv = useRef<HTMLInputElement>(null);
    const pause_lengthDiv = useRef<HTMLInputElement>(null);
    const roundsDiv = useRef<HTMLInputElement>(null);
    const rounds_numDiv = useRef<HTMLInputElement>(null);
    const pause_length_numDiv = useRef<HTMLInputElement>(null);
    const warmupDiv = useRef<HTMLInputElement>(null);
    const soundDiv = useRef<HTMLInputElement>(null);
    
    const beep = useRef(new Audio('https://www.myinstants.com/media/sounds/3-2-1-countdown.mp3'));
    function SetRanges(){
        if (work_lengthDiv.current && work_length_numDiv.current) {
            work_lengthDiv.current.value = work_length_numDiv.current.value;
        }
        if (pause_lengthDiv.current && pause_length_numDiv.current) {
            pause_lengthDiv.current.value = pause_length_numDiv.current.value;
        }
        if (roundsDiv.current && rounds_numDiv.current) {
            roundsDiv.current.value = rounds_numDiv.current.value;
        }
        
        

    }
    function SetLabels() {
        if (work_lengthDiv.current && work_length_numDiv.current) {
            work_length_numDiv.current.value = work_lengthDiv.current.value;
        }
        if (pause_lengthDiv.current && pause_length_numDiv.current) {
            pause_length_numDiv.current.value = pause_lengthDiv.current.value;
        }
        if (roundsDiv.current && rounds_numDiv.current) {
            rounds_numDiv.current.value = roundsDiv.current.value;
        }
        
        
        
    }
    function StartTimer() {
        console.log('Start')
        dialog.current?.showModal();
        
        time.current?.classList.remove('finished');
        INTERVAL.countedRounds = 0;
        INTERVAL.roundStartTime = Date.now();
        INTERVAL.timerIsRunning = true;
        INTERVAL.roundIdentifier = 0;
        INTERVAL.rounds = parseInt(roundsDiv.current?.value || "0");
        INTERVAL.soundActive = soundDiv.current?.checked || false;

        INTERVAL.workTime = parseInt(work_lengthDiv.current?.value || "0");
        INTERVAL.pauseTime = parseInt(pause_lengthDiv.current?.value || "0");
    }

    function StopTimer() {
        INTERVAL.timerIsRunning = false;
        dialog.current?.close();
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
            let seconds_0 = mins < 10 ? `0${secs}` : `${secs}`;

            if (!time.current || !roundIdentifier.current || !round.current) {return}

            time.current.innerText = `${minutes_0}:${seconds_0}.${ns}`
            roundIdentifier.current.innerText = `${INTERVAL.roundIdentifier ? "Pause" : "Work"}`;
            round.current.innerText = `Runde: ${INTERVAL.countedRounds + 1} / ${INTERVAL.rounds}`;
            
            

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

                    time.current.innerText = 'Workout finished!'
                    time.current.className = 'finished';
                    INTERVAL.beeped = false;
                    return;
                }
        }, 10);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        setInterval(() => {
            console.log(INTERVAL.soundActive, INTERVAL.timerIsRunning, INTERVAL.beeped)
            /* 
            if (!INTERVAL.soundActive) {
                return;
            }
            */
            if (!INTERVAL.timerIsRunning) {
                return;
            }
            if (!INTERVAL.beeped) {
                return;
            }
            
            const ntime = Date.now() - INTERVAL.roundStartTime;
            let ms = Math.floor(ntime) - 500;
            
            console.log(INTERVAL.pauseTime, INTERVAL.workTime)
            if (INTERVAL.roundIdentifier == 0 && ms + (beep.current.duration * 1000) > INTERVAL.workTime * 1000) {
                beep.current.play()
            }
            if (INTERVAL.roundIdentifier == 1 && ms + (beep.current.duration * 1000) > INTERVAL.pauseTime * 1000) {
                beep.current.play()
            }
            
            console.log(beep.current.paused)
            INTERVAL.beeped = true;
        }, 10)

        return () => clearInterval(interval);
    }, [INTERVAL]);

    return (
        <>
        <div id="settings">
            <div><h1>Workout Interval Timer</h1></div>
            <div><h3>&copy; 2026 - Justus Decker - Written in HTML, CSS & JS </h3></div>
            <SingleSetting title={"Work"} ref={work_lengthDiv} ref_num={work_length_numDiv} min={20} max={60} onInput={SetRanges} onMouseMove={SetLabels}/>
            <SingleSetting title={"Pause"} ref={pause_lengthDiv} ref_num={pause_length_numDiv} min={20} max={60} onInput={SetRanges} onMouseMove={SetLabels}/>
            <SingleSetting title={"Runden"} ref={roundsDiv} ref_num={rounds_numDiv} min={1} max={60} onInput={SetRanges} onMouseMove={SetLabels}/>
            <div>
                <input className="WITPageCheckbox" type="checkbox" ref={soundDiv} id="sound_active" name="sound_active" onClick={Null}/>
                Aktuell keine Funktion
            </div>
            <div>
                <input className="WITPageCheckbox" type="checkbox" ref={warmupDiv} id="warmup_active" name="warmup_active" onClick={Null}/>
                Aktuell keine Funktion
            </div>

            <div className="WITPage-start-and-share-div">
                <Button onClick={() => StartTimer()}>START</Button>
                <Button>TEILEN</Button>
            </div>
        </div>

        <div className="WITPage-timer">
            <div ref={roundIdentifier} id="roundIdentifier" style={{fontSize: "12em", textAlign: "center"}}>Work</div>
            <div ref={time} id="WITPage-time">null</div>
            <div ref={round} id="WITPage-round">0</div>
            <div className="WITPage-dialog-btn-rearrange">
                <Button style={{backgroundColor: "#cfd66e"}}>PAUSE</Button>
                <Button style={{backgroundColor: "#83d66e"}}>Rundenneustart</Button>
                <Button style={{backgroundColor: "#d66e6e"}} onClick={StopTimer}>STOP</Button>
            </div>
        </div>


        </>
    )
}