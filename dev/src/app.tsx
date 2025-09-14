import type { Component } from 'solid-js';

import {
  Alert, Button,
  Checkbox,
  DatePicker,
  NumberInput,
  Popover,
  Select,
  TextInput, Textarea
} from '../../src';
import { DatePickerProvider } from '../../src/context/DatePickerContext';
import { useToast } from '../../src/hooks/useToast';
import { InformationCircleIcon } from '../../src/icons';



const App: Component = () => {

            const toast = useToast();

  return (
    // <IntlProvider locale="en" messages={{}}>
    //   <ThemeProvider>
        <DatePickerProvider locale="fr">
    <>
      <div class="flex max-w-sm flex-col gap-4 p-8">
        <Button color="dark">I'm a button</Button>
        <NumberInput
          onChange={(e) => console.log(e.target.value)}
          step={0.5}
          label="Nombre floatant"
          helperText="Un helper text"
          required={true}
          type="float"
          allowNegativeValues={true}
        />
        <TextInput
          addon="CFA"
          label="Label"
          onChange={(e) => console.log(e.target.value)}
          helperText="Un helper text"
        />
        <Textarea
          label="Label"
          onChange={(e) => console.log(e.target.value)}
          helperText="Un helper text"
          color="info"
        />
        <Select
          color="info"
          sizing="md"
          helperText="Choose an option"
          options={[
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            { label: 'Option 3', value: '3' },
          ]}
        />
        <Checkbox label="Checkbox" />
        {/* <div class="fixed right-4 bottom-4 z-50 w-fit">
          <Tooltip content="This is a tooltip" style="auto">
            <Button color="dark">me</Button>
          </Tooltip>
        </div> */}
        <Popover
          position="top"
          content={
            <div class="p-2">
              <div class="flex cursor-pointer items-center gap-1 rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                Cool Vas-y
              </div>
            </div>
          }
        >
          <div class="cursor-pointer rounded border px-1.5 text-center tracking-wider dark:border-gray-700">
            ···
          </div>
        </Popover>
      </div>

      <div class="mb-16 max-w-sm p-8 text-sm">
        <DatePicker
          type="single"
          locale="fr"
          displayFormat="DD/MM/YYYY"
          value={{
            multipleDates: ['2025-09-24', '2025-09-25', '2025-09-19'],
            // date: '2024-06-01',
            // endDate: '2025-09-30',
          }}
          onChange={(newValue) => {
            // setDate(newValue?.date as string);
            console.log('Selected:', newValue);
          }}
          popoverPosition="bottom"
          // minDate="2025-09-07"
          // maxDate="2025-09-20"
        />
        </div>
          <div>On a beaucoup de toasts</div>
          <Button onClick={() => {
            toast.success('This is a success message!');
          }}>
            Show Success Toast
          </Button>

      <div class="max-w-lg p-8">
        <Alert color="failure" icon={InformationCircleIcon}>
          <div>
            <div>This is an alert — check it out!</div>
            {/* <div>This is an alert — check it out!</div>
            <div>This is an alert — check it out!</div> */}
          </div>
        </Alert>
      </div>
    </>

    </DatePickerProvider>
    //   </ThemeProvider>
    // </IntlProvider>
  );
};

export default App;
