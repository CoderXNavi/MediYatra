/**
 * MediYatra Smart & Typo-Tolerant Medical Search Engine
 * Handles spelling errors, typos, partial word matches, and medical synonyms.
 */

// Common Medical Synonyms & Alias Mapping
const MEDICAL_SYNONYMS = {
  'heart': ['cardiology', 'cardiac', 'bypass', 'angioplasty', 'valve', 'heart failure', 'naresh trehan'],
  'cardiac': ['cardiology', 'heart', 'bypass', 'angioplasty'],
  'bone': ['orthopedics', 'knee', 'hip', 'joint', 'spine', 'fracture', 'ashok rajgopal'],
  'knee': ['orthopedics', 'joint replacement', 'knee replacement'],
  'hip': ['orthopedics', 'joint replacement', 'hip replacement'],
  'brain': ['neurosurgery', 'neurology', 'spine', 'stroke', 'tumor', 'rana patir'],
  'spine': ['neurosurgery', 'orthopedics', 'spine surgery', 'disc'],
  'cancer': ['oncology', 'chemotherapy', 'radiation', 'tumor', 'carcinoma', 'vinod raina'],
  'tumor': ['oncology', 'neurosurgery', 'cancer'],
  'kidney': ['nephrology', 'urology', 'transplant', 'dialysis', 'sandeep guleria'],
  'transplant': ['kidney', 'liver', 'organ transplant', 'nephrology'],
  'eye': ['ophthalmology', 'lasik', 'cataract', 'vision'],
  'teeth': ['dental', 'implant', 'dentistry'],
  'tooth': ['dental', 'implant', 'dentistry'],
  'delhi': ['new delhi', 'ncr', 'saket', 'dwarka'],
  'gurgaon': ['gurugram', 'haryana', 'ncr'],
  'mumbai': ['bombay', 'maharashtra'],
  'wheelchair': ['wheelchairs', 'chair', 'mobility', 'foldable'],
  'oxygen': ['oxygen cylinders', 'concentrator', 'cylinder', 'breathing']
};

/**
 * Calculates Levenshtein distance between two strings
 */
function getLevenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Checks if a single word query fuzzy matches a single target word
 */
function isWordFuzzyMatch(qWord, tWord) {
  if (!qWord || !tWord) return false;
  if (tWord.includes(qWord) || qWord.includes(tWord)) return true;

  // Allow 1 typo for 4-5 char words, 2 typos for 6+ char words
  const maxAllowedDistance = qWord.length <= 5 ? 1 : 2;
  
  // Only compare Levenshtein if word lengths are reasonably close
  if (Math.abs(qWord.length - tWord.length) <= maxAllowedDistance) {
    const dist = getLevenshteinDistance(qWord, tWord);
    if (dist <= maxAllowedDistance) return true;
  }

  return false;
}

/**
 * Main Smart Fuzzy Match Function
 * @param {string|object} source - Text string or object with searchable properties
 * @param {string} query - User search input (e.g. "apolo", "cardology", "knee")
 * @returns {boolean} True if query matches target with typo tolerance & synonym expansion
 */
export function fuzzySearchMatch(source, query) {
  if (!query || query.trim() === '') return true;

  const cleanQuery = query.toLowerCase().trim();
  let fullTargetText = '';

  if (typeof source === 'string') {
    fullTargetText = source.toLowerCase();
  } else if (typeof source === 'object' && source !== null) {
    fullTargetText = Object.values(source)
      .filter(val => typeof val === 'string' || typeof val === 'number')
      .join(' ')
      .toLowerCase();
  }

  if (!fullTargetText) return false;

  // 1. Direct Exact Substring Match
  if (fullTargetText.includes(cleanQuery)) return true;

  // 2. Medical Synonym Expansion Match
  for (const [key, synonyms] of Object.entries(MEDICAL_SYNONYMS)) {
    if (cleanQuery.includes(key) || key.includes(cleanQuery)) {
      if (synonyms.some(syn => fullTargetText.includes(syn))) {
        return true;
      }
    }
  }

  // 3. Word-by-Word Typo Distance Match
  const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 1);
  const targetWords = fullTargetText.split(/[\s,./()\-]+/).filter(w => w.length > 1);

  return queryWords.every(qWord => {
    return targetWords.some(tWord => isWordFuzzyMatch(qWord, tWord));
  });
}
