export function createError(name: string): ErrorConstructor {
  return class extends Error {
    name = name;
    type = name;
  } as unknown as ErrorConstructor;
}
