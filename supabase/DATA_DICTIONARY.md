# Data dictionary

Enums: `treatment_type` = haircut | colour | blow_dry | nails | other

## salons
id, name, slug (used in intake link `/intake/[slug]`), created_at

## stylists
id, salon_id, name, active, created_at

## clients
id, salon_id, name, phone, created_at — unique per (salon_id, phone)

## intake_requests
id, salon_id, client_id, treatment, earliest_time, latest_time,
preferred_stylist_id (nullable), status (pending|offered|claimed|expired|cancelled),
created_at, updated_at

## cancellation_slots
id, salon_id, stylist_id (nullable), treatment, start_time, duration_minutes,
status (open|offered|filled|cancelled), created_at, updated_at

## matches
id, salon_id, slot_id, intake_request_id, status (offered|claimed|expired|declined),
claim_token (unique, used in SMS link), offered_at, expires_at (offered_at + 15 min),
responded_at, created_at

Race-condition safety: `uq_slot_single_claim` is a partial unique index on
`matches(slot_id) where status = 'claimed'` — the DB physically rejects a second
claimed row for the same slot even under concurrent requests. The claim endpoint
also wraps the update in a single conditional UPDATE (status='offered' -> 'claimed')
so only one concurrent request can win.

Claim token: random 32-byte hex string generated server-side, stored on the match
row, single-use (checked against match.status before allowing claim), embedded in
the SMS link as `/claim/[token]`. Expiry is `expires_at` (15 min from offer).
