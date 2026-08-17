import { useState, useCallback, useRef } from 'react';
import { 
  useDebouncedCallback, 
  useThrottledCallback, 
  useRateLimitedCallback,
  useAsyncQueuer, 
  useBatcher 
} from '@tanstack/react-pacer';
import { Button } from '@/components/ui/button';
import { Play, Pause, BookOpen } from 'lucide-react';
import { CanvasTimeline, TimelineEvent, PatternType } from './CanvasTimeline';
import { DocsModal } from './DocsModal';
import { GithubIcon } from '@/components/GithubIcon';

export function ExecutionSimulator() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [windowMs, setWindowMs] = useState(6000);
  const [isPaused, setIsPaused] = useState(false);
  const [showDoc, setShowDoc] = useState(false);

  // Refs for tracking pause duration offsets
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const pausedTimeRef = useRef<number | null>(null);
  const totalPausedDurationRef = useRef<number>(0);

  // Compute virtual time: frozen at pausedTimeRef snapshot when paused
  const getVirtualNow = useCallback(() => {
    if (isPausedRef.current) {
      return (pausedTimeRef.current ?? Date.now()) - totalPausedDurationRef.current;
    }
    return Date.now() - totalPausedDurationRef.current;
  }, []);

  // Helper to push new dots to our visualizer with optional triggerTimestamp baseline
  const logEvent = useCallback((pattern: PatternType, triggerTimestamp?: number) => {
    const now = getVirtualNow();
    setEvents((prev) => [
      ...prev, 
      { 
        id: Math.random().toString(36).substring(2, 9), 
        timestamp: now, 
        triggerTimestamp: triggerTimestamp ?? now,
        pattern 
      }
    ]);
  }, [getVirtualNow]);

  // 1. Debounce
  const handleDebounce = useDebouncedCallback(
    useCallback((tTime?: number) => logEvent('debounce', tTime), [logEvent]), 
    { wait: 500 }
  );

  // 2. Throttle
  const handleThrottle = useThrottledCallback(
    useCallback((tTime?: number) => logEvent('throttle', tTime), [logEvent]), 
    { wait: 500 }
  );

  // 3. Rate Limit
  const handleRateLimit = useRateLimitedCallback(
    useCallback((tTime?: number) => logEvent('rateLimit', tTime), [logEvent]), 
    { limit: 3, window: 2000 }
  );

  // 4. Queue
  const processQueue = useCallback(async (itemPayload: string) => {
    let tTime: number | undefined;
    try {
      const parsed = JSON.parse(itemPayload);
      tTime = parsed.triggerTimestamp;
    } catch {
      // Fallback if plain string
    }
    logEvent('queue', tTime);
    await new Promise(resolve => setTimeout(resolve, 400)); 
  }, [logEvent]);
  
  const handleQueue = useAsyncQueuer(processQueue, { concurrency: 1, started: true });

  // 5. Batch
  const processBatch = useCallback(async (items: string[]) => {
    let tTime: number | undefined;
    if (items && items.length > 0) {
      try {
        const parsed = JSON.parse(items[0]);
        tTime = parsed.triggerTimestamp;
      } catch {
        // Fallback
      }
    }
    logEvent('batch', tTime);
  }, [logEvent]);

  const handleBatch = useBatcher(processBatch, { maxSize: 5, wait: 1000, started: true });

  // The Master Trigger
  const triggerAll = () => {
    const triggerTime = getVirtualNow();
    logEvent('raw', triggerTime);

    // Package payload with trigger timestamp for queue/batch latency tracking
    const safeId = Math.random().toString(36).substring(2, 9);
    const payload = JSON.stringify({ id: safeId, triggerTimestamp: triggerTime });

    handleDebounce(triggerTime);
    handleThrottle(triggerTime);
    handleRateLimit(triggerTime);
    
    // Fix: Force the queue engine to wake up before adding the item
    if (handleQueue.start) handleQueue.start();

    // Fix: Use the correct class method to push items into memory
    handleQueue.addItem(payload); 
    handleBatch.addItem(payload); 
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-zinc-950 text-white min-h-screen flex flex-col justify-between">
      <div className="grow">
        {/* Prominent Header with Primary Documentation & GitHub Actions */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight text-white flex items-center gap-3">
              Execution Timing Simulator
            </h1>
            <p className="text-zinc-400 text-sm">
              Click rapidly to see how different architectural patterns handle high-frequency events.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://github.com/atapas/execution-timing-simulator"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-500 text-zinc-200 hover:text-white px-3.5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm font-semibold"
              title="View source code and contribute on GitHub"
            >
              <GithubIcon className="h-4 w-4 text-zinc-300" />
              <span>GitHub</span>
            </a>

            <Button 
              onClick={() => setShowDoc(true)}
              className="cursor-pointer bg-teal-950/40 hover:bg-teal-900/60 border border-teal-500/40 hover:border-teal-400 text-teal-300 hover:text-white px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm font-semibold"
            >
              <BookOpen className="h-4 w-4 text-teal-400" />
              Pattern Documentation
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:items-stretch">
          {/* Controls Panel */}
          <div className="md:col-span-1 flex flex-col h-full">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg flex flex-col justify-between flex-1 h-full">
              <div>
                <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">
                  Controls
                </h2>
                
                <Button 
                  onClick={triggerAll}
                  className="cursor-pointer w-full h-16 text-lg font-bold bg-teal-600 hover:bg-teal-500 active:scale-95 transition-all shadow-teal-900/20 shadow-xl mb-4"
                >
                  Trigger Event
                </Button>

                <Button 
                  onClick={() => {
                    setIsPaused((prev) => {
                      const next = !prev;
                      isPausedRef.current = next;
                      if (next) {
                        // Snapshot the current wall-clock time as the pause point
                        pausedTimeRef.current = Date.now();
                      } else {
                        // Accumulate the elapsed pause duration before resuming
                        if (pausedTimeRef.current !== null) {
                          totalPausedDurationRef.current += Date.now() - pausedTimeRef.current;
                          pausedTimeRef.current = null;
                        }
                      }
                      return next;
                    });
                  }}
                  className={`w-full h-12 text-sm font-semibold transition-all mb-4 gap-2 flex items-center justify-center cursor-pointer ${
                    isPaused 
                      ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20 shadow-xl border border-transparent" 
                      : "border border-zinc-700 hover:bg-zinc-800 text-white bg-transparent"
                  }`}
                >
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4 fill-current" />
                      Resume Simulation
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 fill-current" />
                      Pause Simulation
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={() => setEvents([])}
                  variant="outline"
                  className="w-full border-zinc-700 hover:bg-zinc-300 text-zinc-900 cursor-pointer"
                >
                  Clear Timeline
                </Button>

                {/* Time Window Slider */}
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Timeline Speed
                    </label>
                    <span className="text-xs font-mono text-zinc-300 bg-zinc-800 px-2 py-1 rounded">
                      {windowMs / 1000}s
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="2000" 
                    max="15000" 
                    step="1000"
                    value={windowMs} 
                    onChange={(e) => setWindowMs(Number(e.target.value))}
                    className="w-full accent-teal-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-zinc-500 mt-2">
                    Adjust how much history is visible on screen.
                  </p>
                </div>
              </div>

              {/* Sidebar Secondary Resource Buttons */}
              <div className="mt-8 pt-6 border-t border-zinc-800/80 space-y-3">
                <Button 
                  onClick={() => setShowDoc(true)}
                  className="w-full bg-teal-950/30 hover:bg-teal-900/50 border border-teal-800/60 hover:border-teal-500/60 text-teal-300 hover:text-white cursor-pointer flex items-center justify-center gap-2 h-11 text-xs font-semibold rounded-xl transition-all shadow-sm"
                >
                  <BookOpen className="h-4 w-4 text-teal-400 shrink-0" />
                  Pattern Docs & Guide
                </Button>

                <a
                  href="https://github.com/atapas/execution-timing-simulator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-zinc-950/50 hover:bg-zinc-800/60 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white cursor-pointer flex items-center justify-center gap-2 h-11 text-xs font-semibold rounded-xl transition-all shadow-sm"
                >
                  <GithubIcon className="h-4 w-4 text-zinc-300 shrink-0" />
                  Contribute on GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Timeline Visualization Panel */}
          <div className="md:col-span-3 flex flex-col h-full">
            <CanvasTimeline 
              events={events} 
              windowMs={windowMs} 
              isPaused={isPaused}
              pausedTimeRef={pausedTimeRef}
              totalPausedDurationRef={totalPausedDurationRef}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
        <p>
          Made with love by{' '}
          <a
            href="https://youtube.com/@tapasadhikary"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 transition-colors font-medium underline underline-offset-4"
          >
            tapaScript
          </a>
          . Learn how Senior Devs think.
        </p>
        <a
          href="https://github.com/atapas/execution-timing-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-xs font-semibold bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-3.5 py-2 rounded-xl shadow-sm cursor-pointer"
        >
          <GithubIcon className="h-4 w-4 text-teal-400" />
          <span>Star & Contribute on GitHub</span>
        </a>
      </footer>
      {
        showDoc && (
          <DocsModal isOpen={showDoc} onClose={() => setShowDoc(false)} />
        )
      }
    </div>
  );
}