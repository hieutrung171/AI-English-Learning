/**
 * Agent tool contracts requested by the project structure.
 *
 * The FastAPI runtime uses tools.py. This TypeScript file documents equivalent
 * contracts for frontend/Node integrations without mixing TypeScript execution
 * into the Python service.
 */

export type VocabularyEntry = {
  word: string;
  definition: string;
  example: string;
};

export function lookupWord(word: string): VocabularyEntry {
  const normalized = word.trim().toLowerCase();
  return {
    word: normalized,
    definition: `A learner-friendly definition for "${normalized}".`,
    example: `Try using "${normalized}" in a sentence about your day.`,
  };
}

export function createExercise(topic: string, level: string): string {
  return `Write three ${level}-level sentences about ${topic}.`;
}
