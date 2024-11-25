export async function fetchExercises() {
  const apiKey = process.env.EXPO_EXERCISE_DB_API_KEY;

  if (!apiKey) {
    throw new Error(
      'EXERCISE_DB_API_KEY is missing in the environment variables.',
    );
  }

  const url = 'https://exercisedb.p.rapidapi.com/exercises';
  const headers = {
    'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
    'x-rapidapi-key': apiKey,
  };

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
}
