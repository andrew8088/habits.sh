import { createSignal } from "solid-js";
import TextInput from "../components/TextInput";
import Button from "../components/button";
import t from "../utils/translate";

type AddHabitFormProps = {
  onSubmit: (habitName: string) => void;
};

export default function AddHabitForm(props: AddHabitFormProps) {
  const [habitName, setHabitName] = createSignal("");

  return (
    <div>
      <TextInput
        label={t("Habit")}
        value={habitName()}
        onInput={(e) => setHabitName(e.target.value)}
      />
      <div class="my-4">
        <Button
          onClick={() => {
            props.onSubmit(habitName());
            setHabitName("");
          }}
        >
          {t("Add Habit")}
        </Button>
      </div>
    </div>
  );
}
