# .env Alchemy Issue

I haven't been able to get Config working inside Alchemy v2

## Reproduce

1. `bun i`
1. `cd apps/api`
1. copy envs
1. `bun run dev`

Server runs successfully. Now hit it with the browser… See error?

----

Fixed by upgrading to `2.0.0-beta.47`
