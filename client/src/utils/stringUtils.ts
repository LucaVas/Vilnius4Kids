export function removeDiacritics(text: string) {
  let output = '';

  const normalized = text.normalize('NFD');
  let i = 0;
  let j = 0;

  while (i < text.length) {
    output += normalized[j];

    j += text[i] == normalized[j] ? 1 : 2;
    i++;
  }

  return output;
}
