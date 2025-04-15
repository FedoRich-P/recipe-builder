export function createFileList(files: File[]): FileList | null {
  const dataTransfer = new DataTransfer();
  files.forEach(file => dataTransfer.items.add(file));
  return dataTransfer.files.length > 0 ? dataTransfer.files : null;
}