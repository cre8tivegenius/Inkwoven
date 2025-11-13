export interface ExercisePrompt {
  id: string
  type: 'preset' | 'ai'
  prompt: string
  category: string
}

export const PRESET_EXERCISES: ExercisePrompt[] = [
  {
    id: 'free-write',
    type: 'preset',
    prompt: 'Write continuously for 5 minutes without stopping. Don\'t worry about grammar or structure—just let your thoughts flow.',
    category: 'Warm-up',
  },
  {
    id: 'character-sketch',
    type: 'preset',
    prompt: 'Describe a character in three sentences: their appearance, their greatest fear, and their secret dream.',
    category: 'Character Development',
  },
  {
    id: 'sensory-detail',
    type: 'preset',
    prompt: 'Write a paragraph describing a place using all five senses. What do you see, hear, smell, taste, and feel?',
    category: 'Description',
  },
  {
    id: 'dialogue-practice',
    type: 'preset',
    prompt: 'Write a conversation between two characters who have opposing views on something important.',
    category: 'Dialogue',
  },
  {
    id: 'world-building',
    type: 'preset',
    prompt: 'Create a rule or law for a fictional world. How does it affect the daily lives of its inhabitants?',
    category: 'World Building',
  },
  {
    id: 'emotion-exploration',
    type: 'preset',
    prompt: 'Write about a moment when you felt a strong emotion. Describe it in detail without naming the emotion directly.',
    category: 'Emotion',
  },
  {
    id: 'plot-twist',
    type: 'preset',
    prompt: 'Take a familiar story and add an unexpected twist. How does it change the narrative?',
    category: 'Plot',
  },
  {
    id: 'poetry-sprint',
    type: 'preset',
    prompt: 'Write a haiku (5-7-5 syllables) about the first thing you see when you look outside.',
    category: 'Poetry',
  },
]

export function getRandomExercise(): ExercisePrompt {
  const randomIndex = Math.floor(Math.random() * PRESET_EXERCISES.length)
  return PRESET_EXERCISES[randomIndex]
}

export function getExerciseByCategory(category: string): ExercisePrompt[] {
  return PRESET_EXERCISES.filter((ex) => ex.category === category)
}

