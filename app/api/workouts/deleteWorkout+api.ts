import { deleteWorkout } from '../../../database/workouts';

export default async function (req: any, res: any) {
  if (req.method !== 'DELETE') {
    res.status = 405;
    res.json({ error: 'Method Not Allowed' });
    return;
  }

  const workoutId = Number(req.query.id);
  try {
    const success = await deleteWorkout(workoutId);
    if (success) {
      res.status = 200;
      res.json({ success: true });
    } else {
      res.status = 404;
      res.json({ error: 'Workout not found' });
    }
  } catch (error) {
    res.status = 500;
    res.json({ error: 'Failed to delete workout' });
  }
}
