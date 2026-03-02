import { createSignal } from 'solid-js';

import { Button, DatePicker, DatePickerProvider, Popover, type DateValue } from '@kayou/ui';

export default function PopoverPreview() {
  const [date, setDate] = createSignal<DateValue>({});

  return (
    <DatePickerProvider locale="en-US">
    <div class="flex min-h-screen items-center justify-center p-8">
      <Popover
        content={
          <div class="flex flex-col gap-3 p-4">
            <p class="text-sm font-medium">First popover</p>
            <p class="text-sm text-neutral-500">This popover contains another popover.</p>
            <Popover
              content={
                <div class="p-4">
                  <p class="mb-2 text-sm font-medium">Pick a date</p>
                  <DatePicker
                    type="single"
                    locale="en-US"
                    value={date()}
                    onChange={setDate}
                    placeholder="Select a date"
                  />
                </div>
              }
              position="right"
              aria-label="Nested popover"
            >
              <Button color="theme" size="sm">
                Open nested
              </Button>
            </Popover>
          </div>
        }
        position="bottom"
        aria-label="Outer popover"
      >
        <Button>Open popover</Button>
      </Popover>
    </div>
    </DatePickerProvider>
  );
}
