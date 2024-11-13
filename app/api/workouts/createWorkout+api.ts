import { getWorkouts } from '../../../database/workouts';

export default async function (req: any, res: any) {
  if (req.method !== 'GET') {
    res.status = 405;
    res.json({ error: 'Method Not Allowed' });
    return;
  }

  const user_id = Number(req.query.user_id);
  try {
    const workouts = await getWorkouts(user_id);
    res.status = 200;
    res.json(workouts);
  } catch (error) {
    res.status = 500;
    res.json({ error: 'Failed to fetch workouts' });
  }
}
