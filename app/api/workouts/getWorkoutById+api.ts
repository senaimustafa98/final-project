import { getWorkoutById } from '../../../database/workouts';

export default async function (req: any, res: any) {
  if (req.method !== 'GET') {
    res.status = 405;
    res.json({ error: 'Method Not Allowed' });
    return;
  }

  const workoutId = Number(req.query.id);
  try {
    const workout = await getWorkoutById(workoutId);
    if (workout) {
      res.status = 200;
      res.json(workout);
    } else {
      res.status = 404;
      res.json({ error: 'Workout not found' });
    }
  } catch (error) {
    res.status = 500;
    res.json({ error: 'Failed to fetch workout' });
  }
}
