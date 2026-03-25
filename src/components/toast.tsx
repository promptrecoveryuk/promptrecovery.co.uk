import { Check, X } from './icons';

/**
 * Controlled notification banner displayed after a form submission. Renders a
 * coloured icon badge, a message, and a close button. Visibility is managed
 * externally via the `onClose` callback.
 *
 * Dismissal is handled via React state (the `onClose` prop) rather than
 * Flowbite's `data-dismiss-target` mechanism, which requires the target element
 * to already be in the DOM when Flowbite initialises — not guaranteed for
 * dynamically rendered toasts.
 *
 * @param props.type - Colour scheme: `'success'`, `'danger'`, or `'warning'`.
 * @param props.message - Notification text displayed to the user.
 * @param props.onClose - Callback invoked when the user clicks the close button.
 * @see https://flowbite.com/docs/components/toast/#colors
 */
export function Toast({
  type,
  message,
  onClose,
}: {
  type: 'success' | 'danger' | 'warning';
  message: string;
  onClose: () => void;
}) {
  const TOAST_STYLES = {
    success: { color: 'text-fg-success', bg: 'bg-success-soft' },
    danger: { color: 'text-fg-danger', bg: 'bg-danger-soft' },
    warning: { color: 'text-fg-warning', bg: 'bg-warning-soft' },
  }[type];

  return (
    <div
      id={`toast-${type}`}
      className="text-body bg-neutral-primary-soft rounded-base border-default flex w-full max-w-sm items-center border p-4 shadow-xs"
      role="alert"
    >
      <div
        className={`inline-flex h-7 w-7 shrink-0 items-center justify-center ${TOAST_STYLES.color} ${TOAST_STYLES.bg} rounded`}
      >
        <Check className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Check icon</span>
      </div>
      <div className="ms-3 text-sm font-semibold">{message}</div>
      <button
        type="button"
        onClick={onClose}
        className="text-body hover:text-heading hover:bg-neutral-secondary-medium focus:ring-yellow ms-auto box-border flex h-8 w-8 items-center justify-center rounded border border-transparent bg-transparent text-sm leading-5 font-medium focus:ring-4 focus:outline-none"
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
