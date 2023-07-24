import { createStore } from "solid-js/store";
import AddHabitForm from "./ui/AddHabitForm";
import * as Habit from "./core/habits";
import t from "./utils/translate";
import { For } from "solid-js";

const [habits, setHabits] = createStore<Habit.Habit[]>([]);
Habit.findAll().then(setHabits);

export default function App() {
  const createHabit = (name: string) => {
    Habit.create(name).then((result) => {
      result.ifRight(() => {
        Habit.findAll().then(setHabits);
      });
    });
  };

  return (
    <div class="flex flex-col p-4">
      <h1 class="text-3xl font-bold text-center m-3">{t("Habit Tracker")}</h1>
      <AddHabitForm onSubmit={createHabit} />

      <hr class="my-10" />

      <h3 class="text-xl font-bold">{t("My Habits")}</h3>
      <ul class="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
        <For each={habits}>
          {(habit) => (
            <li class="flex items-center">
              <svg
                class="w-3.5 h-3.5 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              {habit.name}
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
