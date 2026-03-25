/**
 * Centred, yellow-underline-decorated section title rendered as an `<h2>`.
 * Intended for use at the top of each major content section on a page.
 *
 * @param props.sectionName - The heading text to display.
 */
export function SectionHeading({ sectionName }: { sectionName: string }) {
  return (
    <div className="mb-8 text-4xl font-semibold">
      <h2 className="decoration-yellow text-center underline decoration-3 underline-offset-12">{sectionName}</h2>
    </div>
  );
}
