# 04 Hand production audit

**Audit only. `assets/production/heloria-hand-flower.blend` was opened
read-only and never written to.**

Question: is the hand actually prepared for CLOSED, OPENING and OPEN, and is the
result good enough to build the opening interaction on?

---

## 1. What the master actually contains

Read from the file:

```
SCENE   Scene   frames 1-150   24 fps   engine CYCLES

Heloria_Hand         MESH      parent Heloria_Hand_Rig   mods [ARMATURE, SUBSURF]
Heloria_Hand_Nails   MESH      parent Heloria_Hand_Rig   mods [ARMATURE, SUBSURF]
Heloria_Hand_Rig     ARMATURE  action HELORIA_HAND_REVEAL
Heloria_Flower       MESH      parent Heloria_Flower_Rig mods [ARMATURE, SOLIDIFY]
Heloria_Flower_Rig   ARMATURE  parent HeloriaFlowerAnchor  action HELORIA_FLOWER_BLOOM_SYNC
HeloriaFlowerAnchor  EMPTY     parent Heloria_Hand_Rig  parent_type BONE  bone midd_meta

ACTIONS
  HELORIA_HAND_REVEAL         frames 1-150   51 F-curves
  HELORIA_FLOWER_BLOOM_SYNC   frames 1-150   117 F-curves

MATERIALS  HELORIA_SKIN, HELORIA_NAIL, HELORIA_PETAL, HELORIA_CENTRE,
           HELORIA_STEM, HELORIA_SEPAL
IMAGES     none
Subdivision on the hand: viewport 1, render 2
thumb_trapez constraints: LIMIT_ROTATION 1.0, COPY_ROTATION 0.0
```

---

## 2. Do the three named states exist?

**Partly, and not as named actions.**

| Required | Present? | Evidence |
| --- | --- | --- |
| `HAND_CLOSED` as a reachable state | **Yes** | Frame 1 of `HELORIA_HAND_REVEAL` |
| `HAND_OPENING` as reachable states | **Yes** | Every intermediate frame; verified continuous in doc 06 |
| `HAND_OPEN` as a reachable state | **Yes** | Frame 150 |
| `HELORIA_HAND_CLOSED` as an action | **No** | Not in the file |
| `HELORIA_HAND_OPEN` as an action | **No** | Not in the file |

### P-01 Named pose actions were authored but are not saved. BROKEN.

`tools/build_hand_flower.py` creates `HELORIA_HAND_CLOSED` and
`HELORIA_HAND_OPEN` (and `create_heloria_flower.py` creates
`HELORIA_FLOWER_BLOOM`). Only the two actions that were assigned to an object at
save time survive. Blender discards zero-user actions on save and no fake user
was set on the pose actions.

- **Why it matters:** the task specified those names as deliverables, and a pose
  library is the normal way to re-derive or re-time a motion later. Re-opening
  the master gives no way to snap to "closed" or "open" other than scrubbing to
  frame 1 or 150.
- **Consequence for Three.js:** none. The export uses active actions, so the web
  asset is unaffected.
- **Severity:** Medium (authoring hygiene, not a runtime defect).

---

## 3. Measured motion

Fingertip to palm-centre distance, in file units (1 unit = 1 mm), taken from
world-space bone tails at five points on `bloomProgress`:

| p | index | midd | ring | pinky | thumb |
| --- | --- | --- | --- | --- | --- |
| 0.00 | 7.17 | 7.32 | 6.36 | 6.32 | 6.07 |
| 0.25 | 7.39 | 7.42 | 6.38 | 6.34 | 6.12 |
| 0.50 | 9.94 | 10.15 | 8.72 | 7.81 | 7.06 |
| 0.75 | 10.43 | 10.92 | 10.10 | 8.85 | 8.49 |
| 1.00 | 10.43 | 10.92 | 10.16 | 8.89 | 8.52 |

### What this shows, positively

- **Finger sequencing is real and measurable.** Between p 0.50 and 0.75 the
  index has already travelled 96% of its range while the ring finger is at 78%
  and the thumb at 71%. The fingers do not move as one block, which is the
  specific failure the task warned against.
- **The opening is monotonic.** No joint reverses, so the motion is scrubbable
  in both directions without visible snapping.
- **The thumb participates**, which required zeroing its copy-rotation
  constraint. Its travel (6.07 to 8.52, +40%) is proportionally similar to the
  ring finger's, which is anatomically reasonable.
- **The wrist is stable.** `radius_ulna` carries no keys in
  `HELORIA_HAND_REVEAL`; only finger bones and `midd_meta` are animated. The
  impression that one object is being held is preserved because the frame of
  reference never moves.

### P-02 The closed hand does not close far enough

Index fingertip to palm centre goes 7.17 to 10.43, a **31% reduction** from open
to closed. A genuinely protective cupped hand brings the fingertips far closer
to the palm than that, and usually brings the fingertips and thumb into contact.

- **Evidence:** the browser render at `bloomProgress = 0` shows fingers curled
  but standing off the palm, the thumb sitting behind the fingers rather than
  across them, and clear gaps between adjacent fingers.
- **Consequence:** the closed state reads as a **loose claw**, not a hand
  protecting something. It also fails to occlude the flower (see P-03).
- **Severity:** **High.** This is the opening frame of the whole experience.
- **Cause, from the source data:** the closed pose uses about 58 to 66 degrees
  at the proximal joints and 74 to 82 at the middle joints, well inside the
  rig's published limits of 120 degrees on both. There is substantial unused
  range.

### P-03 The flower is visible through the finger gap when closed

In the Three.js output at `bloomProgress = 0` from a three-quarter camera, white
petal and green sepal are visible in the gap between the middle and ring
fingers.

- **Note:** from the Blender cinematic camera the flower *is* concealed. The
  concealment is therefore camera-dependent, which is the weaker of the two
  possible outcomes: it holds for one framing rather than for the object.
- **Consequence:** acceptance criterion 3 ("the flower is convincingly hidden
  inside the closed hand") is satisfied only for a specific camera. Any later
  camera choreography, parallax or mouse-driven camera offset can break it.
- **Severity:** **High**, because the reveal is the entire point of the
  interaction and it is undermined if the thing being revealed was already
  visible.

### P-04 A quarter of the progress range carries almost no hand motion

From p 0.00 to 0.25 the index fingertip moves 0.22 units, about 7% of its total
travel. From p 0.75 to 1.00 it moves 0.00.

- This is partly deliberate: the synchronisation table in
  `tools/build_hand_flower.py` specifies that the hand begins opening at 0.15
  and is settled by 0.90, so the flower can lag.
- **But** it means that during a hold interaction the first quarter of the user's
  input produces almost no visible response, which reads as lag rather than as
  anticipation unless something else moves in that window.
- **Severity:** Medium. It is a choreography decision to revisit when the hold
  interaction exists, not a defect in the asset.

---

## 4. Deformation quality

- **No collapse or pinching** was observed at the knuckles in any rendered
  state, at subdivision level 1 or 2.
- **No jitter.** Keys are Bezier with auto-clamped handles; the measured joint
  travel is smooth and monotonic.
- **No wrist problems.** The wrist is not animated at all.
- The visible weakness is not deformation but **silhouette detail**: at the
  knuckles the fingers read as smooth tubes, because the source mesh carries no
  knuckle topology and the absent normal map contributes nothing. Subdivision
  smooths the facets but cannot add anatomy that is not in the cage.

---

## 5. Can the hand hold an object naturally?

**Mechanically yes, visually not yet.**

- The anchor is bone-parented to `midd_meta`, which is the palm itself, so
  anything attached to it travels with the palm through the whole cupping
  motion with no runtime constraint solving. Measured anchor travel across the
  interaction is 14 mm, monotonic, with no discontinuity (doc 06).
- What is missing is everything that communicates *contact*: there is no contact
  shadow, no ambient occlusion where the stem meets the palm, and no compression
  of the skin under the object. In the current renders the flower reads as
  resting on the palm rather than being held by it.
- **Severity:** **High** for the finished shot, and it is a lighting and
  shading problem rather than a rigging one (see doc 08).

---

## 6. Comparison with Zero's hand treatment

Not a comparison of appearance. A comparison of approach.

| Dimension | Zero (CONFIRMED from the article) | Heloria now |
| --- | --- | --- |
| Lighting model | No real-time lighting on the skinned mesh at all. Lighting baked into textures, two slots crossfaded per keyframe with premultiplied alpha. | Real-time PBR under an environment map. |
| Texture strategy | All hand textures in one 4x4 atlas; each mesh takes a UV offset and scale. | Three separate 2048 maps for the hand, three 512 maps for the nails, no atlas. |
| Consequence | Fixed cost, exact match to the art, no shading uncertainty. | Higher cost, more flexibility, and every lighting decision still to be made. |
| Where Heloria is behind | Not in rigging or motion, which are sound. In **surface**: Zero's hands carry authored, art-directed lighting; Heloria's carry a procedural skin baked at export, with no subsurface in the web asset and a near-flat normal map. |

Heloria has chosen the harder path. That is a legitimate choice given that the
hand must respond to a scene the user is moving through, but it means the hand
cannot reach the benchmark's perceived quality until the material and lighting
work in doc 08 is done.

---

## 7. Verdict

**Production suitability: adequate to build the interaction on, not yet adequate
to ship in a hero shot.**

Sound: rig control, finger sequencing, thumb participation, wrist stability,
deformation, scrubbability, anchor behaviour.

Requires work before the opening interaction is considered finished, in order:

1. P-03 concealment when closed (High)
2. P-02 a genuinely closed, protective cup (High, and it largely fixes P-03)
3. Contact shadowing so the hand reads as holding rather than supporting (High,
   doc 08)
4. P-01 persist the named pose actions (Medium)
5. P-04 revisit the dead first quarter when the hold interaction exists (Medium)
