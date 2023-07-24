import { Left, Right } from "purify-ts/Either";

export function defined<T>(t: T | null | undefined, Ector: ErrorConstructor) {
  if (t == null) return Left(new Ector());
  return Right(t);
}
