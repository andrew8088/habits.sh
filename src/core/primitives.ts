import { Either, Just, Left, Nothing, Right } from "purify-ts";

export function defined<T>(t: T | null | undefined) {
  return t != null ? Just(t) : Nothing;
}

export function jsonParse(json: string): Either<unknown, unknown> {
  try {
    return Right(JSON.parse(json));
  } catch (err) {
    return Left(err);
  }
}
