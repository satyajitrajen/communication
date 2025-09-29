export default function base64ToFile(
  base64: string,
  mimeType: string,
  fileName: string,
): File {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Return as a File instead of a Blob, providing the file name
  return new File([byteArray], fileName, { type: mimeType });
}
