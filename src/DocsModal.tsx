import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { GithubIcon } from '@/components/GithubIcon';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Colour swatches matching CanvasTimeline LANES ───────────────────────────
const PATTERN_COLORS: Record<string, string> = {
  raw:       '#64748b',  // slate-500
  debounce:  '#3b82f6',  // blue-500
  throttle:  '#10b981',  // emerald-500
  rateLimit: '#ef4444',  // red-500
  queue:     '#f59e0b',  // amber-500
  batch:     '#8b5cf6',  // violet-500
};

const Dot = ({ color }: { color: string }) => (
  <span
    className="inline-block w-3 h-3 rounded-full shrink-0 mt-0.5"
    style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}99` }}
  />
);

const Badge = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <span
    className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-white/10"
    style={{ backgroundColor: `${color}22`, color }}
  >
    {children}
  </span>
);

const Section = ({
  id,
  color,
  title,
  children,
}: {
  id: string;
  color: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-4">
    <div className="flex items-center gap-3 mb-3">
      <Dot color={color} />
      <h3 className="text-base font-bold text-white">{title}</h3>
    </div>
    <div className="ml-6 space-y-2 text-sm text-zinc-400 leading-relaxed">{children}</div>
  </section>
);

const Param = ({ label, value, note }: { label: string; value: string; note: string }) => (
  <div className="flex flex-wrap items-start gap-x-2 gap-y-1">
    <code className="text-xs bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded font-mono whitespace-nowrap">
      {label}: <span className="text-teal-400">{value}</span>
    </code>
    <span className="text-zinc-500 text-xs">{note}</span>
  </div>
);

// ─── YOUTUBE PLACEHOLDER — replace VIDEO_ID when ready ───────────────────────

export function DocsModal({ isOpen, onClose }: DocsModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Documentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">About This App</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Understanding execution timing patterns</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close documentation"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-6 space-y-8">

          {/* ── 1. What is this app ── */}
          <section>
            <h3 className="text-base font-bold text-white mb-3">What is the Execution Timing Simulator?</h3>
            <div className="space-y-2 text-sm text-zinc-400 leading-relaxed">
              <p>
                This is an <span className="text-white font-medium">interactive visual tool</span> that
                demonstrates how senior developers control the rate at which functions execute in response
                to high-frequency browser events — things like rapid button clicks, scroll events,
                keystrokes, or API calls.
              </p>
              <p>
                Every time you click <span className="text-teal-400 font-semibold">Trigger Event</span>,
                all five patterns receive the same signal simultaneously. Watch how each one responds
                differently — some fire immediately, some wait, some group calls together, and some
                strictly cap how many get through.
              </p>
              <p>
                Use the <span className="text-teal-400 font-semibold">Pause Simulation</span> button
                at any time to freeze the timeline and inspect exactly where each dot landed.
              </p>
              <div className="mt-3 p-3 bg-teal-950/40 border border-teal-900/50 rounded-lg text-teal-300 text-xs">
                💡 <strong>Pro tip:</strong> Click rapidly 5 to 10 times in quick succession, then pause.
                You will see that debounce shows far fewer dots than raw clicks — that is the entire point.
              </div>
            </div>
          </section>

          <hr className="border-zinc-800" />

          {/* ── 2. Pattern explanations ── */}
          <div className="space-y-7">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">Pattern Reference</h3>

            {/* Raw */}
            <Section id="raw" color={PATTERN_COLORS.raw} title="Raw Clicks">
              <p>
                This is the <strong className="text-zinc-200">unfiltered baseline</strong> — every single
                click fires immediately with zero delay or restriction. It represents what would happen if
                you had no timing strategy at all.
              </p>
              <p className="text-zinc-500 italic">
                In a real app this would mean: every keystroke triggers an API search, every pixel of
                scroll fires an animation recalculation, every mouse-move dispatches a Redux action.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge color={PATTERN_COLORS.raw}>No parameters</Badge>
                <Badge color={PATTERN_COLORS.raw}>Fires on every click</Badge>
              </div>
            </Section>

            {/* Debounce */}
            <Section id="debounce" color={PATTERN_COLORS.debounce} title="Debounce">
              <p>
                Debounce <strong className="text-zinc-200">delays execution</strong> until a burst of
                calls has fully stopped for a defined wait period. If another call arrives before the
                timer expires, the clock resets. Only the <em>final</em> call in a burst is executed.
              </p>
              <p className="text-zinc-500 italic">
                Classic use case: search-as-you-type — you only want to query the server when the user
                has finished typing, not on every single keystroke.
              </p>
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Parameters in this app</p>
                <Param label="wait" value="500ms" note="The function fires 500 ms after the last click. Rapid clicking keeps resetting the timer." />
              </div>
            </Section>

            {/* Throttle */}
            <Section id="throttle" color={PATTERN_COLORS.throttle} title="Throttle">
              <p>
                Throttle <strong className="text-zinc-200">limits execution to at most once per time
                window</strong>. Unlike debounce, it guarantees the function fires at a steady cadence
                regardless of how fast events arrive — the first call in each window gets through.
              </p>
              <p className="text-zinc-500 italic">
                Classic use case: scroll or resize handlers — you want smooth 60 fps-style feedback,
                but do not need every single pixel event to trigger a re-render.
              </p>
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Parameters in this app</p>
                <Param label="wait" value="500ms" note="At most one dot is plotted every 500 ms, no matter how many clicks arrive." />
              </div>
            </Section>

            {/* Rate Limit */}
            <Section id="rateLimit" color={PATTERN_COLORS.rateLimit} title="Rate Limit">
              <p>
                Rate Limiting enforces a <strong className="text-zinc-200">hard budget</strong>: a
                maximum number of executions allowed within a fixed time window. Once the budget is
                exhausted, any further calls in that window are silently dropped.
              </p>
              <p className="text-zinc-500 italic">
                Classic use case: API integrations with per-minute quotas, payment button guards,
                or preventing spam form submissions.
              </p>
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Parameters in this app</p>
                <Param label="limit"  value="3 calls"  note="Only 3 executions are allowed within each 2-second window." />
                <Param label="window" value="2000ms" note="The budget fully resets every 2 seconds." />
              </div>
            </Section>

            {/* Queue */}
            <Section id="queue" color={PATTERN_COLORS.queue} title="Queue">
              <p>
                A Queue <strong className="text-zinc-200">serialises work</strong>. Each call is held
                in line and processed only after the previous one finishes. No calls are dropped —
                they are simply delayed until capacity is available.
              </p>
              <p className="text-zinc-500 italic">
                Classic use case: sequential API mutations, file uploads that must not run in parallel,
                or tasks that depend on the result of the previous one.
              </p>
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Parameters in this app</p>
                <Param label="concurrency"    value="1"      note="Only one task runs at a time (strictly serial)." />
                <Param label="task duration"  value="~400ms" note="Each queued task sleeps 400 ms to simulate async work, making the serial behaviour visible on the timeline." />
              </div>
            </Section>

            {/* Batch */}
            <Section id="batch" color={PATTERN_COLORS.batch} title="Batch">
              <p>
                Batching <strong className="text-zinc-200">accumulates multiple calls</strong> and
                processes them all in a single grouped execution once either a size cap or a time
                window is reached. It trades latency for efficiency.
              </p>
              <p className="text-zinc-500 italic">
                Classic use case: analytics event flushing, bulk database writes, or coalescing many
                React state updates into a single render cycle.
              </p>
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Parameters in this app</p>
                <Param label="maxSize" value="5 items"  note="The batch fires immediately once 5 items accumulate, even if the wait hasn't elapsed." />
                <Param label="wait"    value="1000ms" note="If fewer than 5 items arrive, the batch still flushes after 1 second." />
              </div>
            </Section>
          </div>

          <hr className="border-zinc-800" />

          {/* ── 3. Deep-dive video ── */}
          <section>
            <h3 className="text-base font-bold text-white mb-1">Deep Dive — Video Explanation</h3>
            <p className="text-sm text-zinc-400 mb-4">
              Watch this tutorial to understand all five patterns in depth with real-world examples.
            </p>

            {
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-zinc-800 shadow-xl">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/P83xAK8apLU?rel=0&modestbranding=1`}
                  title="Execution Timing Patterns — Deep Dive"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            }
          </section>

        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-3 border-t border-zinc-800 shrink-0 flex items-center justify-between">
          <p className="text-xs text-zinc-600">
            Built by{' '}
            <a
              href="https://youtube.com/@tapasadhikary"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 transition-colors"
            >
              tapaScript
            </a>
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/atapas/execution-timing-simulator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg font-medium cursor-pointer"
            >
              <GithubIcon className="w-3.5 h-3.5 text-teal-400" />
              <span>Contribute on GitHub</span>
            </a>
            <button
              onClick={onClose}
              className="text-xs text-zinc-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-800 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
