function MyApp() {
  const [sessionMinutes, setSessionMinutes] = React.useState(25);
  const [breakMinutes, setBreakMinutes] = React.useState(5);
  const [currentSessionTime, setCurrentSessionTime] = React.useState(25 * 60);
  const [currentBreakTime, setCurrentBreakTime] = React.useState(5 * 60);
  const [currentStatus, setCurrentStatus] = React.useState("session");
  const [timerOn, setTimerOn] = React.useState(false);

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    let clock =
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds);
    return clock.toString();
  };

  const increment = (title) => {
    if (title === "Session") {
      if (sessionMinutes == 60) {
        return;
      }
      setSessionMinutes((prev) => prev + 1);
      setCurrentSessionTime((sessionMinutes + 1) * 60);
    } else {
      if (breakMinutes == 60) {
        return;
      }
      setBreakMinutes((prev) => prev + 1);
      setCurrentBreakTime((breakMinutes + 1) * 60);
    }
  };

  const decrement = (title) => {
    if (title === "Session") {
      if (sessionMinutes === 1) {
        return;
      }
      setSessionMinutes((prev) => prev - 1);
      setCurrentSessionTime((sessionMinutes - 1) * 60);
    } else {
      if (breakMinutes === 1) {
        return;
      }
      setBreakMinutes((prev) => prev - 1);
      setCurrentBreakTime((breakMinutes - 1) * 60);
    }
  };

  const resetTimer = () => {
    setCurrentStatus("session");
    setSessionMinutes(25);
    setBreakMinutes(5);
    setCurrentSessionTime(25 * 60);
    setCurrentBreakTime(5 * 60);
    setTimerOn(false);
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  };

  const handleStartStop = () => {
    setTimerOn(!timerOn);
  };

  let z = false;

  const tick = () => {
    const audio = document.getElementById("beep");
    const audioNotificationToggle = document.getElementById(
      "audio-notification-toggle"
    );
    const audioEnabled = audioNotificationToggle.checked;
    if (currentStatus === "session") {
      if (currentSessionTime === 0) {
        setCurrentStatus("break");
        setCurrentSessionTime(sessionMinutes * 60);
        setCurrentBreakTime(breakMinutes * 60);
      } else if (currentSessionTime === 1) {
        setCurrentSessionTime((prev) => prev - 1);
        z = true;
      } else {
        setCurrentSessionTime((prev) => prev - 1);
      }
    } else {
      if (currentBreakTime === 0) {
        setCurrentStatus("session");
        setCurrentSessionTime(sessionMinutes * 60);
        setCurrentBreakTime(breakMinutes * 60);
        z = true;
      } else if (currentBreakTime === 1) {
        setCurrentBreakTime((prev) => prev - 1);
        z = true;
      } else {
        setCurrentBreakTime((prev) => prev - 1);
      }
    }
    if (z) {
      if (audioEnabled) {
        audio.play();
      }
      z = false;
    }
  };

  React.useEffect(() => {
    if (timerOn) {
      const intervalId = setInterval(() => tick(), 1000);
      return () => clearInterval(intervalId);
    }
  }, [timerOn, currentSessionTime, currentBreakTime]);

  return (
    <div id="host-layer" className="timer-container">
      <div id="timer-box">
        <div id="timer-title" className="timer-title">
          Pomodoro Clock
        </div>
        <div id="settings" className="settings-container">
          <Parameters
            title="Break"
            label="break-length"
            time={breakMinutes.toString()}
            idName="break-label"
            arrowUp="break-increment"
            arrowDown="break-decrement"
            increment={increment}
            decrement={decrement}
            onOff={timerOn}
          />
          <Parameters
            title="Session"
            label="session-length"
            time={sessionMinutes.toString()}
            idName="session-label"
            arrowUp="session-increment"
            arrowDown="session-decrement"
            increment={increment}
            decrement={decrement}
            onOff={timerOn}
          />
        </div>
        <div id="timer">
          <div id="timer-label">
            {currentStatus === "session" ? "Session" : "Break"}
          </div>
          <div id="time-left" className="timer-display">
            {currentStatus === "session"
              ? formatTime(currentSessionTime)
              : formatTime(currentBreakTime)}
          </div>
        </div>
        <div id="controls" className="controls-container">
          <button
            id="start_stop"
            onClick={handleStartStop}
            className="start-stop-button"
            style={{ backgroundColor: timerOn ? "#308abe" : "#30be64" }}
          >
            {timerOn ? "Stop" : "Start"}
          </button>
          <div id="audio-notification-control">
            <label
              for="audio-notification-toggle"
              className="audio-notification-label"
            >
              Audio
            </label>
            <input
              type="checkbox"
              id="audio-notification-toggle"
              className="audio-notification-toggle"
              defaultChecked={true}
            />
          </div>
          <button id="reset" onClick={resetTimer} className="reset-button">
            RESET
          </button>
        </div>
      </div>
      <audio id="beep" preload="auto" src="./Beep.mp3" />
    </div>
  );
}

function Parameters({
  title,
  label,
  time,
  idName,
  arrowUp,
  arrowDown,
  increment,
  decrement,
  onOff,
}) {
  return (
    <div className="settings-box">
      <div id={idName} className="settings-label">
        {title + " Length"}
      </div>
      <div className="settings-controls">
        <button
          disabled={onOff}
          id={arrowUp}
          onClick={() => increment(title)}
          className="increment"
        >
          <i className="material-icons">arrow_upward</i>
        </button>
        <div id={label}>{time}</div>
        <button
          disabled={onOff}
          id={arrowDown}
          onClick={() => decrement(title)}
          className="decrement"
        >
          <i className="material-icons">arrow_downward</i>
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<MyApp />, document.getElementById("root"));
