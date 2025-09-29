export function truncateSentence(sentence: string, limit: number) {
  if (sentence.length > limit) {
    return sentence.slice(0, limit) + "...";
  }
  return sentence;
}
