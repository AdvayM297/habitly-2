// Health profile form definition.
// Field: [name, label, type (t=text, date, n=number, s=select, a=textarea), required-flag or options, [min, max]]
const YN = 'Yes,No,Prefer not to say'
const Q = 'Rarely,Weekly,Several times a week,Daily'

export const FIELD_SECTIONS = [
  ['Personal information', [
    ['name', 'Full name', 't', 1],
    ['dob', 'Date of birth', 'date', 1],
    ['gender', 'Gender (optional)', 's', 'Female,Male,Non-binary,Prefer not to say'],
    ['height', 'Height (cm)', 'n', 1, [50, 250]],
    ['weight', 'Weight (kg)', 'n', 1, [20, 300]],
    ['blood', 'Blood group (optional)', 's', 'A+,A-,B+,B-,AB+,AB-,O+,O-,Unknown'],
    ['job', 'Occupation', 't'],
    ['act', 'Daily activity level', 's', 'Sedentary,Lightly active,Moderately active,Very active'],
  ]],
  ['Medical history', [
    ['cond', 'Existing medical conditions', 'a'],
    ['diab', 'Diagnosed with diabetes?', 's', YN],
    ['bp', 'High or low blood pressure?', 's', YN],
    ['heart', 'Heart-related conditions?', 's', YN],
    ['thy', 'Thyroid problems?', 's', YN],
    ['allergy', 'Allergies', 'a'],
    ['meds', 'Current medications', 'a'],
    ['surg', 'Past surgeries', 'a'],
    ['fam', 'Significant family medical history', 'a'],
    ['sym', 'Symptoms to mention to your doctor', 'a'],
  ]],
  ['Lifestyle and daily habits', [
    ['sleepAvg', 'Average sleep (hours/day)', 'n', 0, [0, 24]],
    ['waterAvg', 'Average water (glasses/day)', 'n', 0, [0, 30]],
    ['mealsAvg', 'Meals per day', 'n', 0, [0, 10]],
    ['bfast', 'Eat breakfast regularly?', 's', YN],
    ['junk', 'Junk food frequency', 's', Q],
    ['fv', 'Fruit and vegetable frequency', 's', Q],
    ['caff', 'Consume caffeine?', 's', YN],
    ['smoke', 'Smoke or use tobacco?', 's', YN],
    ['alc', 'Consume alcohol?', 's', YN],
    ['ex', 'Exercise frequency', 's', 'Never,1–2 days/week,3–4 days/week,5+ days/week'],
    ['scr', 'Daily screen time (hours)', 'n', 0, [0, 24]],
    ['stp', 'Daily walking steps', 'n', 0, [0, 60000]],
  ]],
  ['Mental health and well-being', [
    ['stressLv', 'Daily stress level', 's', 'Low,Moderate,High,Very high'],
    ['anx', 'Anxiety frequency', 's', 'Rarely,Sometimes,Often,Almost daily'],
    ['moodLv', 'Overall mood', 's', 'Poor,Fair,Good,Excellent'],
    ['exh', 'Mentally exhausted during the day?', 's', YN],
    ['sleepQ', 'Satisfaction with sleep quality', 's', 'Poor,Fair,Good,Excellent'],
  ]],
]

export const GOALS = [
  'Improve sleep quality',
  'Maintain a healthy weight',
  'Increase physical activity',
  'Improve eating habits',
  'Reduce stress',
  'Drink more water',
  'Improve mental well-being',
  'Build a consistent daily routine',
]
