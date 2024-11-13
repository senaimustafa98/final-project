import { updateWorkout } from '../../../database/workouts';

export default async function (req: any, res: any) {
  if (req.method !== 'PUT') {
    res.status = 405;
    res.json({ error: 'Method Not Allowed' });
    return;
  }

  const { id, title, duration } = req.body;
  try {
    const workout = await updateWorkout(id, title, duration);
    if (workout) {
      res.status = 200;
      res.json(workout);
    } else {
      res.status = 404;
      res.json({ error: 'Workout not found' });
    }
  } catch (error) {
    res.status = 500;
    res.json({ error: 'Failed to update workout' });
  }
}
