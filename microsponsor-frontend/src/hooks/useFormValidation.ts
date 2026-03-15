import { useState, useCallback } from 'react';

type Rules<T> = Partial<Record<keyof T, (value: string, form: T) => string | undefined>>;

export function useFormValidation<T extends Record<string, string>>(
  initialValues: T,
  rules: Rules<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setValue = useCallback((field: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    for (const field of Object.keys(rules) as (keyof T)[]) {
      const rule = rules[field];
      if (rule) {
        const error = rule(values[field] ?? '', values);
        if (error) newErrors[field] = error;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, rules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return { values, errors, setValue, validate, reset, setErrors };
}
