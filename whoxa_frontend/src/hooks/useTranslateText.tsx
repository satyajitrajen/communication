import { useAppSelector } from "../utils/hooks";

export function useTranslateText() {
  const LanguageTextList = useAppSelector((state) => state.LanguageTextList);

  return (text: string): string => {
    if (!LanguageTextList || !LanguageTextList.results) {
      return text; // Return the original text if no translations are available
    }

    const results = LanguageTextList.results;
    const translation = results.find((element: any) => element.key === text);

    return translation ? translation.Translation : text; // Return translated text or original
  };
}
