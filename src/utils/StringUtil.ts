export const removeExtension = (file: string, extension: string): string => {
  // Extension example - .ts
  const trimSize = extension.length;
  return file.substring(0, file.length - trimSize);
};
