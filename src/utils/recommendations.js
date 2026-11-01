import { days } from './dates'
import { avg } from './metrics'

// Returns a list of [icon, title, text] wellness suggestions based on the last 7 days and the profile.
export function getRecommendations(db) {
  const D = days(7)
  const p = db.profile || {}
  const r = []
  const a = (k) => avg(db, k, D)
  const sleep = a('sleep') ?? +p.sleepAvg
  const water = a('water') ?? +p.waterAvg
  const exercise = a('exercise')
  const stress = a('stress')
  const screen = a('screen') ?? +p.scr

  if (sleep && sleep < 7)
    r.push(['🌙', 'Improve your sleep routine', 'Your sleep averages under 7 hours. Adults generally do well with 7–9. Try a fixed bedtime, dim lights and screens an hour before bed, and keep caffeine to the morning.'])
  if (water && water < 6)
    r.push(['💧', 'Drink more water', 'Your intake is below 6 glasses a day. Keep a bottle nearby and pair a glass with each meal or habit you already do.'])
  if ((exercise != null && exercise < 20) || p.ex === 'Never')
    r.push(['🏃', 'Move a little more each day', 'Short walks count. Aim for about 150 minutes of moderate activity a week, built up in small steps you can keep.'])
  if (['Daily', 'Several times a week'].includes(p.junk) || p.fv === 'Rarely')
    r.push(['🥗', 'Improve your eating habits', 'Try adding one fruit or vegetable to each meal, and swap one processed snack a day for a whole-food option.'])
  if (stress >= 4 || ['High', 'Very high'].includes(p.stressLv))
    r.push(['🧘', 'Practice stress management', 'Slow breathing for two minutes, a short walk outside, or writing down what is on your mind can help. Talking with someone you trust also helps.'])
  if (screen > 6)
    r.push(['📱', 'Take screen breaks', 'Try the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.'])
  if (!r.length)
    r.push(['✅', 'You are on a steady track', 'Keep logging each day. Consistency is what makes patterns visible.'])
  return r
}
