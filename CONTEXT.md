# HBD

Generate personalised happy birthday tracks, publish to Spotify/YouTube, collect royalties.

## Language

**Track**:
The aggregate root. Represents a generated audio track identified by hash(name+style+v). Fields: id, name, style, status, platformLinks, createdAt, updatedAt.
_Avoid_: TrackMetadata, TrackGenerationRequest (these are implementation details, not domain terms)

**StyleConfig**:
Input parameters for track generation. Fields: voice, stylised*output. Versioned as v1, v2, etc.
\_Avoid*: style payload without version

**TrackGenerationRequest**:
The queue message. Contains name + style. Workflow picks it up and creates a Track.

**Status**:
Track lifecycle state: queued | generating | available | failed

**PlatformLinks**:
{ spotify?, youtube? } — populated when track is published

## Relationships

- A **TrackGenerationRequest** enters the queue → Workflow creates a **Track**
- A **Track** has exactly one **StyleConfig**
- A **Track** may have **PlatformLinks** once published
- 1 request → 1 track → multiple platform uploads

## Design Decisions

- Anonymous generation — no user accounts, no authentication
- KV key format: `track:{name}:v{version}:{style-hash}`
- Style hash = hash of canonical style fields (voice, stylised_output)
- KV supports prefix scan for "any {name}" via `list({ prefix: "track:{name}:" })`
- Dedup via exact match on name+style hash
- Cloudflare Queue → Workflow → KV + Label Grid → platforms
- No direct HBD links — listen only via platform links
- No email notification — tracks appear on platforms, users find them there

## Out of Scope

- Content filtering (AI filters offensive names — assumed handled)
- Failure retries (Workflow handles, assumed)
- Discoverability/branding (deferred)
- User retrieval UX (none — platform only)
