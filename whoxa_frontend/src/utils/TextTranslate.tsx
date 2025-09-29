import { useFetchLanguageTextList } from "../store/api/useFetchLanguageTextList";
import { LanguageTextListRes } from "../types/LanguageTextList";
import { useAppSelector } from "./hooks";

const TextTranslate: React.FC<{ text: string }> = ({ text }) => {
  // let { data: languageTranslationsData } = useFetchLanguageTextList();
  let LanguageTextList = useAppSelector((state) => state.LanguageTextList);

  if (!LanguageTextList || !LanguageTextList.results) {
    return <>{text}</>; // Return the original text if no translations are available
  }

  const results = LanguageTextList.results;
  const translation = results.find((element: any) => element.key === text);

  return <>{translation ? translation.Translation : text}</>; // Show translated text or original
};

export default TextTranslate;
