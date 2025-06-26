import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '../cn';
import { createSpeedScore, getSpeedScores, useQuery } from 'wasp/client/operations';
import { type SpeedScore } from 'wasp/entities';

// Custom styles for the click animation
const clickAnimationStyles = `
  @keyframes clickRipple {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(8);
      opacity: 0;
    }
  }
  
  .click-ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(59, 130, 246, 0.6);
    pointer-events: none;
    animation: clickRipple 400ms ease-out forwards;
    width: 40px;
    height: 40px;
    z-index: 10;
  }
`;

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  totalSeconds: number;
}

interface ClickTestState {
  clickCount: number;
  isActive: boolean;
  finalScore: {
    clicks: number;
    duration: number;
    clicksPerSecond: number;
  } | null;
}



const EditableTimerDisplay: React.FC<{ 
  minutes: number; 
  seconds: number; 
  isRunning: boolean; 
  isCompleted: boolean;
  onMinutesChange: (value: number) => void;
  onSecondsChange: (value: number) => void;
}> = ({ 
  minutes, 
  seconds, 
  isRunning, 
  isCompleted,
  onMinutesChange,
  onSecondsChange
}) => {
  const [editingField, setEditingField] = useState<'minutes' | 'seconds' | null>(null);
  const [tempValue, setTempValue] = useState('');
  
  const formatNumber = (num: number): string => num.toString().padStart(2, '0');
  const isEditable = !isRunning;

  const handleFieldClick = (field: 'minutes' | 'seconds') => {
    if (!isEditable) return;
    setEditingField(field);
    setTempValue(field === 'minutes' ? minutes.toString() : seconds.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 2) {
      setTempValue(value);
    }
  };

  const handleInputBlur = () => {
    if (editingField) {
      const numValue = parseInt(tempValue) || 0;
      const maxValue = editingField === 'minutes' ? 99 : 59;
      const validValue = Math.min(Math.max(0, numValue), maxValue);
      
      if (editingField === 'minutes') {
        onMinutesChange(validValue);
      } else {
        onSecondsChange(validValue);
      }
    }
    setEditingField(null);
    setTempValue('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    } else if (e.key === 'Escape') {
      setEditingField(null);
      setTempValue('');
    }
  };

  // Base styles that are identical for both input and display modes
  const baseFieldStyles = cn(
    "text-8xl md:text-9xl font-bold font-mono text-center leading-none",
    "w-32 md:w-40 h-24 md:h-28", // Fixed dimensions
    "flex items-center justify-center", // Consistent centering
    "rounded-lg px-2 py-1", // Consistent padding and border radius
    "box-border" // Ensure consistent box model
  );

  return (
    <div className="flex items-center justify-center space-x-4">
      {/* Minutes */}
      <div className="relative">
        {editingField === 'minutes' ? (
          <input
            type="text"
            value={tempValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className={cn(
              baseFieldStyles,
              "bg-transparent border-2 border-primary",
              "text-primary dark:text-white focus:outline-none"
            )}
            autoFocus
            maxLength={2}
          />
        ) : (
          <div 
            onClick={() => handleFieldClick('minutes')}
            className={cn(
              baseFieldStyles,
              "border-2 border-transparent", // Invisible border to match input
              "transition-all duration-300 select-none",
              {
                "text-primary dark:text-white": !isRunning || (minutes > 0 || seconds > 10),
                "text-meta-1 animate-pulse": isRunning && minutes === 0 && seconds <= 10,
                "cursor-pointer hover:text-primary/80 hover:bg-primary/5 hover:border-primary/20": isEditable,
                "cursor-default": !isEditable,
              }
            )}
            title={isEditable ? "Click to edit minutes" : ""}
          >
            {formatNumber(minutes)}
          </div>
        )}
      </div>

      {/* Colon Separator */}
      <div className={cn(
        "text-7xl md:text-[8rem] lg:text-[10rem] font-bold text-gray-400 dark:text-gray-500",
        "flex items-center justify-center h-28 md:h-32 lg:h-36", // Match field height
        {
          "animate-pulse": isRunning && minutes === 0 && seconds <= 10,
        }
      )}>
        :
      </div>

      {/* Seconds */}
      <div className="relative">
        {editingField === 'seconds' ? (
          <input
            type="text"
            value={tempValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className={cn(
              baseFieldStyles,
              "bg-transparent border-2 border-primary",
              "text-primary dark:text-white focus:outline-none"
            )}
            autoFocus
            maxLength={2}
          />
        ) : (
          <div 
            onClick={() => handleFieldClick('seconds')}
            className={cn(
              baseFieldStyles,
              "border-2 border-transparent", // Invisible border to match input
              "transition-all duration-300 select-none",
              {
                "text-primary dark:text-white": !isRunning || (minutes > 0 || seconds > 10),
                "text-meta-1 animate-pulse": isRunning && minutes === 0 && seconds <= 10,
                "cursor-pointer hover:text-primary/80 hover:bg-primary/5 hover:border-primary/20": isEditable,
                "cursor-default": !isEditable,
              }
            )}
            title={isEditable ? "Click to edit seconds" : ""}
          >
            {formatNumber(seconds)}
          </div>
        )}
      </div>
    </div>
  );
};

export const TimerGame: React.FC = () => {
  const [timer, setTimer] = useState<TimerState>({
    minutes: 0,
    seconds: 30,
    isRunning: false,
    totalSeconds: 30, // 30 seconds default
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [clickTest, setClickTest] = useState<ClickTestState>({
    clickCount: 0,
    isActive: false,
    finalScore: null,
  });
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [lastDuration, setLastDuration] = useState<{minutes: number, seconds: number} | null>(null);

  // Table sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: 'duration' | 'clicks' | 'clicksPerSecond' | null;
    direction: 'asc' | 'desc' | null;
  }>({ key: null, direction: null });

  // Click position animations
  const [clickAnimations, setClickAnimations] = useState<Array<{
    id: number;
    x: number;
    y: number;
  }>>([]);

  // Fetch speed scores history
  const { data: speedScores, isLoading: scoresLoading, refetch: refetchScores } = useQuery(getSpeedScores);

  // Calculate total seconds from minutes and seconds
  const updateTotalSeconds = useCallback((minutes: number, seconds: number) => {
    return minutes * 60 + seconds;
  }, []);

  // Start the timer
  const startTimer = useCallback(() => {
    const totalSeconds = updateTotalSeconds(timer.minutes, timer.seconds);
    if (totalSeconds > 0) {
      // Store current duration as last duration
      setLastDuration({ minutes: timer.minutes, seconds: timer.seconds });
      
      setTimer(prev => ({
        ...prev,
        isRunning: true,
        totalSeconds,
      }));
      setIsCompleted(false);
      // Reset and activate click test
      setClickTest({
        clickCount: 0,
        isActive: true,
        finalScore: null,
      });
    }
  }, [timer.minutes, timer.seconds, updateTotalSeconds]);

  // Retry with last duration
  const retryTimer = useCallback(() => {
    if (lastDuration) {
      const totalSeconds = updateTotalSeconds(lastDuration.minutes, lastDuration.seconds);
      if (totalSeconds > 0) {
        setTimer({
          minutes: lastDuration.minutes,
          seconds: lastDuration.seconds,
          isRunning: true,
          totalSeconds,
        });
        setIsCompleted(false);
        // Reset and activate click test
        setClickTest({
          clickCount: 0,
          isActive: true,
          finalScore: null,
        });
      }
    }
  }, [lastDuration, updateTotalSeconds]);

  // Reset timer to input state
  const resetTimer = useCallback(() => {
    setTimer(prev => ({
      ...prev,
      isRunning: false,
      totalSeconds: updateTotalSeconds(prev.minutes, prev.seconds),
    }));
    setIsCompleted(false);
    // Reset click test
    setClickTest({
      clickCount: 0,
      isActive: false,
      finalScore: null,
    });
  }, [updateTotalSeconds]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isRunning && timer.totalSeconds > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          const newTotal = prev.totalSeconds - 1;
          const newMinutes = Math.floor(newTotal / 60);
          const newSeconds = newTotal % 60;

          if (newTotal <= 0) {
            // Timer completed - will handle completion in separate effect
            return {
              minutes: prev.minutes,
              seconds: prev.seconds,
              isRunning: false,
              totalSeconds: 0, // Set to 0 to trigger completion
            };
          }

          return {
            ...prev,
            totalSeconds: newTotal,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.isRunning, timer.totalSeconds]);

  // Handle timer completion separately to avoid duplicate saves
  useEffect(() => {
    if (!timer.isRunning && timer.totalSeconds === 0 && clickTest.isActive && !isCompleted) {
      // Timer just completed - calculate final score
      const originalDuration = updateTotalSeconds(timer.minutes, timer.seconds);
      const clicksPerSecond = parseFloat((clickTest.clickCount / originalDuration).toFixed(2));
      
      // Save score to database (only once)
      createSpeedScore({
        duration: originalDuration,
        clicks: clickTest.clickCount,
        clicksPerSecond,
      }).then(() => {
        // Refetch scores to update the history
        refetchScores();
      }).catch((error) => {
        console.error('Failed to save speed score:', error);
      });
      
      setClickTest(prev => ({
        ...prev,
        isActive: false,
        finalScore: {
          clicks: prev.clickCount,
          duration: originalDuration,
          clicksPerSecond,
        },
      }));
      setIsCompleted(true);
      setIsScoreModalOpen(true);
      
      // Reset timer totalSeconds to prevent re-triggering
      setTimer(prev => ({
        ...prev,
        totalSeconds: updateTotalSeconds(prev.minutes, prev.seconds),
      }));
    }
  }, [timer.isRunning, timer.totalSeconds, clickTest.isActive, isCompleted, clickTest.clickCount, timer.minutes, timer.seconds, updateTotalSeconds, refetchScores]);

  // Manual reset function
  const manualReset = useCallback(() => {
    setIsCompleted(false);
    setIsScoreModalOpen(false);
    setClickTest({
      clickCount: 0,
      isActive: false,
      finalScore: null,
    });
  }, []);

  // Close score modal
  const closeScoreModal = useCallback(() => {
    setIsScoreModalOpen(false);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isScoreModalOpen) {
        closeScoreModal();
      }
    };

    if (isScoreModalOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isScoreModalOpen, closeScoreModal]);

  // Handle click area interaction
  const handleClickAreaClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickTest.isActive || !timer.isRunning) return;
    
    // Increment click count
    setClickTest(prev => ({
      ...prev,
      clickCount: prev.clickCount + 1,
    }));
    
    // Get click position relative to the click area with manual offset
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 5; // Subtract 5px to move left
    const y = e.clientY - rect.top - 5;  // Subtract 5px to move up
    
    // Create new animation
    const animationId = Date.now() + Math.random();
    setClickAnimations(prev => [...prev, { id: animationId, x, y }]);
    
    // Remove animation after completion
    setTimeout(() => {
      setClickAnimations(prev => prev.filter(anim => anim.id !== animationId));
    }, 400);
  }, [clickTest.isActive, timer.isRunning]);

  // Table sorting functions
  const handleSort = useCallback((key: 'duration' | 'clicks' | 'clicksPerSecond') => {
    setSortConfig(prev => {
      if (prev.key === key) {
        // Cycle through: asc -> desc -> null (default)
        if (prev.direction === 'asc') {
          return { key, direction: 'desc' };
        } else if (prev.direction === 'desc') {
          return { key: null, direction: null };
        }
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const sortedScores = useMemo(() => {
    if (!speedScores || !sortConfig.key || !sortConfig.direction) {
      return speedScores; // Return original order (newest first)
    }

    return [...speedScores].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortConfig.key) {
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
          break;
        case 'clicks':
          aValue = a.clicks;
          bValue = b.clicks;
          break;
        case 'clicksPerSecond':
          aValue = a.clicksPerSecond;
          bValue = b.clicksPerSecond;
          break;
        default:
          return 0;
      }

      if (sortConfig.direction === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }, [speedScores, sortConfig]);

  const getSortIcon = (column: 'duration' | 'clicks' | 'clicksPerSecond') => {
    if (sortConfig.key !== column) {
      return '↕️'; // Both arrows when not sorted
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const currentMinutes = timer.isRunning ? Math.floor(timer.totalSeconds / 60) : timer.minutes;
  const currentSeconds = timer.isRunning ? timer.totalSeconds % 60 : timer.seconds;

  const canStart = !timer.isRunning && (timer.minutes > 0 || timer.seconds > 0) && !isCompleted;
  const canRetry = !timer.isRunning && lastDuration && !isCompleted;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-boxdark-2 dark:to-boxdark flex items-center justify-center p-4">
      {/* Custom CSS for animations */}
      <style>{clickAnimationStyles}</style>
      <div className="w-full max-w-7xl mx-auto">
        {/* Card Container */}
        <div className="bg-white dark:bg-boxdark rounded-2xl shadow-default p-6 md:p-8 lg:p-12 border border-stroke dark:border-strokedark">
          
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              ⏱️ Timer & Click Speed Game
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Set your countdown and test your clicking speed!
            </p>
          </div>

          {/* Two Column Layout - Vertically Centered */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-center lg:min-h-[500px]">
            
            {/* Left Column - Timer Controls */}
            <div className="flex flex-col justify-center space-y-8 lg:pr-8 lg:border-r lg:border-stroke lg:dark:border-strokedark">
              
              {/* Editable Timer Display */}
              <div className="text-center lg:text-left">
                <div className="lg:flex lg:justify-start lg:items-center">
                  <EditableTimerDisplay 
                    minutes={currentMinutes} 
                    seconds={currentSeconds} 
                    isRunning={timer.isRunning}
                    isCompleted={isCompleted}
                    onMinutesChange={(value) => setTimer(prev => ({ 
                      ...prev, 
                      minutes: value,
                      totalSeconds: value * 60 + prev.seconds
                    }))}
                    onSecondsChange={(value) => setTimer(prev => ({ 
                      ...prev, 
                      seconds: value,
                      totalSeconds: prev.minutes * 60 + value
                    }))}
                  />
                </div>
                {!timer.isRunning && !isCompleted && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center lg:text-left">
                    Click on minutes or seconds to edit the timer duration
                  </p>
                )}
              </div>

              {/* Control Buttons */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {canStart && (
                  <button
                    onClick={startTimer}
                    className={cn(
                      "inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl",
                      "bg-primary text-white hover:bg-opacity-90 transition-all duration-300",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      "shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    )}
                    disabled={timer.minutes === 0 && timer.seconds === 0}
                  >
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start Timer
                  </button>
                )}

                {canRetry && (
                  <button
                    onClick={retryTimer}
                    className={cn(
                      "inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl",
                      "bg-meta-3 text-white hover:bg-opacity-90 transition-all duration-300",
                      "focus:outline-none focus:ring-2 focus:ring-meta-3 focus:ring-offset-2",
                      "shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    )}
                  >
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Retry ({lastDuration?.minutes || 0}:{(lastDuration?.seconds || 0).toString().padStart(2, '0')})
                  </button>
                )}

                {timer.isRunning && (
                  <button
                    onClick={resetTimer}
                    className={cn(
                      "inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl",
                      "bg-meta-1 text-white hover:bg-opacity-90 transition-all duration-300",
                      "focus:outline-none focus:ring-2 focus:ring-meta-1 focus:ring-offset-2",
                      "shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    )}
                  >
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Stop & Reset
                  </button>
                )}

                {isCompleted && (
                  <button
                    onClick={manualReset}
                    className={cn(
                      "inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl",
                      "bg-gray-600 text-white hover:bg-opacity-90 transition-all duration-300",
                      "focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2",
                      "shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    )}
                  >
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset Timer
                  </button>
                )}
              </div>

              {/* Instructions */}
              <div className="text-center lg:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Perfect for quick focus sessions, reaction training, or click speed tests
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Click on the timer numbers to edit duration. Start and see how fast you can click!
                </p>
              </div>
            </div>

            {/* Right Column - Click Test Area */}
            <div className="flex flex-col items-center justify-center space-y-6 lg:pl-8 lg:bg-gray-50/30 lg:dark:bg-boxdark-2/30 lg:rounded-xl lg:py-8 lg:-mx-8 lg:px-16">
              
              {/* Click Target Area */}
              <div className="relative">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                  Click Speed Test
                </h3>
                <div
                  onClick={handleClickAreaClick}
                  className={cn(
                    "relative w-64 h-64 md:w-80 md:h-80 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-2xl border-4 transition-all duration-300",
                    "flex items-center justify-center text-2xl font-bold select-none overflow-hidden",
                    "transform transition-transform duration-250",
                    {
                      // Active state
                      "bg-primary/10 border-primary text-primary cursor-pointer hover:bg-primary/20 hover:scale-105": 
                        clickTest.isActive && timer.isRunning,
                      // Inactive state
                      "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed dark:bg-meta-4 dark:border-strokedark dark:text-gray-500": 
                        !clickTest.isActive || !timer.isRunning,
                    }
                  )}
                >
                  {/* Click Animations */}
                  {clickAnimations.map((animation) => (
                    <div
                      key={animation.id}
                      className="click-ripple"
                      style={{
                        left: animation.x,
                        top: animation.y,
                      }}
                    />
                  ))}
                  
                  {/* Content */}
                  {!timer.isRunning && !isCompleted ? (
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎯</div>
                      <div className="text-lg">Click to Test Speed</div>
                      <div className="text-sm opacity-70">(Start timer first)</div>
                    </div>
                  ) : timer.isRunning ? (
                    <div className="text-center">
                      <div className="text-4xl mb-2">🚀</div>
                      <div className="text-lg">Click as fast as you can!</div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏁</div>
                      <div className="text-lg">Test Complete!</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Click Counter */}
              <div className="text-center">
                <div className={cn(
                  "text-3xl font-bold transition-all duration-300",
                  {
                    "text-primary": timer.isRunning,
                    "text-gray-500 dark:text-gray-400": !timer.isRunning && !isCompleted,
                    "text-meta-3": isCompleted,
                  }
                )}>
                  Clicks: {clickTest.clickCount}
                </div>
                {timer.isRunning && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Keep clicking!
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Speed Scores History Section */}
          <div className="mt-12 pt-8 border-t border-stroke dark:border-strokedark">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                📊 Your Speed History
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Track your progress and see your best performances
              </p>
            </div>

            {scoresLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : speedScores && speedScores.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white dark:bg-boxdark rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-meta-4">
                      <th 
                        onClick={() => handleSort('duration')}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-stroke dark:border-strokedark cursor-pointer hover:bg-gray-100 dark:hover:bg-meta-4/70 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          Duration
                          <span className="text-xs">{getSortIcon('duration')}</span>
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('clicks')}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-stroke dark:border-strokedark cursor-pointer hover:bg-gray-100 dark:hover:bg-meta-4/70 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          Clicks
                          <span className="text-xs">{getSortIcon('clicks')}</span>
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('clicksPerSecond')}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-stroke dark:border-strokedark cursor-pointer hover:bg-gray-100 dark:hover:bg-meta-4/70 transition-colors"
                      >
                        <div className="flex items-center gap-1">
                          Clicks/Second
                          <span className="text-xs">{getSortIcon('clicksPerSecond')}</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-stroke dark:border-strokedark">
                        Date
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white border-b border-stroke dark:border-strokedark">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(sortedScores || []).map((score, index) => (
                      <tr 
                        key={score.id}
                        className={cn(
                          "hover:bg-gray-50 dark:hover:bg-meta-4/30 transition-colors",
                          {
                            "bg-yellow-50 dark:bg-yellow-900/10": !sortConfig.key && index === 0,
                            "bg-white dark:bg-boxdark": sortConfig.key || index > 0,
                          }
                        )}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-stroke dark:border-strokedark">
                          <div className="flex items-center">
                            {!sortConfig.key && index === 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-200 text-yellow-800 dark:bg-yellow-700/30 dark:text-yellow-300 mr-2">
                                🏆 Latest
                              </span>
                            )}
                            <span className="font-mono">
                              {Math.floor(score.duration / 60)}:{(score.duration % 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white border-b border-stroke dark:border-strokedark">
                          {score.clicks}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-primary border-b border-stroke dark:border-strokedark">
                          {score.clicksPerSecond}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 border-b border-stroke dark:border-strokedark">
                          {new Date(score.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center border-b border-stroke dark:border-strokedark">
                          <span className="text-2xl">
                            {score.clicksPerSecond >= 8 ? "🔥" :
                             score.clicksPerSecond >= 6 ? "⚡" :
                             score.clicksPerSecond >= 4 ? "👍" :
                             score.clicksPerSecond >= 2 ? "🙂" :
                             "🐌"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Scores Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Complete your first timer challenge to see your scores here!
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Start your first challenge above
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Score Modal */}
      {isScoreModalOpen && clickTest.finalScore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-boxdark rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-stroke dark:border-strokedark">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                🏆 Your Click Speed Score
              </h3>
              <button
                onClick={closeScoreModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-meta-4 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-meta-3 to-primary rounded-full mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Excellent Performance!
                </h4>
              </div>

              <div className="bg-gradient-to-r from-meta-3/10 to-primary/10 rounded-xl p-6 border border-meta-3/20 mb-6">
                <div className="space-y-4 text-center">
                  <div>
                    <div className="text-4xl font-bold text-meta-3 mb-1">
                      {clickTest.finalScore.clicks}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Clicks
                    </div>
                  </div>
                  
                  <div className="border-t border-stroke dark:border-strokedark pt-4">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {clickTest.finalScore.clicksPerSecond}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Clicks per Second
                    </div>
                  </div>

                  <div className="border-t border-stroke dark:border-strokedark pt-4">
                    <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {clickTest.finalScore.duration} seconds
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Test Duration
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Rating */}
              <div className="text-center mb-6">
                <div className="text-2xl mb-2">
                  {clickTest.finalScore.clicksPerSecond >= 8 ? "🔥" :
                   clickTest.finalScore.clicksPerSecond >= 6 ? "⚡" :
                   clickTest.finalScore.clicksPerSecond >= 4 ? "👍" :
                   clickTest.finalScore.clicksPerSecond >= 2 ? "🙂" :
                   "🐌"}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {clickTest.finalScore.clicksPerSecond >= 8 ? "Lightning Fast!" :
                   clickTest.finalScore.clicksPerSecond >= 6 ? "Very Good!" :
                   clickTest.finalScore.clicksPerSecond >= 4 ? "Good Job!" :
                   clickTest.finalScore.clicksPerSecond >= 2 ? "Not Bad!" :
                   "Keep Practicing!"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {clickTest.finalScore.clicksPerSecond >= 6 ? "You're in the top tier!" :
                   clickTest.finalScore.clicksPerSecond >= 4 ? "Above average performance!" :
                   clickTest.finalScore.clicksPerSecond >= 2 ? "Room for improvement!" :
                   "Try again to beat your score!"}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    closeScoreModal();
                    manualReset();
                  }}
                  className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerGame; 