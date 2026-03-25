'use client';

import { useState } from 'react';

import { FormField } from './form-field';
import { Toast } from './toast';
import { YesNoRadioGroup } from './yes-no-radio-group';

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Quote request form that submits to Web3Forms without requiring a backend
 * server, making it compatible with a static export. Displays a {@link Toast}
 * notification on success or failure. The form resets automatically after a
 * successful submission.
 *
 * @param props.action - The Web3Forms API endpoint URL.
 * @param props.accessKey - Web3Forms access key that routes submissions to the configured email address.
 * @see https://flowbite.com/docs/components/forms/#floating-labels
 */
export function ContactForm({ action, accessKey }: { action: string; accessKey: string }) {
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: { preventDefault(): void; currentTarget: HTMLFormElement }) => {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: accessKey, ...data }),
      });
      const json = await res.json();

      if (json.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      {(status === 'success' || status === 'error') && (
        <div className="fixed right-6 bottom-6 z-50">
          <Toast
            type={status === 'success' ? 'success' : 'danger'}
            message={
              status === 'success'
                ? "Your quote request has been sent! We'll be in touch soon."
                : 'Something went wrong. Please try again or call us directly.'
            }
            onClose={() => setStatus('idle')}
          />
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <div>
          <div className="grid md:grid-cols-2 md:gap-6">
            <FormField name="first_name" id="first_name" label="First name" />
            <FormField name="last_name" id="last_name" label="Last name" />
          </div>
          <FormField name="email" id="email" type="email" label="Email address" />
          <FormField
            name="phone"
            id="phone"
            type="tel"
            label="Phone number"
            title="Enter a valid UK phone number (e.g. 07700 900123 or +44 7700 900123)"
            pattern="(\+44|0)[\d\s\-]{9,14}"
          />
          <FormField name="from_location" id="from_location" label="From street address &amp; post code" />
          <FormField name="to_location" id="to_location" label="To street address &amp; post code" />
          <div className="grid md:grid-cols-2 md:gap-6">
            <FormField name="vehicle_reg" id="vehicle_reg" label="Vehicle reg" />
            <FormField name="vehicle_make_and_model" id="vehicle_make_and_model" label="Vehicle make &amp; model" />
          </div>
        </div>

        <div>
          <YesNoRadioGroup name="vehicle_rolls" label="Does the vehicle roll?" />
          <YesNoRadioGroup name="vehicle_starts_and_drives" label="Does the vehicle start and drive?" />
          <YesNoRadioGroup name="vehicle_neutral" label="Does the vehicle go into neutral?" />

          {/* Additional Information */}
          <div className="group relative z-0 mb-5 w-full">
            <textarea
              id="message"
              name="message"
              rows={3}
              className="bg-neutral-secondary-medium border-default-medium text-heading text-normal rounded-base focus:ring-yellow focus:border-yellow placeholder:text-heading block w-full border p-3.5 shadow-xs"
              placeholder="Any additional information"
            ></textarea>
          </div>
          {/* End Additional Information */}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-brand hover:bg-brand-light focus:ring-yellow rounded-base text-normal box-border border border-transparent px-4 py-2.5 leading-5 font-medium text-white shadow-xs focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'loading' ? 'Sending…' : 'Request quote'}
          </button>
          {/* End Submit */}
        </div>
      </form>
    </>
  );
}
