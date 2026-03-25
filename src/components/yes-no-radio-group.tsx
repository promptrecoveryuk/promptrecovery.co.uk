/**
 * A pair of required Yes / No radio buttons sharing a single `name` attribute,
 * preceded by a descriptive label. Used in the contact form to capture boolean
 * vehicle-condition questions (e.g. "Does the vehicle roll?").
 *
 * @param props.name - The `name` attribute shared by both radio inputs (used as the form field key on submission).
 * @param props.label - The question text displayed above the radio pair.
 */
export function YesNoRadioGroup({ name, label }: { name: string; label: string }) {
  const radioClass =
    'w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-yellow';
  const radioLabelClass = 'flex items-center h-5';
  const radioTextClass = 'ms-2 text-normal font-medium text-heading select-none';

  return (
    <>
      <p className="text-normal my-4">{label}</p>
      <div className="mb-5 flex items-start">
        <label htmlFor={`${name}_yes`} className={radioLabelClass}>
          <input name={name} id={`${name}_yes`} type="radio" value="Yes" className={radioClass} required />
          <p className={radioTextClass}>Yes</p>
        </label>
        <label htmlFor={`${name}_no`} className={`${radioLabelClass} ml-16`}>
          <input name={name} id={`${name}_no`} type="radio" value="No" className={radioClass} required />
          <p className={radioTextClass}>No</p>
        </label>
      </div>
    </>
  );
}
