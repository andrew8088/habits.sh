import { children, JSXElement } from "solid-js";

type ButtonProps = {
  variant?: keyof typeof variants;
  children: JSXElement;
  onClick: (
    e: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }
  ) => void;
};

export default function Button(props: ButtonProps) {
  const style = props.variant ? variants[props.variant] : variants.dark;
  const c = children(() => props.children);

  return (
    <button type="button" class={style} onClick={props.onClick}>
      {c()}
    </button>
  );
}

const variants = {
  light: `
bg-white
border
border-gray-300
dark:bg-gray-800
dark:border-gray-600
dark:focus:ring-gray-700
dark:hover:bg-gray-700
dark:hover:border-gray-600
dark:text-white
focus:outline-none
focus:ring-4
focus:ring-gray-200
font-medium
hover:bg-gray-100
px-5
py-2.5
rounded-lg
text-gray-900
text-sm
`,

  dark: `
bg-gray-800
dark:bg-gray-800
dark:border-gray-700
dark:focus:ring-gray-700
dark:hover:bg-gray-700
focus:outline-none
focus:ring-4
focus:ring-gray-300
font-medium
hover:bg-gray-900
px-5
py-2.5
rounded-lg
text-sm
text-white
`,
} as const;
