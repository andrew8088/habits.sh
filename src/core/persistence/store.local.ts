import { createError } from "../error";
import type { PersistentStore } from "./store";
import { Either, EitherAsync, Just, Left, Maybe, Nothing, Right } from "purify-ts";

export default class LocalStore<T> implements PersistentStore<T> {
  public static KeyNotFoundError = createError("KeyNotFoundError");

  constructor(
    public decode: (t: unknown) => Either<string, T>,
    public prefix: string = ""
  ) { }

  get(key: string): EitherAsync<unknown, Maybe<T>> {
    const k = `${this.prefix}${key}`;
    const p = localStorageP.getItem(k).then(val => Right(val !== null ? Just(val) : Nothing)).catch(Left);
    return EitherAsync.fromPromise(() => p).map(val => invert(val.map(JSON.parse).map(this.decode))).join();
  }
  set(key: string, t: T): EitherAsync<unknown, void> {
    const k = `${this.prefix}${key}`;
    const p = localStorageP.setItem(k, JSON.stringify(t)).then(Right).catch(Left);
    return EitherAsync.fromPromise(() => p);
  }
}

const localStorageP = {
  async getItem(key: string) {
    return localStorage.getItem(key);
  },
  async setItem(key: string, value: string) {
    return localStorage.setItem(key, value);
  },
};

function invert<L, R>(value: Maybe<Either<L, R>>, e = "nothing" as const): Either<L | typeof e, Maybe<R>> {
  return value.toEither(e).join().map(Just);
}
