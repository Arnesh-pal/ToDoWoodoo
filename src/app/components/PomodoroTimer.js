"use client";
import { useState, useEffect } from "react";

export default function PomodoroTimer() {
    const [timeLeft, setTimeLeft] = useState(1500);
    const [timerRunning, setTimerRunning] = useState(false);
    const [selectedTime, setSelectedTime] = useState(1500);

    // Timer countdown logic
    useEffect(() => {
        if (!timerRunning) return;
        if (timeLeft <= 0) {
            setTimerRunning(false);
            // Optional: Add a notification sound here
            return;
        }
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timerRunning, timeLeft]);

    // Log focus time when the timer is paused or stops, but not on initial reset
    useEffect(() => {
        const logFocusTime = async () => {
            // Only log significant time chunks (e.g., more than 15 seconds)
            const durationInSeconds = selectedTime - timeLeft;
            if (durationInSeconds < 15) return;

            try {
                await fetch("/api/focus", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ duration: durationInSeconds }),
                });
            } catch (err) {
                console.error("Focus log error:", err);
            }
        };

        if (!timerRunning && selectedTime > timeLeft) {
            logFocusTime();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timerRunning]);

    const startTimer = (seconds) => {
        setSelectedTime(seconds);
        setTimeLeft(seconds);
        setTimerRunning(true);
    };

    const pauseTimer = () => setTimerRunning(false);

    const resetTimer = () => {
        setTimerRunning(false);
        setTimeLeft(selectedTime);
    };

    const timeOptions = [
        { label: "25 min", seconds: 1500 },
        { label: "10 min", seconds: 600 },
        { label: "5 min", seconds: 300 },
    ];

    return (
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm flex flex-col items-center justify-center h-full">
            <h2 className="text-lg font-bold text-foreground mb-4">⏳ Pomodoro Timer</h2>
            <div className="text-5xl font-mono text-primary font-bold tracking-wider mb-4">
                {Math.floor(timeLeft / 60)
                    .toString()
                    .padStart(2, "0")}
                :
                {(timeLeft % 60).toString().padStart(2, "0")}
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
                {timeOptions.map((opt) => (
                    <button
                        key={opt.seconds}
                        className="px-4 py-1.5 text-sm font-medium rounded-md transition-colors bg-muted text-muted-foreground enabled:hover:bg-primary enabled:hover:text-primary-foreground disabled:opacity-50"
                        onClick={() => startTimer(opt.seconds)}
                        disabled={timerRunning}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
            <div className="flex gap-3">
                <button
                    className="px-4 py-1.5 text-sm font-medium rounded-md transition-colors bg-red-500/20 text-red-400 hover:bg-red-500/40"
                    onClick={pauseTimer}
                    disabled={!timerRunning}
                >
                    Pause
                </button>
                <button
                    className="px-4 py-1.5 text-sm font-medium rounded-md transition-colors bg-muted text-muted-foreground hover:bg-muted/80"
                    onClick={resetTimer}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}