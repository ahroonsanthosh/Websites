# 06 Hand and flower mechanical feasibility

**Audit only. The interaction was not built and nothing was modified.**

Question: can the current assets technically support
DRAW CIRCLE → CLOSED HAND → HOLD → HAND OPENS → FLOWER REVEALED → FLOWER BLOOMS?

Short answer: **yes, mechanically**. The transport layer works. The defects are
in presentation, not in structure.

---

## 1. Attachment chain, as exported

Read from the GLB node graph:

```
Heloria_Hand_Rig  (scale 0.01, cm master -> m web asset)
└─ radius_ulna
   └─ midd_meta                      <- animated, 150-channel clip
      └─ HeloriaFlowerAnchor         <- static local transform
         └─ Heloria_Flower_Rig       (scale 1.15)
            ├─ flower_root           <- animated
            └─ Heloria_Flower        (skinned, 4 primitives)
```

This is exactly the intended structure and it survived export intact. The anchor
is a real node in the hierarchy under the palm joint, not a baked offset, so a
runtime consumer can read it, reparent from it, or attach anything else to it.

**The flower cannot detach or float**, because it is not positioned by
animation; it is positioned by parenting. There is no constraint to solve at
runtime and nothing to desynchronise.

---

## 2. Measured continuity

Anchor world position sampled in the browser at fourteen points:

| p | anchor (m) | step |
| --- | --- | --- |
| 0.00 | (-0.0270, 0.0752, 0.0443) | |
| 0.05 | (-0.0270, 0.0752, 0.0443) | 0.0000 |
| 0.10 | (-0.0270, 0.0752, 0.0443) | 0.0000 |
| 0.15 | (-0.0270, 0.0752, 0.0443) | 0.0000 |
| 0.20 | (-0.0270, 0.0753, 0.0441) | 0.0002 |
| 0.25 | (-0.0272, 0.0757, 0.0437) | 0.0006 |
| 0.30 | (-0.0274, 0.0766, 0.0428) | 0.0013 |
| 0.40 | (-0.0284, 0.0794, 0.0395) | 0.0044 |
| 0.50 | (-0.0293, 0.0822, 0.0358) | 0.0047 |
| 0.60 | (-0.0299, 0.0839, 0.0332) | 0.0032 |
| 0.70 | (-0.0301, 0.0844, 0.0324) | 0.0010 |
| 0.80 | (-0.0301, 0.0844, 0.0324) | 0.0000 |
| 0.90 | (-0.0301, 0.0844, 0.0324) | 0.0000 |
| 1.00 | (-0.0301, 0.0844, 0.0324) | 0.0000 |

Total travel 14.2 mm, strictly monotonic, with a smooth acceleration and
deceleration and **no discontinuity anywhere**. There is no jump, no snap and no
reversal. The flower moves with the palm as the palm uncups, which is the
behaviour the interaction needs.

The flat regions before 0.15 and after 0.70 are the synchronisation curve
working as designed: the hand has not started, then the hand has finished and
the flower is still blooming.

---

## 3. Animation independence and scrubbing

| Property | Finding |
| --- | --- |
| Clip count | 1 |
| Duration | 6.25 s (150 frames at 24 fps) |
| Channels | 150 |
| Skins | 2 (21 hand joints, 29 flower joints) |
| Hand channels | 51 F-curves in the master, baked on export |
| Flower channels | 117 F-curves in the master, baked on export |

Both rigs are inside **one clip**, which means a single `AnimationMixer` time
drives the whole system from one number. That is precisely the shape the
interaction needs, and it matches the benchmark's stated architecture: one value
drives everything.

Scrubbing was verified in the browser across fourteen points in both directions.

### One implementation trap, already found and documented

`mixer.setTime(t)` **does not work** for scrubbing a paused action: it resets
every action's time to zero and then advances by the delta, which for a paused
action is zero. The working pattern, in `src/dev/hand-flower-test.ts`, is:

```ts
action.time = clamped * duration;
mixer.update(0);
```

This is recorded because it is a silent failure: the asset loads, the pose
renders, and the value simply never changes. It cost one debugging cycle in
this project already.

---

## 4. Timing map, as exported

From `tools/build_hand_flower.py`, the `SYNC` table, and confirmed by the
measured openness in doc 05:

| p | hand openness | flower openness |
| --- | --- | --- |
| 0.00 | 0.000 | 0.000 |
| 0.15 | 0.035 | 0.000 |
| 0.30 | 0.230 | 0.000 |
| 0.45 | 0.480 | 0.055 |
| 0.60 | 0.700 | 0.260 |
| 0.75 | 0.870 | 0.560 |
| 0.90 | 0.975 | 0.860 |
| 1.00 | 1.000 | 1.000 |

The hand leads throughout. The flower does not move at all until the hand is
nearly half open, and is still blooming after the hand has settled. **The
required lag is present and measurable**, and it is the part of the intended
choreography that is working best.

---

## 5. Deficiencies

### D-01 The flower intersects the hand at p 0.00 and 0.25

- **PROBLEM:** 168 flower vertices (2.4%) are inside the hand mesh at closed,
  up to 4.8 mm deep; 123 vertices at 0.25. Measured with a BVH nearest-surface
  normal test, not estimated.
- **WHY IT MATTERS:** it violates a stated acceptance criterion, and it is the
  kind of defect that stays invisible until one camera or pose change exposes
  it.
- **HOW IT WILL AFFECT THREE.JS:** the hand material has subsurface in Blender
  and will eventually have some approximation of it on the web. Geometry sitting
  inside a scattering surface reads as a bruise. It will also break the moment a
  contact shadow or screen-space AO pass is added, because occlusion will be
  computed from geometry that should not be there.
- **REQUIRED FIX BEFORE WEB INTEGRATION:** close the hand further so the cavity
  actually contains the bud (doc 04 P-02), or shrink the bud in the closed
  state. Re-run the BVH penetration test as the acceptance check; it is already
  written and gives a hard number.

### D-02 Concealment depends on the camera, not on the geometry

- **PROBLEM:** from the Blender cinematic camera the flower is hidden at p 0;
  from a three-quarter camera in the browser it is visible between the middle
  and ring fingers.
- **WHY IT MATTERS:** the reveal only lands if there was nothing to see before
  it.
- **HOW IT WILL AFFECT THREE.JS:** any camera choreography, any pointer-driven
  parallax, any responsive framing change at a different aspect ratio can expose
  it. A fix at the pose level is robust; a fix at the camera level is not.
- **REQUIRED FIX BEFORE WEB INTEGRATION:** treat "hidden from every camera in
  the intended envelope" as the criterion, and verify it by rendering the closed
  state from several angles rather than one.

### D-03 The midpoint of the reveal is unreadable

- **PROBLEM:** at p 0.50 the flower renders as a crumpled mass (doc 05 F-03).
- **WHY IT MATTERS:** the task specifies 0.50 as "first clear glimpse of the
  flower". The first glimpse is currently the worst frame in the sequence.
- **HOW IT WILL AFFECT THREE.JS:** nothing technical; it will simply look wrong
  at exactly the moment the user is being rewarded for holding.
- **REQUIRED FIX BEFORE WEB INTEGRATION:** manage petal overlap through the
  closed and early-opening range so the bud unwraps as a spiral rather than
  collapsing into itself.

### D-04 No translucency in the web asset

- **PROBLEM:** subsurface exists in Blender, not in the GLB (doc 05 F-01).
- **WHY IT MATTERS:** it is the difference between a petal and a piece of card,
  and this flower is white, which is the case where it matters most.
- **HOW IT WILL AFFECT THREE.JS:** requires either a transmission-capable
  material set up in code, or a deliberate cheat (a wrapped-lighting term in a
  custom material). Either is work that does not exist yet.
- **REQUIRED FIX BEFORE WEB INTEGRATION:** none strictly. This can follow the
  interaction. But the flower will not look finished until it is done.

### D-05 The hand's first quarter of travel is nearly static

- **PROBLEM:** 7% of the index finger's travel occurs in the first 25% of
  progress.
- **WHY IT MATTERS:** during a hold, the user's first quarter of effort produces
  almost no feedback.
- **HOW IT WILL AFFECT THREE.JS:** the hold gate will need something else to
  respond in that window (the stroke, the camera, the light, sound) or the hold
  will feel unresponsive.
- **REQUIRED FIX BEFORE WEB INTEGRATION:** none. This is a choreography decision
  to make when the hold exists, and it is recorded so it is made deliberately.

### D-06 Six draw calls, two skins, one clip

- **PROBLEM:** not a defect, a constraint to know. The flower exports as four
  separate primitives because it carries four materials, so hand plus flower is
  six skinned draw calls before anything else exists.
- **WHY IT MATTERS:** it is the floor of the frame's draw-call budget.
- **REQUIRED FIX:** none now. If the budget tightens, the four flower materials
  can merge into one, since all four already carry their colour in the same
  vertex attribute.

---

## 6. Verdict

**The asset can technically support the intended interaction today.** The
hierarchy, the anchor, the single clip, the two skins and continuous scrubbing
all work and were verified in a browser.

Of the six deficiencies, **D-01, D-02 and D-03 should be closed before the
interaction is built**, because all three concern what the reveal looks like and
the interaction exists to deliver the reveal. D-04 can follow. D-05 and D-06 are
decisions to make, not defects to fix.
