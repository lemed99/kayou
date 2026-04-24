import { createRoot } from 'solid-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const formContextMock = vi.hoisted(() => ({
  get: vi.fn(),
  save: vi.fn(),
  clear: vi.fn(),
}));

vi.mock('../context/FormContext', () => ({
  useFormContext: () => formContextMock,
}));

import { useForm, type UseFormOptions, type UseFormReturn } from '../hooks/useForm';

function createTestForm<T extends Record<string, unknown>>(
  options: UseFormOptions<T>,
): { form: UseFormReturn<T>; dispose: () => void } {
  let form!: UseFormReturn<T>;
  let dispose!: () => void;

  createRoot((rootDispose) => {
    dispose = rootDispose;
    form = useForm(options);
  });

  return { form, dispose };
}

function createInputEvent({
  checked = false,
  type = 'text',
  value = '',
}: {
  checked?: boolean;
  type?: string;
  value?: string;
} = {}): Event {
  const target = document.createElement('input');
  target.type = type;

  if (type === 'checkbox') {
    target.checked = checked;
  } else {
    target.value = value;
  }

  return { currentTarget: target } as unknown as Event;
}

function createNestedForm(
  overrides: Partial<UseFormOptions<{
    name: string;
    units: { name: string; conversion_factor: number; is_reference: boolean }[];
  }>> = {},
) {
  return createTestForm({
    initialValues: {
      name: '',
      units: [{ name: '', conversion_factor: 1, is_reference: true }],
    },
    validate: (values) => {
      const errors: Record<string, string | undefined> = {};

      if (!values.name.trim()) {
        errors.name = 'Name is required';
      }

      if (!values.units[0]?.name.trim()) {
        errors['units.0.name'] = 'Unit name is required';
      }

      if (
        typeof values.units[0]?.conversion_factor !== 'number' ||
        Number.isNaN(values.units[0]?.conversion_factor) ||
        values.units[0]!.conversion_factor <= 0
      ) {
        errors['units.0.conversion_factor'] = 'Conversion factor must be positive';
      }

      return errors;
    },
    onSubmit: vi.fn(),
    ...overrides,
  });
}

async function flushMicrotask() {
  await Promise.resolve();
}

describe('useForm', () => {
  beforeEach(() => {
    formContextMock.get.mockReset();
    formContextMock.get.mockReturnValue(undefined);
    formContextMock.save.mockReset();
    formContextMock.clear.mockReset();
  });

  it('keeps the top-level API behavior unchanged', () => {
    const { form, dispose } = createTestForm({
      initialValues: { name: '' },
      validate: (values) => ({
        name: values.name.trim() ? undefined : 'Name is required',
      }),
      onSubmit: vi.fn(),
      validateOn: 'blur',
    });

    try {
      form.handleChange('name')(createInputEvent({ value: 'Ada' }));
      expect(form.values.name).toBe('Ada');
      expect(form.fieldError('name')).toBeUndefined();

      form.handleChange('name')(createInputEvent({ value: '' }));
      form.handleBlur('name')();

      expect(form.fieldError('name')).toBe('Name is required');
      expect(form.fieldColor('name')).toBe('failure');
    } finally {
      dispose();
    }
  });

  it('updates nested values reactively through setValues', () => {
    const { form, dispose } = createNestedForm();

    try {
      form.setValues('units', 0, 'name', 'kg');
      expect(form.values.units[0].name).toBe('kg');
    } finally {
      dispose();
    }
  });

  it('parses nested text inputs with handleChangeAt', () => {
    const { form, dispose } = createNestedForm();

    try {
      form.handleChangeAt('units', 0, 'name')(createInputEvent({ value: 'kg' }));
      expect(form.values.units[0].name).toBe('kg');
    } finally {
      dispose();
    }
  });

  it('parses nested number inputs with handleChangeAt', () => {
    const { form, dispose } = createNestedForm();

    try {
      form.handleChangeAt('units', 0, 'conversion_factor')(
        createInputEvent({ type: 'number', value: '2.5' }),
      );
      expect(form.values.units[0].conversion_factor).toBe(2.5);
    } finally {
      dispose();
    }
  });

  it('marks exact nested paths as touched on blur and only then shows nested errors', () => {
    const { form, dispose } = createNestedForm({ validateOn: 'blur' });
    const path = ['units', 0, 'name'] as const;

    try {
      form.validateForm();
      expect(form.fieldErrorAt(path)).toBeUndefined();

      form.handleBlurAt(...path)();

      expect(form.fieldErrorAt(path)).toBe('Unit name is required');
      expect(form.fieldColorAt(path)).toBe('failure');
    } finally {
      dispose();
    }
  });

  it('surfaces exact nested validation errors from validate()', () => {
    const { form, dispose } = createNestedForm();
    const path = ['units', 0, 'name'] as const;

    try {
      expect(form.validateForm()['units.0.name']).toBe('Unit name is required');

      form.setTouchedAt(path);
      expect(form.fieldErrorAt(path)).toBe('Unit name is required');
    } finally {
      dispose();
    }
  });

  it('returns nested server errors through fieldErrorAt', () => {
    const { form, dispose } = createNestedForm();
    const path = ['units', 0, 'name'] as const;

    try {
      form.setTouchedAt(path);
      form.setErrors({ 'units.0.name': 'Required' });

      expect(form.fieldErrorAt(path)).toBe('Required');
    } finally {
      dispose();
    }
  });

  it('keeps fieldError(name) working for top-level fields', () => {
    const { form, dispose } = createNestedForm();

    try {
      form.setErrors({ name: 'Top-level error' });
      expect(form.fieldError('name')).toBeUndefined();

      form.setTouched('name');
      expect(form.fieldError('name')).toBe('Top-level error');
    } finally {
      dispose();
    }
  });

  it('validates nested paths on change when validateOn is change', () => {
    const { form, dispose } = createNestedForm({ validateOn: 'change' });
    const path = ['units', 0, 'name'] as const;

    try {
      form.handleChangeAt(...path)(createInputEvent({ value: '' }));

      expect(form.fieldErrorAt(path)).toBe('Unit name is required');
    } finally {
      dispose();
    }
  });

  it('validates nested paths on blur when validateOn is blur', () => {
    const { form, dispose } = createNestedForm({ validateOn: 'blur' });
    const path = ['units', 0, 'name'] as const;

    try {
      form.handleChangeAt(...path)(createInputEvent({ value: '' }));
      expect(form.fieldErrorAt(path)).toBeUndefined();

      form.handleBlurAt(...path)();
      expect(form.fieldErrorAt(path)).toBe('Unit name is required');
    } finally {
      dispose();
    }
  });

  it('batches persisted writes into a single save', async () => {
    const { form, dispose } = createNestedForm({ id: 'persisted-form' });

    try {
      form.setValue('name', 'Ada');
      form.setValues('units', 0, 'name', 'kg');
      form.replaceAllValues({
        name: 'Grace',
        units: [{ name: 'gram', conversion_factor: 1, is_reference: true }],
      });

      expect(formContextMock.save).not.toHaveBeenCalled();

      await flushMicrotask();

      expect(formContextMock.save).toHaveBeenCalledTimes(1);
      expect(formContextMock.save).toHaveBeenCalledWith('persisted-form', {
        name: 'Grace',
        units: [{ name: 'gram', conversion_factor: 1, is_reference: true }],
      });
    } finally {
      dispose();
    }
  });

  it('cancels queued persistence when reset clears the draft', async () => {
    const { form, dispose } = createNestedForm({ id: 'persisted-form' });

    try {
      form.setValue('name', 'Ada');
      form.reset();

      await flushMicrotask();

      expect(formContextMock.clear).toHaveBeenCalledTimes(1);
      expect(formContextMock.clear).toHaveBeenCalledWith('persisted-form');
      expect(formContextMock.save).not.toHaveBeenCalled();
    } finally {
      dispose();
    }
  });
});
