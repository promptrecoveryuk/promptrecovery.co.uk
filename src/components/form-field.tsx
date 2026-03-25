/**
 * Reusable floating-label text input for use within a `<form>`. The label
 * animates upward when the input is focused or filled. All fields are marked
 * `required` by default.
 *
 * @param props.name - The `name` attribute on the `<input>` (used as the form data key on submission).
 * @param props.id - The `id` attribute on the `<input>`, linked to the `<label>` via `htmlFor`.
 * @param props.label - The floating label text.
 * @param props.type - Input type. Defaults to `'text'`. Accepts `'text'`, `'tel'`, or `'email'`.
 * @param props.pattern - Optional HTML validation pattern applied to the input.
 * @param props.title - Optional tooltip shown when pattern validation fails.
 * @see https://flowbite.com/docs/components/forms/#floating-labels
 */
export function FormField({
  name,
  id,
  label,
  type = 'text',
  pattern,
  title,
}: {
  name: string;
  id: string;
  label: string;
  type?: 'text' | 'tel' | 'email';
  pattern?: string;
  title?: string;
}) {
  const inputClass =
    'block py-2.5 px-0 w-full text-normal text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-yellow peer';
  const labelClass =
    'absolute text-normal text-heading duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-yellow peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto';

  return (
    <div className="group relative z-0 mb-5 w-full">
      <input
        type={type}
        name={name}
        id={id}
        pattern={pattern}
        className={inputClass}
        placeholder=" "
        title={title}
        required
      />
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
    </div>
  );
}
