/**
 * Startup timing.
 *
 * The point of this module is to make the difference between "the page is
 * showing something" and "the experience is fully loaded" measurable, because
 * without marks the two get reported as one number and the wrong thing gets
 * optimised.
 *
 * It uses `performance.mark` and `performance.measure` only. Marks are cheap,
 * there are a fixed handful of them, and they survive into production where a
 * real-user-monitoring tool can read them off the performance timeline. What
 * does not survive into production is any logging: the reporting helper is
 * behind `import.meta.env.DEV` and is eliminated from the build.
 *
 * Every measure is taken from navigation start, so the numbers are directly
 * comparable with `first-paint` and the resource timeline.
 */

export const Milestone = {
  /** The entry module began executing. */
  BootStart: 'heloria:boot-start',
  /** The WebGL context exists and the renderer is configured. */
  RendererCreated: 'heloria:renderer-created',
  /** The first `renderer.render()` has returned. */
  FirstFrame: 'heloria:first-frame',
  /** A request for a non-critical asset was issued. */
  AssetLoadStart: 'heloria:asset-load-start',
  /** That asset finished transferring, parsing and decoding. */
  AssetLoadEnd: 'heloria:asset-load-end',
  /** The asset is in the scene and the experience is complete. */
  SceneReady: 'heloria:scene-ready',
} as const;

export type MilestoneName = (typeof Milestone)[keyof typeof Milestone];

/**
 * Record a milestone. The first call for a name wins, so a mark cannot be
 * moved later by a repeated code path, and calling it from a hot path costs
 * one set lookup rather than a growing timeline.
 */
const recorded = new Set<string>();

export function mark(name: MilestoneName): void {
  if (recorded.has(name)) return;
  recorded.add(name);
  performance.mark(name);
}

export function hasMark(name: MilestoneName): boolean {
  return recorded.has(name);
}

/** Milliseconds from navigation start to a milestone, or null if unrecorded. */
export function since(name: MilestoneName): number | null {
  const entries = performance.getEntriesByName(name, 'mark');
  const entry = entries[entries.length - 1];
  return entry ? entry.startTime : null;
}

export interface StartupTimeline {
  /** From the paint timeline, not from a mark of ours. */
  firstPaint: number | null;
  firstContentfulPaint: number | null;
  bootStart: number | null;
  rendererCreated: number | null;
  firstFrame: number | null;
  assetLoadStart: number | null;
  assetLoadEnd: number | null;
  sceneReady: number | null;
}

function paint(name: string): number | null {
  const entry = performance.getEntriesByName(name, 'paint')[0];
  return entry ? entry.startTime : null;
}

/** The whole picture, in milliseconds from navigation start. */
export function timeline(): StartupTimeline {
  return {
    firstPaint: paint('first-paint'),
    firstContentfulPaint: paint('first-contentful-paint'),
    bootStart: since(Milestone.BootStart),
    rendererCreated: since(Milestone.RendererCreated),
    firstFrame: since(Milestone.FirstFrame),
    assetLoadStart: since(Milestone.AssetLoadStart),
    assetLoadEnd: since(Milestone.AssetLoadEnd),
    sceneReady: since(Milestone.SceneReady),
  };
}

/**
 * Create the `performance.measure` spans so the timeline shows intervals as
 * well as instants in devtools. Named separately because measures are only
 * meaningful once the marks they span exist.
 */
export function measureSpans(): void {
  const spans: Array<[string, MilestoneName, MilestoneName]> = [
    ['heloria:boot-to-renderer', Milestone.BootStart, Milestone.RendererCreated],
    ['heloria:renderer-to-first-frame', Milestone.RendererCreated, Milestone.FirstFrame],
    ['heloria:asset-load', Milestone.AssetLoadStart, Milestone.AssetLoadEnd],
    ['heloria:first-frame-to-scene-ready', Milestone.FirstFrame, Milestone.SceneReady],
  ];
  for (const [name, start, end] of spans) {
    if (!recorded.has(start) || !recorded.has(end)) continue;
    try {
      performance.measure(name, start, end);
    } catch {
      // A measure is diagnostic. It must never be able to break startup.
    }
  }
}

/**
 * Development-only report. Eliminated from the production bundle, along with
 * the `console.table` call, by `import.meta.env.DEV`.
 */
export function reportTimeline(): void {
  if (!import.meta.env.DEV) return;
  measureSpans();
  const t = timeline();
  const row = (label: string, value: number | null): [string, string] => [
    label,
    value === null ? 'not reached' : `${value.toFixed(1)} ms`,
  ];
  console.table(
    Object.fromEntries(
      [
        row('first paint', t.firstContentfulPaint ?? t.firstPaint),
        row('boot start', t.bootStart),
        row('renderer created', t.rendererCreated),
        row('FIRST WEBGL FRAME', t.firstFrame),
        row('asset load start', t.assetLoadStart),
        row('asset load end', t.assetLoadEnd),
        row('scene ready', t.sceneReady),
      ].map(([k, v]) => [k, { 'from navigation': v }]),
    ),
  );
}
