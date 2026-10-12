import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface StrategyConfiguration {
  debounceWait: number;
  throttleWait: number;
  rateLimitCount: number;
  rateLimitWindow: number;
  batchMaxSize: number;
  batchMaxWait: number;
  queueConcurrency: number;
}

interface StrategyConfigProps {
  config: StrategyConfiguration;
  onChange: (config: StrategyConfiguration) => void;
}

interface RangeControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

function RangeControl({ label, value, min, max, step = 1, unit = '', onChange }: RangeControlProps) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center justify-between gap-3 text-xs font-medium text-zinc-300">
        {label}
        <output className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-teal-300">{value}{unit}</output>
      </span>
      <input
        aria-label={label}
        className="w-full cursor-pointer accent-teal-500"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="flex justify-between text-[10px] text-zinc-500" aria-hidden="true">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </span>
    </label>
  );
}

export function StrategyConfig({ config, onChange }: StrategyConfigProps) {
  const update = <K extends keyof StrategyConfiguration>(key: K, value: StrategyConfiguration[K]) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <Card className="w-full border-zinc-800 bg-zinc-950/40 p-4 text-zinc-100 shadow-none">
      <Accordion defaultValue={[]}>
        <AccordionItem value="strategy-settings" className="border-b-0">
          <AccordionTrigger className="py-0 hover:no-underline hover:cursor-pointer">
            <CardHeader className="flex-1 px-0">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
                Strategy settings
              </CardTitle>
              <CardDescription>
                Tune a pattern, then trigger events to see the effect.
              </CardDescription>
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent className="px-0">
            <CardContent className="px-0">
              <Accordion defaultValue={["debounce"]}>
                <AccordionItem value="debounce">
                  <AccordionTrigger className="text-zinc-200 hover:text-teal-300 hover:cursor-pointer">
                    Debounce
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <RangeControl
                      label="Wait"
                      value={config.debounceWait}
                      min={50}
                      max={3000}
                      step={50}
                      unit="ms"
                      onChange={(value) => update("debounceWait", value)}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="throttle">
                  <AccordionTrigger className="text-zinc-200 hover:text-teal-300 hover:cursor-pointer">
                    Throttle
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <RangeControl
                      label="Wait"
                      value={config.throttleWait}
                      min={50}
                      max={3000}
                      step={50}
                      unit="ms"
                      onChange={(value) => update("throttleWait", value)}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="rate-limit">
                  <AccordionTrigger className="text-zinc-200 hover:text-teal-300 hover:cursor-pointer">
                    Rate limit
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <RangeControl
                      label="Limit"
                      value={config.rateLimitCount}
                      min={1}
                      max={10}
                      onChange={(value) => update("rateLimitCount", value)}
                    />
                    <RangeControl
                      label="Window"
                      value={config.rateLimitWindow}
                      min={100}
                      max={5000}
                      step={100}
                      unit="ms"
                      onChange={(value) => update("rateLimitWindow", value)}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="batching">
                  <AccordionTrigger className="text-zinc-200 hover:text-teal-300 hover:cursor-pointer">
                    Batching
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <RangeControl
                      label="Max size"
                      value={config.batchMaxSize}
                      min={1}
                      max={20}
                      onChange={(value) => update("batchMaxSize", value)}
                    />
                    <RangeControl
                      label="Max wait"
                      value={config.batchMaxWait}
                      min={100}
                      max={5000}
                      step={100}
                      unit="ms"
                      onChange={(value) => update("batchMaxWait", value)}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="async-queue">
                  <AccordionTrigger className="text-zinc-200 hover:text-teal-300 hover:cursor-pointer">
                    Async queue
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <RangeControl
                      label="Concurrency"
                      value={config.queueConcurrency}
                      min={1}
                      max={5}
                      onChange={(value) => update("queueConcurrency", value)}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
