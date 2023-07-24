import { createError } from "../error";
import { defined, jsonParse } from "../primitives";
import type { PersistentStore } from "./store";
import { Either, EitherAsync, Maybe, Right } from "purify-ts";

export default class LocalStore<T> implements PersistentStore<T> {
  public static KeyNotFoundError = createError("KeyNotFoundError");

  constructor(
    public decode: (t: unknown) => Either<string, T>,
    public prefix: string = ""
  ) {}

  get(key: string): EitherAsync<unknown, Maybe<T>> {
    const k = `${this.prefix}${key}`;
    const maybe = defined(localStorage.getItem(k))
      .map(JSON.parse)
      .map(this.decode)
      .chain((x) => x.toMaybe()); // lost the error
    return EitherAsync.liftEither(Right(maybe));
  }
  set(key: string, t: T): EitherAsync<unknown, void> {
    const k = `${this.prefix}${key}`;
    localStorage.setItem(k, JSON.stringify(t));
    return EitherAsync.liftEither(Right(undefined));
  }
}
