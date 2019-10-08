
export function getUsedMethods(sourceCode: string, variable: string) {
  const result: string[] = [];
  const regex = new RegExp(`${variable}\\\.([a-zA-Z0-9]+)[\\\(<]`, 'g');
  let matches: RegExpExecArray | null;

  while (matches = regex.exec(sourceCode)) {
    if (result.indexOf(matches[1]) === -1) {
      result.push(decodeURIComponent(matches[1]));
    }
  }
  return result;
}