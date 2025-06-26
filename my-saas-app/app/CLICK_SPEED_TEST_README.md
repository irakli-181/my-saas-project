# Click Speed Test Component - Technical Documentation

## Overview

The Click Speed Test is a real-time interactive game that measures a user's clicking speed over a customizable time period. Users can test their Click Per Second (CPS) rate, compete against themselves through a persistent score history, and receive performance feedback through visual indicators and animations.

## File Structure

```
my-saas-app/
├── app/
│   ├── main.wasp                    # Route definitions and operation declarations
│   ├── schema.prisma                # Database schema including SpeedScore model
│   ├── src/
│   │   ├── client/
│   │   │   ├── components/
│   │   │   │   ├── TimerGame.tsx    # Main click speed test component
│   │   │   │   └── TimerGamePage.tsx # Page wrapper component
│   │   │   └── Main.css             # Global styles including animations
│   │   └── timer-game/
│   │       └── operations.ts        # Backend operations for score management
│   └── migrations/                  # Database migration files
```

## Component Architecture

### State Management

The `TimerGame` component uses multiple state hooks to manage the game lifecycle:

```typescript
// Timer and game state
const [timer, setTimer] = useState<TimerState>({
  minutes: 0,
  seconds: 30,
  isRunning: false,
  totalSeconds: 30, // Default 30 seconds
});

// Click tracking
const [clickTest, setClickTest] = useState<ClickTestState>({
  clickCount: 0,
  isActive: false,
});

// UI state
const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
const [lastDuration, setLastDuration] = useState<number | null>(null);

// Animation management
const [clickAnimations, setClickAnimations] = useState<ClickAnimation[]>([]);

// Score history and sorting
const [sortConfig, setSortConfig] = useState<SortConfig>({
  key: null,
  direction: null,
});
```

### Key Functions

#### Timer Management

**`startTimer()`**
- Activates both the countdown timer and click detection
- Calculates total seconds from minutes and seconds inputs
- Stores the duration for retry functionality
- Enables click tracking on the target area

**`resetTimer()`**
- Resets all game state to initial values
- Clears click count and animations
- Returns timer to editable state
- Closes any open modals

**`handleRetry()`**
- Automatically restarts the game with the same duration as the last attempt
- Useful for consecutive speed tests without reconfiguring
- Preserves the last used timer settings

#### Click Handling

**`handleDivClick(e: React.MouseEvent<HTMLDivElement>)`**
```typescript
const handleDivClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
  if (!clickTest.isActive) return;

  // Get click position relative to the div
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left - 5;
  const y = e.clientY - rect.top - 5;

  // Create animation at click position
  const animationId = Date.now() + Math.random();
  setClickAnimations(prev => [...prev, { id: animationId, x, y }]);

  // Remove animation after completion
  setTimeout(() => {
    setClickAnimations(prev => prev.filter(anim => anim.id !== animationId));
  }, 600);

  // Increment click counter
  setClickTest(prev => ({
    ...prev,
    clickCount: prev.clickCount + 1,
  }));
}, [clickTest.isActive]);
```

This function:
1. Validates that the test is active
2. Calculates precise click coordinates relative to the target area
3. Creates a unique animation at the exact click position
4. Manages animation lifecycle (600ms duration)
5. Updates the click counter

### Effects (useEffect)

#### Timer Countdown Effect
```typescript
useEffect(() => {
  let interval: NodeJS.Timeout;
  
  if (timer.isRunning && timer.totalSeconds > 0) {
    interval = setInterval(() => {
      setTimer(prev => {
        const newTotal = prev.totalSeconds - 1;
        
        if (newTotal <= 0) {
          // Timer completed
          setClickTest(prevClick => ({ ...prevClick, isActive: false }));
          return { ...prev, isRunning: false, totalSeconds: 0 };
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

#### Score Calculation and Persistence Effect
```typescript
useEffect(() => {
  if (!timer.isRunning && timer.totalSeconds === 0 && !isCompleted) {
    const duration = updateTotalSeconds(timer.minutes, timer.seconds);
    const clicksPerSecond = parseFloat((clickTest.clickCount / duration).toFixed(2));
    
    // Save to database
    if (clickTest.clickCount > 0) {
      createSpeedScore({
        duration,
        clicks: clickTest.clickCount,
        clicksPerSecond,
      }).then(() => {
        refetchScores();
      });
    }
    
    setIsCompleted(true);
    setIsScoreModalOpen(true);
  }
}, [timer.isRunning, timer.totalSeconds, isCompleted, ...]);
```

#### Initial Data Fetch
```typescript
// Fetch user's score history on component mount
const { data: speedScores, refetch: refetchScores } = useQuery(getSpeedScores);
```

### UI Layout

The component uses a **two-column responsive grid layout**:

#### Left Column - Timer Controls
- Editable timer display (EditableTimerDisplay component)
- Start/Reset/Retry buttons
- Progress bar showing remaining time
- Timer state indicators

#### Right Column - Click Area
- Large clickable target (300x300px on desktop)
- Real-time click counter
- Position-accurate click animations
- Visual feedback for active/inactive states

#### Results Modal
- Overlay modal displaying final scores
- Performance rating with emoji indicators:
  - 🔥 Lightning fast (6+ CPS)
  - ⚡ Super fast (5-6 CPS)
  - 👍 Good job (4-5 CPS)
  - 🙂 Not bad (3-4 CPS)
  - 🐌 Keep practicing (<3 CPS)
- Options to retry or reset

#### Score History Table
- Sortable columns (Duration, Clicks, CPS)
- Three-state sorting (ascending → descending → default)
- Newest score highlighted in gold
- Limited to 10 most recent scores
- Responsive design with horizontal scroll on mobile

## Backend Integration

### Prisma Schema

```prisma
model SpeedScore {
  id                String    @id @default(uuid())
  createdAt         DateTime  @default(now())

  user              User      @relation(fields: [userId], references: [id])
  userId            String

  duration          Int       // Timer duration in seconds
  clicks            Int       // Total clicks made
  clicksPerSecond   Float     // Calculated CPS rate

  @@map("speed_scores")
}
```

### Wasp Operations

#### `createSpeedScore`
**Purpose**: Persists a new speed score to the database while maintaining a 10-score limit per user.

**Input**:
```typescript
{
  duration: number;      // Test duration in seconds
  clicks: number;        // Total clicks made
  clicksPerSecond: number; // Calculated CPS rate
}
```

**Logic**:
1. Validates user authentication
2. Validates input data (positive values)
3. Checks existing scores count
4. If at limit (10), deletes oldest scores
5. Creates new score entry
6. Returns created score

#### `getSpeedScores`
**Purpose**: Retrieves user's speed score history.

**Logic**:
1. Validates user authentication
2. Fetches up to 10 most recent scores
3. Orders by creation date (newest first)
4. Returns score array

### Wasp Configuration

```wasp
// Route definition
route TimerGameRoute { path: "/timer-game", to: TimerGamePage }
page TimerGamePage {
  component: import { TimerGamePage } from "@src/client/components/TimerGamePage.tsx",
  authRequired: true
}

// Operations
action createSpeedScore {
  fn: import { createSpeedScore } from "@src/timer-game/operations",
  entities: [SpeedScore]
}

query getSpeedScores {
  fn: import { getSpeedScores } from "@src/timer-game/operations",
  entities: [SpeedScore]
}
```

## Animation System

### Click Animation CSS
```css
@keyframes rippleOut {
  0% {
    width: 40px;
    height: 40px;
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(0);
  }
  100% {
    width: 40px;
    height: 40px;
    opacity: 0;
    transform: translate(-50%, -50%) scale(8);
  }
}
```

The animation:
- Starts at the exact click coordinates
- Expands from 0 to 8x scale
- Fades out over 600ms
- Uses transform for GPU acceleration

## Performance Considerations

1. **Animation Cleanup**: Animations are automatically removed from state after 600ms to prevent memory leaks
2. **Database Limits**: Automatic cleanup maintains max 10 scores per user
3. **State Updates**: Uses functional setState to avoid stale closures
4. **Memoization**: Sorting logic uses useMemo to prevent unnecessary recalculations

## Security Features

1. **Authentication Required**: All operations check for authenticated user
2. **Input Validation**: Server-side validation of score data
3. **User Isolation**: Users can only access their own scores
4. **Rate Limiting**: Implicit through UI (one test at a time)

## Testing Considerations

Key test scenarios:
1. Timer countdown accuracy
2. Click registration and counting
3. Animation positioning at different viewport sizes
4. Score calculation precision
5. Database persistence and retrieval
6. Sorting functionality
7. Modal interactions
8. Responsive design breakpoints

## Future Enhancement Opportunities

1. Multiplayer competitions
2. Global leaderboards
3. Different game modes (sprint, marathon)
4. Achievement system
5. Social sharing of scores
6. Advanced statistics and analytics
7. Custom themes and click effects 