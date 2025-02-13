'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });
  const [prevTime, setPrevTime] = useState(timeLeft);
  const [showWarning, setShowWarning] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          setIsEnded(true);
          return prev;
        }

        let newHours = prev.hours;
        let newMinutes = prev.minutes;
        let newSeconds = prev.seconds;

        if (newSeconds === 0) {
          if (newMinutes === 0) {
            if (newHours === 0) {
              return prev;
            }
            newHours--;
            newMinutes = 59;
          } else {
            newMinutes--;
          }
          newSeconds = 59;
        } else {
          newSeconds--;
        }

        if (newHours === 0 && newMinutes < 30) {
          setShowWarning(true);
        }

        setPrevTime(prev);
        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };
  //i have changed here
  useEffect(() => {
    if (timeLeft !== prevTime) {
      setIsFlipping(true);
      setTimeout(() => setIsFlipping(false), 600); // Flip animation duration
    }
  }, [timeLeft, prevTime]);

  interface TimeLeft {
    hours: number;
    minutes: number;
    seconds: number;
  }

  interface FlipCardProps {
    current: number;
    previous: number;
    label: string;
  }

  const padNumber = (num: number): string => String(num).padStart(2, '0');

  const FlipCard = ({ current, previous, label }:FlipCardProps) => {
    const hasChanged = current !== previous;
    return (
      <div className="flip-card-container">
      <div className={`flip-card ${isFlipping ? 'flip' : ''}`}>
        <div className="flip-card-top">{padNumber(previous)}</div>
        <div className="flip-card-bottom">{padNumber(current)}</div>
        <div className="flip-card-back-top">{padNumber(current)}</div>
        <div className="flip-card-back-bottom">{padNumber(previous)}</div>
      </div>
      <div className="label text-white text-lg">{label}</div>
    </div>
    );
  };

  return (
    <>
      <div className="h-full w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#1a1b23]">
        {/* Header Section */}
        <header className="bg-[#1a1b23] flex items-center text-white p-4 fixed top-0 left-0 w-full">
          <Image src="/logo.png" alt="Logo" height={40} width={40} />
          <div className="text-white p-2 font-bold glitch-text text-xl">Havoltz</div>
        </header>

        {/* Background Stars */}
        <div className="stars absolute inset-0" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-12 mb-12">
            <Image src="../logo.png" alt="Logo" height={150} width={150} className="bounce-pulse" />
            <h1 className="text-5xl md:text-8xl font-bold text-white mb-4 glitch-text animate-pulse">
              Voltaics&apos;25
            </h1>
          </div>

          <div className="flex justify-center items-center gap-4 md:gap-8 mb-12">
            <FlipCard current={timeLeft.hours} previous={prevTime.hours} label="HOURS" />
            <FlipCard current={timeLeft.minutes} previous={prevTime.minutes} label="MINUTES" />
            <FlipCard current={timeLeft.seconds} previous={prevTime.seconds} label="SECONDS" />
          </div>

          {showWarning && !isEnded && (
            <p className="text-2xl md:text-5xl font-bold text-[#8036c5bf] animate-pulse">
              Keep Ready With Your Projects!
            </p>
          )}

          {isEnded && (
            <p className="text-4xl mt-4 pt-6 md:text-6xl font-bold text-[#ff2d539a] animate-bounce">
              TIME ENDS!!!
            </p>
          )}

          {/* Start/Stop Button */}
          <button 
            className="fixed bottom-4 right-4 justify-center items-center bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-full shadow-lg text-2xl"
            onClick={toggleTimer}
          >
            {isRunning ? '⏹' : '▶'}
          </button>
        </div>
      </div>
    </>
  );
}