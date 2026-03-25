import { Faq } from '@/types';

import { CircleHelp } from './icons';

/**
 * Renders a single FAQ entry as a question/answer pair with a help-circle icon
 * aligned to the left of the question text.
 *
 * @param props.faq - FAQ data object containing `question` and `answer` strings.
 * @see https://preline.co/examples/faq-sections.html#faq-simple-with-divider-and-icon
 */
export function FaqItem({ faq }: { faq: Faq }) {
  return (
    <div className="py-8 first:pt-0 last:pb-0">
      <div className="flex gap-x-5">
        <CircleHelp className="text-muted-foreground-1 mt-1 size-6 shrink-0" aria-hidden="true" />

        <div className="grow">
          <h3 className="text-foreground decoration-yellow font-semibold underline decoration-3 underline-offset-8 md:text-lg">
            {faq.question}
          </h3>
          <p className="text-navy mt-4">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}
