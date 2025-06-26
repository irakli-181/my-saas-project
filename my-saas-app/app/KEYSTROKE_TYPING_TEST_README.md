# Keystroke Typing Test Component - Technical Documentation

## Overview

The Keystroke Typing Test is an advanced typing speed and accuracy measurement tool that evaluates a user's typing performance in real-time. The application measures Words Per Minute (WPM) based on correctly typed words, tracks accuracy percentages, provides instant visual feedback for correct/incorrect words, and maintains a persistent history of typing scores.

## File Structure

```
my-saas-app/
├── app/
│   ├── main.wasp                      # Route definitions and operation declarations
│   ├── schema.prisma                  # Database schema including TypingScore model
│   ├── src/
│   │   ├── client/
│   │   │   ├── components/
│   │   │   │   ├── KeystrokeTimer.tsx # Main typing test component
│   │   │   │   └── KeystrokeTimerPage.tsx # Page wrapper component
│   │   │   └── Main.css               # Global styles
│   │   └── typing-timer/
│   │       └── operations.ts          # Backend operations for score management
│   └── migrations/                    # Database migration files
```

## Component Architecture

### State Management

The `KeystrokeTimer` component employs a sophisticated state management system:

```typescript
// Timer state
const [timer, setTimer] = useState<TimerState>({
  minutes: 0,
  seconds: 30,
  isRunning: false,
  totalSeconds: 30,
});

// Text management
const [currentText, setCurrentText] = useState<string>(SAMPLE_TEXTS[0]);

// Typing test state
const [typingTest, setTypingTest] = useState<TypingTestState>({
  typedText: '',
  wordCount: 0,
  correctWordCount: 0,
  currentWordIndex: 0,
  totalAttempted: 0,
  accuracy: 0,
  wordValidationStatus: [], // Array of validation states per word
  isInputEnabled: false,
  finalScore: null,
});

// UI state
const [isCompleted, setIsCompleted] = useState(false);
const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
const [lastDuration, setLastDuration] = useState<number | null>(null);

// Sorting configuration for history table
const [sortConfig, setSortConfig] = useState<SortConfig>({
  key: null,
  direction: null,
});
```

### Core Logic

#### Random Text Selection

```typescript
const SAMPLE_TEXTS = [SAMPLE_TEXT_1, SAMPLE_TEXT_2];

// In reset functions:
const randomIndex = Math.floor(Math.random() * SAMPLE_TEXTS.length);
setCurrentText(SAMPLE_TEXTS[randomIndex]);
```

Each reset or retry randomly selects from available sample texts:
- **SAMPLE_TEXT_1**: Opening from "Pride and Prejudice" (Jane Austen)
- **SAMPLE_TEXT_2**: Opening from "1984" (George Orwell)

#### Real-Time Word Validation

The heart of the typing test is the `validateWords` function:

```typescript
const validateWords = useCallback((userInput: string, sampleText: string): WordValidationResult => {
  const sampleWords = sampleText.trim().split(/\s+/);
  const userWords = userInput.trim().split(/\s+/);
  
  let correctWords = 0;
  let totalAttempted = 0;
  const wordStatuses: ('correct' | 'incorrect' | 'current' | 'pending')[] = [];
  
  sampleWords.forEach((sampleWord, index) => {
    if (index < userWords.length - 1) {
      // Completed words
      if (userWords[index] === sampleWord) {
        wordStatuses[index] = 'correct';
        correctWords++;
      } else {
        wordStatuses[index] = 'incorrect';
      }
      totalAttempted++;
    } else if (index === userWords.length - 1) {
      // Current word being typed
      wordStatuses[index] = 'current';
    } else {
      // Future words
      wordStatuses[index] = 'pending';
    }
  });
  
  const accuracy = totalAttempted > 0 
    ? parseFloat(((correctWords / totalAttempted) * 100).toFixed(2))
    : 0;
  
  return {
    correctWords,
    totalTyped: userWords.length,
    currentWordIndex: Math.min(userWords.length - 1, sampleWords.length - 1),
    totalAttempted,
    accuracy,
    isComplete: userWords.length >= sampleWords.length,
    wordStatuses,
  };
}, []);
```

#### WPM Calculation

Words Per Minute is calculated based on **correctly typed words only**:

```typescript
const wordsPerMinute = parseFloat(((typingTest.correctWordCount / originalDuration) * 60).toFixed(2));
```

Key aspects:
- Only correct words contribute to WPM
- Duration is in seconds, converted to minutes
- Result is rounded to 2 decimal places

#### Timer Limit Validation

The component enforces a maximum 1-minute time limit:

```typescript
// In EditableTimerDisplay handleInputBlur:
if (editingField === 'minutes') {
  const validMinutes = Math.min(Math.max(0, numValue), 1);
  onMinutesChange(validMinutes);
  if (validMinutes === 1) {
    onSecondsChange(0); // Force seconds to 0 if minutes = 1
  }
} else {
  const maxSeconds = minutes === 1 ? 0 : 59;
  const validSeconds = Math.min(Math.max(0, numValue), maxSeconds);
  onSecondsChange(validSeconds);
}
```

### UI Layout

#### Single-Column Layout with Key Sections:

1. **Header Section**
   - Title and description
   - Navigation back to dashboard

2. **Timer Display**
   - Editable timer (click to edit when stopped)
   - Large, prominent countdown display
   - Visual indicators for low time (<10 seconds)

3. **Control Buttons**
   - Start: Begins timer and enables typing
   - Reset: Clears everything and selects new text
   - Retry: Restarts with same duration and new text

4. **Progress Indicators**
   - Progress bar showing time remaining
   - Real-time accuracy percentage
   - Word count tracking

5. **Sample Text Display**
   ```typescript
   {sampleWords.map((word, index) => (
     <span
       key={index}
       className={cn(
         "inline-block mx-1 px-2 py-1 rounded transition-all duration-200",
         {
           "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300":
             wordValidationStatus[index] === 'correct',
           "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300":
             wordValidationStatus[index] === 'incorrect',
           "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold scale-105":
             wordValidationStatus[index] === 'current',
           "text-gray-500 dark:text-gray-400":
             wordValidationStatus[index] === 'pending',
         }
       )}
     >
       {word}
     </span>
   ))}
   ```

6. **Typing Input Area**
   - Large textarea for user input
   - Disabled when timer not running
   - Auto-focus when test starts

7. **Score History Table**
   - Sortable columns (Duration, Words, WPM, Date)
   - Performance ratings with emojis
   - Limited to 10 most recent scores

### Effects (useEffect)

#### Timer Countdown
```typescript
useEffect(() => {
  let interval: NodeJS.Timeout;
  
  if (timer.isRunning && timer.totalSeconds > 0) {
    interval = setInterval(() => {
      setTimer(prev => {
        const newTotal = prev.totalSeconds - 1;
        if (newTotal <= 0) {
          return {
            ...prev,
            isRunning: false,
            totalSeconds: 0,
          };
        }
        return { ...prev, totalSeconds: newTotal };
      });
    }, 1000);
  }
  
  return () => {
    if (interval) clearInterval(interval);
  };
}, [timer.isRunning, timer.totalSeconds]);
```

#### Timer Completion Handler
```typescript
useEffect(() => {
  if (!timer.isRunning && timer.totalSeconds === 0 && typingTest.isInputEnabled && !isCompleted) {
    // Calculate final score
    const originalDuration = updateTotalSeconds(timer.minutes, timer.seconds);
    const wordsPerMinute = parseFloat(((typingTest.correctWordCount / originalDuration) * 60).toFixed(2));
    
    // Save to database
    createTypingScore({
      duration: originalDuration,
      words: typingTest.correctWordCount,
      wordsPerMinute,
    }).then(() => {
      refetchScores();
    });
    
    // Update UI state
    setTypingTest(prev => ({
      ...prev,
      isInputEnabled: false,
      finalScore: {
        words: prev.correctWordCount,
        duration: originalDuration,
        wordsPerMinute,
        accuracy: prev.accuracy,
        totalAttempted: prev.totalAttempted,
      },
    }));
    
    setIsCompleted(true);
    setIsScoreModalOpen(true);
  }
}, [timer.isRunning, timer.totalSeconds, typingTest.isInputEnabled, isCompleted, ...]);
```

## Backend Integration

### Prisma Schema

```prisma
model TypingScore {
  id                String    @id @default(uuid())
  createdAt         DateTime  @default(now())

  user              User      @relation(fields: [userId], references: [id])
  userId            String

  duration          Int       // Timer duration in seconds
  words             Int       // Correct words typed
  wordsPerMinute    Float     // Calculated WPM rate

  @@map("typing_scores")
}
```

### Wasp Operations

#### `createTypingScore`
**Purpose**: Saves typing test results while maintaining a 10-score history limit.

**Input**:
```typescript
{
  duration: number;       // Test duration in seconds
  words: number;          // Number of correct words
  wordsPerMinute: number; // Calculated WPM
}
```

**Logic**:
1. Validates authentication
2. Validates input data integrity
3. Counts existing user scores
4. If at limit (10), deletes oldest score
5. Creates new score entry
6. Returns created score

#### `getTypingScores`
**Purpose**: Retrieves user's typing score history.

**Logic**:
1. Validates authentication
2. Fetches all user scores
3. Orders by creation date (newest first)
4. Returns score array

### Wasp Configuration

```wasp
// Route definition
route KeystrokeTimerRoute { path: "/keystroke-timer", to: KeystrokeTimerPage }
page KeystrokeTimerPage {
  component: import { KeystrokeTimerPage } from "@src/client/components/KeystrokeTimerPage.tsx",
  authRequired: true
}

// Operations
action createTypingScore {
  fn: import { createTypingScore } from "@src/typing-timer/operations",
  entities: [TypingScore]
}

query getTypingScores {
  fn: import { getTypingScores } from "@src/typing-timer/operations",
  entities: [TypingScore]
}
```

## Performance Metrics and Ratings

The component provides performance feedback based on WPM:

```typescript
const getPerformanceRating = (wpm: number) => {
  if (wpm >= 80) return '🔥';      // Professional typist
  if (wpm >= 60) return '⚡';      // Excellent
  if (wpm >= 40) return '👍';      // Good
  if (wpm >= 20) return '🙂';      // Average
  return '🐌';                     // Needs practice
};
```

## Real-Time Feedback System

### Visual Word Validation
- **Green background**: Correctly typed words
- **Red background**: Incorrectly typed words
- **Blue background + scale**: Current word being typed
- **Gray text**: Pending words

### Progress Tracking
- Live accuracy percentage display
- Word count updates (correct/total)
- Visual progress bar for time remaining
- Color-coded timer for urgency (red when <10 seconds)

## Security and Data Integrity

1. **Authentication**: All operations require authenticated user
2. **Data Validation**: Server-side validation of all score data
3. **User Isolation**: Scores are user-specific and isolated
4. **Input Sanitization**: Text input is trimmed and normalized
5. **Rate Limiting**: Natural limiting through UI flow

## Advanced Features

### Editable Timer Display
- Click-to-edit functionality when timer is stopped
- Inline editing with validation
- Escape key to cancel, Enter to confirm
- Visual feedback for editable state

### Smart Text Management
- Automatic text rotation on reset/retry
- Word boundary detection for accurate splitting
- Whitespace normalization
- Support for punctuation in text samples

### Responsive Design
- Mobile-optimized textarea and controls
- Flexible grid layouts
- Touch-friendly button sizes
- Horizontal scroll for history table on small screens

## Testing Considerations

Critical test scenarios:
1. Word validation accuracy across edge cases
2. Timer precision and boundary conditions
3. WPM calculation correctness
4. Random text selection distribution
5. Database persistence and retrieval
6. Concurrent typing and timer updates
7. Modal interactions and keyboard shortcuts
8. Performance with long texts
9. Memory management during extended sessions

## Future Enhancement Opportunities

1. Multiple difficulty levels with varying text complexity
2. Custom text input for personalized practice
3. Real-time multiplayer competitions
4. Detailed analytics (key-by-key accuracy, speed variations)
5. Typing tutorials and lessons
6. Language-specific tests
7. Keyboard heatmaps
8. Export functionality for scores
9. Achievement and badge system
10. Integration with typing certification services 