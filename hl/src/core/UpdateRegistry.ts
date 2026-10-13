/**
 * The application's ordered per-frame update list.
 *
 * Every system that needs to run each frame registers here rather than
 * attaching its own callback to the ticker. That is the whole point: with one
 * registry the order in which progression, scene updates and rendering happen
 * is specified, and with several ticker callbacks it is incidental.
 *
 * Deliberately not an event bus, not an ECS, and not a plugin framework. It is
 * an array that stays sorted and iterates safely.
 */

/** A system that runs once per frame. */
export interface UpdateSystem {
  /** Stable, unique identifier. Used to unregister and to catch duplicates. */
  readonly id: string;
  /** Lower runs earlier. See `UpdateOrder` for the agreed slots. */
  readonly order: number;
  /**
   * @param delta   Seconds since the previous frame, already clamped.
   * @param elapsed Seconds since the app started, being the sum of the deltas
   *                the systems have actually been given.
   */
  update(delta: number, elapsed: number): void;
}

/**
 * Agreed ordering slots. These are positions in the frame, not systems: none of
 * them exists yet. They are spaced so a system can sit between two of them
 * without renumbering anything.
 */
export const UpdateOrder = {
  /** Pointer, wheel, touch and keyboard sampling. Runs before anything reads it. */
  Input: 100,
  /** Time-driven animation: progression easing, mixers, timelines. */
  Animation: 200,
  /** Scene reaction to the values the two above have settled. */
  Scene: 300,
  /** Anything that must run after the scene is final but before the draw. */
  Post: 400,
  /** Diagnostics. Always last, and never load-bearing. */
  Debug: 900,
} as const;

export type UpdateOrderSlot = (typeof UpdateOrder)[keyof typeof UpdateOrder];

interface Entry {
  readonly system: UpdateSystem;
  /** Registration sequence, used only to break ties on equal `order`. */
  readonly seq: number;
}

function compare(a: Entry, b: Entry): number {
  // Equal orders fall back to registration sequence, so the result is a total
  // order and never depends on the sort implementation.
  return a.system.order - b.system.order || a.seq - b.seq;
}

export class UpdateRegistry {
  private readonly entries: Entry[] = [];

  /**
   * Mutations that arrived while `update()` was iterating. Applying them
   * immediately would shift the array under the loop.
   */
  private readonly pendingAdd: UpdateSystem[] = [];
  private readonly pendingRemove: string[] = [];

  private iterating = false;
  private seq = 0;

  get size(): number {
    return this.entries.length;
  }

  has(id: string): boolean {
    return this.indexOf(id) !== -1;
  }

  /** Ids in the order they will run. Allocates, so it is for tests and tools. */
  order(): string[] {
    return this.entries.map((entry) => entry.system.id);
  }

  /**
   * Add a system. Returns a function that removes it again, which is usually
   * more convenient at the call site than remembering the id.
   *
   * Registering during `update()` is safe: the system joins the next frame, not
   * the one in progress.
   */
  register(system: UpdateSystem): () => void {
    // Validated here rather than when a deferred add is applied, so the error
    // carries the stack of whoever registered rather than the stack of the
    // frame that happened to flush it.
    if (this.isTaken(system.id)) {
      throw new Error(`[heloria] Update system already registered: ${system.id}`);
    }

    if (this.iterating) {
      this.pendingAdd.push(system);
      return () => this.unregister(system.id);
    }

    this.entries.push({ system, seq: this.seq++ });
    // Sorted on mutation, never per frame.
    this.entries.sort(compare);

    return () => this.unregister(system.id);
  }

  /**
   * Remove a system by id. Safe to call from inside its own `update()`: the
   * removal is applied once the frame finishes.
   */
  unregister(id: string): boolean {
    if (this.iterating) {
      // Cancel a deferred add for the same id, so the disposer returned by a
      // mid-frame `register` works within that same frame.
      const queued = this.pendingAdd.findIndex((system) => system.id === id);
      if (queued !== -1) {
        this.pendingAdd.splice(queued, 1);
        return true;
      }
      const present = this.has(id);
      if (present) this.pendingRemove.push(id);
      return present;
    }

    const index = this.indexOf(id);
    if (index === -1) return false;
    this.entries.splice(index, 1);
    return true;
  }

  /**
   * Run every system in ascending order.
   *
   * No allocation: the array is already sorted and is iterated in place.
   */
  update(delta: number, elapsed: number): void {
    this.iterating = true;
    try {
      for (let i = 0; i < this.entries.length; i++) {
        this.entries[i]!.system.update(delta, elapsed);
      }
    } finally {
      this.iterating = false;
      this.flush();
    }
  }

  /** Drop every system. Used by application teardown. */
  clear(): void {
    if (this.iterating) {
      // Teardown from inside a frame: queue every current id, then let the
      // loop unwind and `flush` apply it.
      for (let i = 0; i < this.entries.length; i++) {
        this.pendingRemove.push(this.entries[i]!.system.id);
      }
      this.pendingAdd.length = 0;
      return;
    }
    this.entries.length = 0;
    this.pendingAdd.length = 0;
    this.pendingRemove.length = 0;
  }

  private flush(): void {
    if (this.pendingRemove.length > 0) {
      for (let i = 0; i < this.pendingRemove.length; i++) {
        const index = this.indexOf(this.pendingRemove[i]!);
        if (index !== -1) this.entries.splice(index, 1);
      }
      this.pendingRemove.length = 0;
    }

    if (this.pendingAdd.length > 0) {
      // No duplicate check here: `register` already rejected conflicts, and
      // removals above have freed any id that was being replaced this frame.
      for (let i = 0; i < this.pendingAdd.length; i++) {
        this.entries.push({ system: this.pendingAdd[i]!, seq: this.seq++ });
      }
      this.pendingAdd.length = 0;
      this.entries.sort(compare);
    }
  }

  /**
   * Whether an id is spoken for, counting queued additions and discounting
   * queued removals, so unregister-then-register inside one frame is a replace
   * rather than a conflict.
   */
  private isTaken(id: string): boolean {
    if (this.indexOf(id) !== -1 && !this.pendingRemove.includes(id)) return true;
    for (let i = 0; i < this.pendingAdd.length; i++) {
      if (this.pendingAdd[i]!.id === id) return true;
    }
    return false;
  }

  private indexOf(id: string): number {
    for (let i = 0; i < this.entries.length; i++) {
      if (this.entries[i]!.system.id === id) return i;
    }
    return -1;
  }
}
