import {
  EitherAsync,
  Either,
  Maybe,
  Codec,
  string,
  date,
  GetType,
  Right,
  Left,
} from "purify-ts";
import LocalStore from "./persistence/store.local";

const habitCodec = Codec.interface({
  id: string,
  name: string,
  createdAt: date,
});

const habitIdsCodec = Codec.custom<string[]>({
  decode: (input) => {
    return Array.isArray(input) &&
      input.every((elem) => typeof elem === "string")
      ? Right(input)
      : Left("invalid");
  },
  encode: (input) => input,
});

export type Habit = GetType<typeof habitCodec>;

const habitStore = new LocalStore(habitCodec.decode, "habit-");
const habitIdsStore = new LocalStore(habitIdsCodec.decode);
const habitIdsKey = "habit-ids";

export function findAll() {
  return habitIdsStore.get(habitIdsKey).map((maybeIds) => {
    return maybeIds.map((ids) =>
      EitherAsync.rights(ids.map((id) => habitStore.get(id))).then(Maybe.catMaybes)
    )
  }).map((habits) => habits.orDefault(Promise.resolve([]))).orDefault([]);
}

export function create(name: string) {
  const habit = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date(),
  };

  return save(habit);
}

export async function save(habit: Habit) {
  return habitStore
    .set(habit.id, habit)
    .chain(() =>
      habitIdsStore
        .get(habitIdsKey)
        .map((maybeIds) => {
          const ids = maybeIds.orDefault([]);
          if (ids.includes(habit.id)) return Either.of(undefined);
          ids.push(habit.id);
          return habitIdsStore.set(habitIdsKey, ids);
        })
        .join()
    )
    .run();
}
