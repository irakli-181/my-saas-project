import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { cn } from '../cn';
import { createTypingScore, getTypingScores, useQuery } from 'wasp/client/operations';
import { type TypingScore } from 'wasp/entities';

// Sample texts (public domain)
const SAMPLE_TEXT_1 = "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters. My dear Mr. Bennet, said his lady to him one day, have you heard that Netherfield Park is let at last?";

const SAMPLE_TEXT_2 = "It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.";

const SAMPLE_TEXTS = [SAMPLE_TEXT_1, SAMPLE_TEXT_2];

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  totalSeconds: number;
}

interface TypingTestState {
  typedText: string;
  wordCount: number;
  correctWordCount: number;
  currentWordIndex: number;
  totalAttempted: number;
  accuracy: number;
  wordValidationStatus: ('correct' | 'incorrect' | 'current' | 'pending')[];
  isInputEnabled: boolean;
  finalScore: {
    words: number;
    duration: number;
    wordsPerMinute: number;
    accuracy: number;
    totalAttempted: number;
  } | null;
}

interface WordValidationResult {
  correctWords: number;
  totalTyped: number;
  currentWordIndex: number;
  totalAttempted: number;
  accuracy: number;
  isComplete: boolean;
  wordStatuses: ('correct' | 'incorrect' | 'current' | 'pending')[];
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
      
      if (editingField === 'minutes') {
        // Limit minutes to 1 maximum (1 minute total limit)
        const validMinutes = Math.min(Math.max(0, numValue), 1);
        onMinutesChange(validMinutes);
        // If minutes is set to 1, reset seconds to 0
        if (validMinutes === 1) {
          onSecondsChange(0);
        }
      } else {
        // For seconds, check if minutes is 1
        const maxSeconds = minutes === 1 ? 0 : 59;
        const validSeconds = Math.min(Math.max(0, numValue), maxSeconds);
        onSecondsChange(validSeconds);
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
        "text-8xl md:text-9xl font-bold text-gray-400 dark:text-gray-500",
        "flex items-center justify-center h-24 md:h-28", // Match field height exactly
        "leading-none", // Remove default line height
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

export const KeystrokeTimer: React.FC = () => {
  const [timer, setTimer] = useState<TimerState>({
    minutes: 0,
    seconds: 30,
    isRunning: false,
    totalSeconds: 30, // 30 seconds default
  });

  // State for current sample text
  const [currentText, setCurrentText] = useState<string>(SAMPLE_TEXTS[0]);

  const [isCompleted, setIsCompleted] = useState(false);
  const [lastDuration, setLastDuration] = useState<{minutes: number, seconds: number} | null>(null);
  const [typingTest, setTypingTest] = useState<TypingTestState>({
    typedText: '',
    wordCount: 0,
    correctWordCount: 0,
    currentWordIndex: 0,
    totalAttempted: 0,
    accuracy: 0,
    wordValidationStatus: [],
    isInputEnabled: false,
    finalScore: null,
  });
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  // Table sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: 'duration' | 'words' | 'wordsPerMinute' | null;
    direction: 'asc' | 'desc' | null;
  }>({ key: null, direction: null });

  // Ref for textarea auto-focus
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch typing scores history
  const { data: typingScores, isLoading: scoresLoading, refetch: refetchScores } = useQuery(getTypingScores);

  // Helper function to count words
  const countWords = useCallback((text: string): number => {
    // Split by whitespace and filter out empty strings
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }, []);

  // Word validation function
  const validateWords = useCallback((userInput: string, sampleText: string): WordValidationResult => {
    const userWords = userInput.trim().split(/\s+/).filter(word => word.length > 0);
    const sampleWords = sampleText.trim().split(/\s+/);
    
    let correctWords = 0;
    const wordStatuses: ('correct' | 'incorrect' | 'current' | 'pending')[] = new Array(sampleWords.length).fill('pending');
    
    // Check completed words (all words except the last one being typed)
    const completedWords = userInput.endsWith(' ') ? userWords.length : userWords.length - 1;
    
    for (let i = 0; i < completedWords; i++) {
      if (i < sampleWords.length) {
        if (userWords[i].toLowerCase() === sampleWords[i].toLowerCase()) {
          wordStatuses[i] = 'correct';
          correctWords++;
        } else {
          wordStatuses[i] = 'incorrect';
        }
      }
    }
    
    // Mark the current word being typed (if not completed)
    if (!userInput.endsWith(' ') && userWords.length > 0) {
      const currentWordIndex = userWords.length - 1;
      if (currentWordIndex < sampleWords.length && wordStatuses[currentWordIndex] === 'pending') {
        wordStatuses[currentWordIndex] = 'current';
      }
    }
    
    // Calculate accuracy and completion
    const totalAttempted = completedWords;
    const accuracy = totalAttempted > 0 ? (correctWords / totalAttempted) * 100 : 0;
    const isComplete = totalAttempted >= sampleWords.length;
    
    return {
      correctWords,
      totalTyped: userWords.length,
      currentWordIndex: userWords.length - 1,
      totalAttempted,
      accuracy,
      isComplete,
      wordStatuses
    };
  }, []);

  // Sample text words for reference
  const sampleWords = useMemo(() => {
    return currentText.trim().split(/\s+/);
  }, [currentText]);

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
      // Reset and enable typing test
      setTypingTest({
        typedText: '',
        wordCount: 0,
        correctWordCount: 0,
        currentWordIndex: 0,
        totalAttempted: 0,
        accuracy: 0,
        wordValidationStatus: new Array(sampleWords.length).fill('pending'),
        isInputEnabled: true,
        finalScore: null,
      });
      
      // Auto-focus the textarea
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    }
  }, [timer.minutes, timer.seconds, updateTotalSeconds, sampleWords.length]);

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
        // Reset and enable typing test
        setTypingTest({
          typedText: '',
          wordCount: 0,
          correctWordCount: 0,
          currentWordIndex: 0,
          totalAttempted: 0,
          accuracy: 0,
          wordValidationStatus: new Array(sampleWords.length).fill('pending'),
          isInputEnabled: true,
          finalScore: null,
        });
        
        // Auto-focus the textarea
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
          }
        }, 100);
      }
    }
  }, [lastDuration, updateTotalSeconds, sampleWords.length]);

  // Reset timer to input state
  const resetTimer = useCallback(() => {
    // Select random text
    const randomIndex = Math.floor(Math.random() * SAMPLE_TEXTS.length);
    setCurrentText(SAMPLE_TEXTS[randomIndex]);
    
    setTimer(prev => ({
      ...prev,
      isRunning: false,
      totalSeconds: updateTotalSeconds(prev.minutes, prev.seconds),
    }));
    setIsCompleted(false);
    // Reset typing test
    setTypingTest({
      typedText: '',
      wordCount: 0,
      correctWordCount: 0,
      currentWordIndex: 0,
      totalAttempted: 0,
      accuracy: 0,
      wordValidationStatus: new Array(sampleWords.length).fill('pending'),
      isInputEnabled: false,
      finalScore: null,
    });
  }, [updateTotalSeconds, sampleWords.length]);

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
            // Timer completed
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
    if (!timer.isRunning && timer.totalSeconds === 0 && typingTest.isInputEnabled && !isCompleted) {
      // Timer just completed - calculate final score using correct words only
      const originalDuration = updateTotalSeconds(timer.minutes, timer.seconds);
      const wordsPerMinute = parseFloat(((typingTest.correctWordCount / originalDuration) * 60).toFixed(2));
      
      // Save score to database (only once) - use correct words for scoring
      createTypingScore({
        duration: originalDuration,
        words: typingTest.correctWordCount,
        wordsPerMinute,
      }).then(() => {
        // Refetch scores to update the history
        refetchScores();
      }).catch((error) => {
        console.error('Failed to save typing score:', error);
      });
      
      setTypingTest(prev => ({
        ...prev,
        isInputEnabled: false,
        finalScore: {
          words: prev.correctWordCount, // Use correct words for final score
          duration: originalDuration,
          wordsPerMinute,
          accuracy: prev.accuracy,
          totalAttempted: prev.totalAttempted,
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
  }, [timer.isRunning, timer.totalSeconds, typingTest.isInputEnabled, isCompleted, typingTest.correctWordCount, timer.minutes, timer.seconds, updateTotalSeconds, refetchScores]);

  // Manual reset function
  const manualReset = useCallback(() => {
    // Select random text
    const randomIndex = Math.floor(Math.random() * SAMPLE_TEXTS.length);
    setCurrentText(SAMPLE_TEXTS[randomIndex]);
    
    setIsCompleted(false);
    setIsScoreModalOpen(false);
    setTypingTest({
      typedText: '',
      wordCount: 0,
      correctWordCount: 0,
      currentWordIndex: 0,
      totalAttempted: 0,
      accuracy: 0,
      wordValidationStatus: new Array(sampleWords.length).fill('pending'),
      isInputEnabled: false,
      finalScore: null,
    });
  }, [sampleWords.length]);

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

  // Handle typing in the textarea
  const handleTypingChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!typingTest.isInputEnabled) return;
    
    const newText = e.target.value;
          const validation = validateWords(newText, currentText);
    
    setTypingTest(prev => ({
      ...prev,
      typedText: newText,
      wordCount: validation.totalTyped,
      correctWordCount: validation.correctWords,
      currentWordIndex: validation.currentWordIndex,
      wordValidationStatus: validation.wordStatuses,
    }));
  }, [typingTest.isInputEnabled, validateWords]);

  // Handle timer minutes/seconds changes
  const handleMinutesChange = useCallback((newMinutes: number) => {
    setTimer(prev => ({
      ...prev,
      minutes: newMinutes,
      totalSeconds: updateTotalSeconds(newMinutes, prev.seconds),
    }));
  }, [updateTotalSeconds]);

  const handleSecondsChange = useCallback((newSeconds: number) => {
    setTimer(prev => ({
      ...prev,
      seconds: newSeconds,
      totalSeconds: updateTotalSeconds(prev.minutes, newSeconds),
    }));
  }, [updateTotalSeconds]);

  // Table sorting functions
  const handleSort = useCallback((key: 'duration' | 'words' | 'wordsPerMinute') => {
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

  const getSortIcon = (column: 'duration' | 'words' | 'wordsPerMinute') => {
    if (sortConfig.key !== column) {
      return '↕️';
    }
    if (sortConfig.direction === 'asc') {
      return '↑';
    } else if (sortConfig.direction === 'desc') {
      return '↓';
    }
    return '↕️';
  };

  // Sort typing scores
  const sortedTypingScores = useMemo(() => {
    if (!typingScores || !sortConfig.key || !sortConfig.direction) {
      return typingScores || [];
    }

    return [...typingScores].sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortConfig.key) {
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
          break;
        case 'words':
          aValue = a.words;
          bValue = b.words;
          break;
        case 'wordsPerMinute':
          aValue = a.wordsPerMinute;
          bValue = b.wordsPerMinute;
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
  }, [typingScores, sortConfig]);

  // Calculate display values for timer
  const displayMinutes = timer.isRunning ? Math.floor(timer.totalSeconds / 60) : timer.minutes;
  const displaySeconds = timer.isRunning ? timer.totalSeconds % 60 : timer.seconds;

  // Count words in sample text for progress tracking
  const sampleWordCount = countWords(currentText);

  // Calculate progress percentage
  const progressPercentage = sampleWordCount > 0 ? (typingTest.correctWordCount / sampleWordCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Keystroke Timer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Set your timer and practice typing with the sample text below. Only correctly typed words count towards your score.
          </p>
        </div>

        {/* How to Use Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Set Timer</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Click on the timer numbers to set your desired duration. Choose minutes and seconds for your typing session.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 dark:text-green-400 font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Start Typing</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Press Start Timer and begin typing the sample text. Words turn yellow while typing, green when correct, red when incorrect.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Track Progress</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Monitor your accuracy and speed in real-time. Only correctly typed words count towards your final score.
            </p>
          </div>
        </div>

        {/* Main Timer Section - Centered */}
        <div className="flex flex-col items-center justify-center space-y-8">
          
          {/* Timer Display */}
          <div className="text-center">
            <EditableTimerDisplay
              minutes={displayMinutes}
              seconds={displaySeconds}
              isRunning={timer.isRunning}
              isCompleted={isCompleted}
              onMinutesChange={handleMinutesChange}
              onSecondsChange={handleSecondsChange}
            />
          </div>

                    {/* Sample Text with Advanced Word Highlighting */}
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sample Text to Type
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Word {Math.min(typingTest.currentWordIndex + 1, sampleWords.length)} of {sampleWords.length}
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-8 mb-6 min-h-40">
              <div className="text-lg leading-relaxed font-mono">
                {sampleWords.map((word, index) => {
                  const status = typingTest.wordValidationStatus[index] || 'pending';
                  const isTargetWord = index === typingTest.currentWordIndex;
                  
                  return (
                    <React.Fragment key={index}>
                      <span
                        className={cn(
                          "transition-all duration-200 px-1 py-0.5 rounded",
                          {
                            "bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 font-semibold": status === 'correct',
                            "bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 font-semibold": status === 'incorrect',
                            "bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 ring-2 ring-yellow-500 font-bold shadow-md": status === 'current',
                            "text-gray-900 dark:text-white": status === 'pending',
                          }
                        )}
                      >
                        {word}
                      </span>
                      {index < sampleWords.length - 1 && ' '}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Progress and Stats */}
          <div className="w-full max-w-4xl">
            <div className="mb-4 text-center space-y-2">
              <div className="flex justify-center items-center space-x-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Correct Words: <span className="font-semibold text-green-600">{typingTest.correctWordCount}</span> / {sampleWordCount}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Typed: <span className="font-semibold text-blue-600">{typingTest.wordCount}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Accuracy: <span className="font-semibold text-primary">
                    {typingTest.wordCount > 0 ? Math.round((typingTest.correctWordCount / typingTest.wordCount) * 100) : 0}%
                  </span>
                </p>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full max-w-md mx-auto">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {progressPercentage.toFixed(1)}% Complete
                </p>
              </div>
            </div>
          </div>

          {/* Text Input Area */}
          <div className="w-full max-w-4xl">
            <textarea
              ref={textareaRef}
              value={typingTest.typedText}
              onChange={handleTypingChange}
              disabled={!typingTest.isInputEnabled}
              placeholder={
                !typingTest.isInputEnabled
                  ? "Start the timer to begin typing..."
                  : "Start typing the sample text above..."
              }
              className={cn(
                "w-full h-64 p-6 rounded-lg border-2 transition-all duration-300",
                "text-lg leading-relaxed resize-none font-mono",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                {
                  "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed": !typingTest.isInputEnabled,
                  "bg-white dark:bg-gray-900 border-primary text-gray-900 dark:text-white": typingTest.isInputEnabled,
                }
              )}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!timer.isRunning && !isCompleted && (
              <button
                onClick={startTimer}
                disabled={timer.totalSeconds === 0}
                className={cn(
                  "px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300",
                  "bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "shadow-lg hover:shadow-xl transform hover:scale-105"
                )}
              >
                Start Timer
              </button>
            )}

            {timer.isRunning && (
              <button
                onClick={resetTimer}
                className={cn(
                  "px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300",
                  "bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/50",
                  "shadow-lg hover:shadow-xl transform hover:scale-105",
                  "flex items-center gap-2"
                )}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
            )}

            {isCompleted && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={manualReset}
                  className={cn(
                    "px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300",
                    "bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50",
                    "shadow-lg hover:shadow-xl transform hover:scale-105",
                    "flex items-center gap-2"
                  )}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>

                {lastDuration && (
                  <button
                    onClick={retryTimer}
                    className={cn(
                      "px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300",
                      "bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50",
                      "shadow-lg hover:shadow-xl transform hover:scale-105",
                      "flex items-center gap-2"
                    )}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Retry ({lastDuration.minutes.toString().padStart(2, '0')}:{lastDuration.seconds.toString().padStart(2, '0')})
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Completion Message */}
          {isCompleted && (
            <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                Time's Up! ⏰
              </h3>
              <p className="text-green-700 dark:text-green-300">
                Your {timer.minutes.toString().padStart(2, '0')}:{timer.seconds.toString().padStart(2, '0')} session is complete.
              </p>
            </div>
          )}

          {/* Results Modal */}
          {isScoreModalOpen && typingTest.finalScore && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
                {/* Close button */}
                <button
                  onClick={closeScoreModal}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Modal content */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    🎉 Typing Session Complete!
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {Math.floor(typingTest.finalScore.duration / 60).toString().padStart(2, '0')}:
                        {(typingTest.finalScore.duration % 60).toString().padStart(2, '0')}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Correct Words Typed</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {typingTest.finalScore.words}
                      </p>
                    </div>
                    
                    <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Words Per Minute</p>
                      <p className="text-2xl font-bold text-primary">
                        {typingTest.finalScore.wordsPerMinute}
                      </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Final Accuracy</p>
                      <p className="text-xl font-bold text-green-600">
                        {typingTest.wordCount > 0 ? Math.round((typingTest.correctWordCount / typingTest.wordCount) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        closeScoreModal();
                        manualReset();
                      }}
                      className={cn(
                        "flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300",
                        "bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      )}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typing History */}
          {sortedTypingScores.length > 0 && (
            <div className="w-full max-w-4xl mt-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Your Typing History
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          onClick={() => handleSort('duration')}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          Duration {getSortIcon('duration')}
                        </th>
                        <th
                          onClick={() => handleSort('words')}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          Correct Words {getSortIcon('words')}
                        </th>
                        <th
                          onClick={() => handleSort('wordsPerMinute')}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          WPM {getSortIcon('wordsPerMinute')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {sortedTypingScores.map((score: TypingScore, index: number) => {
                        const isLatest = index === 0 && !sortConfig.key;
                        return (
                          <tr
                            key={score.id}
                            className={cn(
                              "hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                              {
                                "bg-yellow-50 dark:bg-yellow-900/20": isLatest,
                              }
                            )}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              <div className="flex items-center">
                                {Math.floor(score.duration / 60).toString().padStart(2, '0')}:
                                {(score.duration % 60).toString().padStart(2, '0')}
                                {isLatest && (
                                  <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full">
                                    Latest
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {score.words}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                              {score.wordsPerMinute}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(score.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {scoresLoading && (
                <div className="text-center mt-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Loading history...</span>
                </div>
              )}
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default KeystrokeTimer; 