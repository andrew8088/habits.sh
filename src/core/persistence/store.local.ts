import { createError } from "../error";
import type { PersistentStore } from "./store";
import { EitherAsync, Just, Maybe, Nothing, Right } from "purify-ts";

export default class LocalStore<T> implements PersistentStore<T> {
  public static KeyNotFoundError = createError("KeyNotFoundError");

  constructor(public parse: (t: unknown) => T, public prefix: string = "") {}

  get(key: string): EitherAsync<unknown, Maybe<T>> {
    const k = `${this.prefix}${key}`;
    const raw = localStorage.getItem(k);
    const maybe = (raw ? Just(raw) : Nothing).map(JSON.parse).map(this.parse);
    return EitherAsync.liftEither(Right(maybe));
  }
  set(key: string, t: T): EitherAsync<unknown, void> {
    const k = `${this.prefix}${key}`;
    localStorage.setItem(k, JSON.stringify(t));
    return EitherAsync.liftEither(Right(undefined));
  }
}
