const ALPHABET_LENGTH = 26;

export const blobToText = async (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsText(blob);
  });
};

export const shiftText = (
  text: string,
  action: string,
  shift: number
): string => {
  const fixedShift = shift % ALPHABET_LENGTH;
  const shiftAmount = action === "encrypt" ? fixedShift : -fixedShift;
  const textToShift = text.toLowerCase();
  let shiftedText = "";

  for (let i = 0; i < textToShift.length; i++) {
    const char = textToShift[i];
    if (char.match(/[a-z]/i)) {
      const charCode = textToShift.charCodeAt(i);
      const newCharCode =
        ((charCode - 97 + shiftAmount + ALPHABET_LENGTH) % ALPHABET_LENGTH) +
        97;
      shiftedText += String.fromCharCode(newCharCode);
    } else {
      shiftedText += char;
    }
  }

  return shiftedText.toUpperCase();
};
