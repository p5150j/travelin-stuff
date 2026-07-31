// Lets Node resolve the extensionless relative imports the project uses
// (`./VideoNode`), which Turbopack handles natively but Node's ESM resolver does
// not. Test tooling only — no project source depends on this.
export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (err) {
    if (specifier.startsWith(".") || specifier.startsWith("/")) {
      for (const ext of [".ts", ".tsx", "/index.ts"]) {
        try {
          return await next(specifier + ext, context);
        } catch {
          // try the next candidate
        }
      }
    }
    throw err;
  }
}
