let beep = new Audio('https://www.myinstants.com/media/sounds/3-2-1-countdown.mp3');
beep.addEventListener('loadedmetadata', () => {
    console.log(beep.duration * 1000); // Gibt die korrekte Länge in ms aus
});

const dialog = document.getElementById('timer-dialog');

class Interval {
    constructor() {
        this.timerIsRunning = false;

        this.roundTitle = '';
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
class WorkoutTimerInterval {
    constructor() {


        this.work_lengthDiv = document.getElementById('work_length');
        this.work_length_numDiv = document.getElementById('work_length_num');
        this.pause_lengthDiv = document.getElementById('pause_length');
        this.pause_length_numDiv = document.getElementById('pause_length_num');
        this.roundsDiv = document.getElementById('rounds');
        this.rounds_numDiv = document.getElementById('rounds_num');
        this.warmupDiv = document.getElementById('warmup_active');
        this.soundDiv = document.getElementById('sound_active');

        this.roundStartTime = 0;
        this.roundTitle = '';
        this.timerIsRunning = false;

    }
    SetWarmup() {
        console.log(this.warmupDiv.checked);
    }
    SetSound() {
        console.log(this.soundDiv.checked);
    }
    SetRange() {
        this.work_lengthDiv.value = this.work_length_numDiv.value;
        this.pause_lengthDiv.value = this.pause_length_numDiv.value;
        this.roundsDiv.value = this.rounds_numDiv.value;
    }
    SetLabels() {
        this.work_length_numDiv.value = this.work_lengthDiv.value;
        this.pause_length_numDiv.value = this.pause_lengthDiv.value;
        this.rounds_numDiv.value = this.roundsDiv.value;
    }
    StartTimer() {
        console.log('Start')
        dialog.showModal();
        const time = document.getElementById('time');
        time.classList.remove('finished');
        INTERVAL.countedRounds = 0;
        INTERVAL.roundStartTime = Date.now();
        INTERVAL.timerIsRunning = true;
        INTERVAL.roundIdentifier = 0;
        INTERVAL.rounds = this.roundsDiv.value;
        INTERVAL.soundActive = this.soundDiv.checked;

        INTERVAL.workTime = this.work_lengthDiv.value;
        INTERVAL.pauseTime = this.pause_lengthDiv.value;
    }
    StopTimer() {
        dialog.close();
        INTERVAL.timerIsRunning = false;
    }
    intervalTimer() {
        
        if (!INTERVAL.timerIsRunning) {
            return;
        }
        const time = document.getElementById('time');
        const round = document.getElementById('round');
        const roundIdentifier = document.getElementById('roundIdentifier');
        const ntime = Date.now() - INTERVAL.roundStartTime;


        let mins = Math.floor(ntime / 1000 / 60);
        let secs = Math.floor(ntime / 1000 % 60);
        const secss = secs;
        let ns = Math.floor(ntime % 1000 / 100);

        if (secs < 10) {
            secs = `0${secs}`
        }
        if (mins < 10) {
            mins = `0${mins}`
        }

        time.innerText = `${mins}:${secs}.${ns}`
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
WIT.SetLabels()