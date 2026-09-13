export function appendSuffixIfMissing(
  form: any,
  fieldName: string,
  suffix: string,
  checkPattern = suffix.toLowerCase(),
) {
  const currentValue = (form.getValues(fieldName) as string)?.trim() ?? "";
  if (!currentValue) return;

  if (!currentValue.toLowerCase().includes(checkPattern)) {
    form.setValue(fieldName, `${currentValue} ${suffix}`.trim(), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }
}
