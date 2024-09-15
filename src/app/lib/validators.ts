export const validatePositiveValue = (value: number, name: string) => {
  if (value < 0) {
    throw new Error(`Invalid ${name}. Please use a value greater than zero`);
  }
};
