export interface LanguageTextListRes {
  language_alignment: string;
  success: boolean;
  message: string;
  language: string;
  results: LanguageTextList[];
}

export interface LanguageTextList {
  key: string;
  Translation: string;
}
