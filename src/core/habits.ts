import { EitherAsync, Either, Maybe } from "purify-ts";
import LocalStore from "./persistence/store.local";
import z from "zod";

const habitSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
});

const habitIdsSchema = z.array(z.string());

export type Habit = z.infer<typeof habitSchema>;

const habitStore = new LocalStore(habitSchema.parse, "habit-");
const habitIdsStore = new LocalStore(habitIdsSchema.parse);
const habitIdsKey = "habit-ids";

export function findAll() {
  const a = habitIdsStore.get(habitIdsKey);
  const b = a.map((maybeIds) => {
    return maybeIds.map((ids) => {
      const d = ids.map((id) => habitStore.get(id));
      const e = EitherAsync.rights(d);
      const f = e.then(Maybe.catMaybes);
      return f;
    });
  });

  return b.map((habits) => habits.orDefault(Promise.resolve([]))).orDefault([]);
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
