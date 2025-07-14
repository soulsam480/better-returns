import dts from "bun-plugin-dts";

await Bun.build({
	entrypoints: ["./src/option.ts", "./src/result.ts"],
	outdir: "./dist",
	plugins: [dts()],
});
