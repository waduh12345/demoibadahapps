export interface DictionaryEntry {
  id: number;
  term: string;
  definition: string; 
  alphabet_index: string;
  created_at: string;
  updated_at: string;
}

export interface DictionaryResponse {
  code: number;
  message: string;
  data: DictionaryEntry[];
}
