import React, { useState, useEffect } from "react";

function CountdownTimer({ duration, onStop }) {
  const [remainingTime, setRemainingTime] = useState(duration);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const endTime = Date.now() + remainingTime * 1000;
    const id = setInterval(() => {
      const now = Date.now();
      const timeDifference = endTime - now;

      if (timeDifference > 0) {
        const hours = Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        setRemainingTime({ hours, minutes, seconds });
      } else {
        clearInterval(id);
        setRemainingTime(null);
        onStop(); // Call the onStop function when the timer ends
      }
    }, 1000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, [remainingTime, onStop]);

  const stopTimer = () => {
    clearInterval(intervalId);
    setRemainingTime(null);
    onStop(); // Call the onStop function when the timer is stopped manually
  };

  return (
    <div>
      {remainingTime ? (
        <div>
          <h2>Auction Countdown Timer</h2>
          <p>
            Time Remaining: {remainingTime.hours} hours, {remainingTime.minutes}{" "}
            minutes, {remainingTime.seconds} seconds
          </p>
          <button onClick={stopTimer}>Stop Auction</button>
        </div>
      ) : (
        <p>Auction has ended!</p>
      )}
    </div>
  );
}

export default CountdownTimer;
