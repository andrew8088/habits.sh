import { EitherAsync, Maybe } from "purify-ts";

export type PersistentStore<T> = {
  get(id: string): EitherAsync<unknown, Maybe<T>>;
  set(id: string, t: T): EitherAsync<unknown, void>;
  parse(t: unknown): T;
};
