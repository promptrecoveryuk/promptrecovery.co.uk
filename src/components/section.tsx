/**
 * Generic page section wrapper that applies consistent horizontal padding and
 * vertical spacing via a `<section>` element. Accepts an optional `classNames`
 * string to extend or override the default styles.
 *
 * @param props.classNames - Additional Tailwind classes merged onto the `<section>` element.
 * @param props.children - Content to render inside the section.
 */
export function Section({
  classNames = '',
  id = undefined,
  children,
}: {
  classNames?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={'px-8 py-5 ' + classNames}>
      {children}
    </section>
  );
}
