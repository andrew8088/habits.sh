type TextInputProps = {
  label: string;
  onInput: (
    e: InputEvent & {
      target: HTMLInputElement;
      currentTarget: HTMLInputElement;
    }
  ) => void;
  value: string;
};

export default function TextInput(props: TextInputProps) {
  const id = props.label.toLowerCase().replace(" ", "_");

  return (
    <div>
      <label
        for={id}
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {props.label}
      </label>
      <input
        onInput={props.onInput}
        type="text"
        id={id}
        value={props.value}
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
  );
}
