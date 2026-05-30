import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse";

export default Cloudflare.Worker(
	"Worker",
	{ main: import.meta.url },
	Effect.gen(function* () {
		yield* Effect.void;
		const apiKey = yield* Config.redacted("API_KEY").pipe(
			Effect.tapCause((cause) => Effect.logError(cause)),
		);

		yield* Effect.log({
			apiKey,
		});

		return {
			fetch: Effect.gen(function* () {
				yield* Effect.log({
					apiKey,
				});
				return HttpServerResponse.text("Hello, world!");
			}),
		};
	}),
);
