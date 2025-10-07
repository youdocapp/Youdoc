export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
  relatedTerms?: string[];
}

export const glossaryCategories = [
  { name: 'All Terms', count: 50 },
  { name: 'Conditions', count: 15 },
  { name: 'Medications', count: 12 },
  { name: 'Procedures', count: 10 },
  { name: 'Anatomy', count: 8 },
  { name: 'Symptoms', count: 5 }
];

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: '1',
    term: 'Hypertension',
    definition: 'High blood pressure, a condition in which the force of the blood against the artery walls is too high. Normal blood pressure is below 120/80 mmHg.',
    category: 'Conditions',
    relatedTerms: ['Blood Pressure', 'Cardiovascular', 'Systolic']
  },
  {
    id: '2',
    term: 'Diabetes',
    definition: 'A chronic condition that affects how your body turns food into energy. It occurs when your blood glucose (blood sugar) is too high.',
    category: 'Conditions',
    relatedTerms: ['Glucose', 'Insulin', 'Blood Sugar']
  },
  {
    id: '3',
    term: 'Antibiotic',
    definition: 'A type of medication used to treat bacterial infections. They work by killing bacteria or preventing them from reproducing.',
    category: 'Medications',
    relatedTerms: ['Bacteria', 'Infection', 'Prescription']
  },
  {
    id: '4',
    term: 'MRI',
    definition: 'Magnetic Resonance Imaging - a medical imaging technique that uses a magnetic field and radio waves to create detailed images of organs and tissues.',
    category: 'Procedures',
    relatedTerms: ['Imaging', 'Scan', 'Diagnosis']
  },
  {
    id: '5',
    term: 'Blood Pressure',
    definition: 'The force of blood pushing against the walls of arteries. Measured in millimeters of mercury (mmHg) with two numbers: systolic (top) and diastolic (bottom).',
    category: 'Symptoms',
    relatedTerms: ['Hypertension', 'Cardiovascular', 'Heart']
  },
  {
    id: '6',
    term: 'Cardiovascular',
    definition: 'Relating to the heart and blood vessels. The cardiovascular system is responsible for circulating blood throughout the body.',
    category: 'Anatomy',
    relatedTerms: ['Heart', 'Blood Vessels', 'Circulation']
  },
  {
    id: '7',
    term: 'Insulin',
    definition: 'A hormone produced by the pancreas that regulates blood sugar levels by allowing cells to absorb glucose from the bloodstream.',
    category: 'Anatomy',
    relatedTerms: ['Diabetes', 'Glucose', 'Pancreas']
  },
  {
    id: '8',
    term: 'Asthma',
    definition: 'A chronic respiratory condition that causes inflammation and narrowing of the airways, leading to difficulty breathing, wheezing, and coughing.',
    category: 'Conditions',
    relatedTerms: ['Respiratory', 'Breathing', 'Lungs']
  },
  {
    id: '9',
    term: 'Cholesterol',
    definition: 'A waxy substance found in blood. High levels can increase risk of heart disease. Includes HDL (good) and LDL (bad) cholesterol.',
    category: 'Symptoms',
    relatedTerms: ['Heart Disease', 'Lipids', 'Cardiovascular']
  },
  {
    id: '10',
    term: 'CT Scan',
    definition: 'Computed Tomography - an imaging procedure that uses X-rays to create detailed cross-sectional images of the body.',
    category: 'Procedures',
    relatedTerms: ['Imaging', 'X-ray', 'Diagnosis']
  },
  {
    id: '11',
    term: 'Arthritis',
    definition: 'Inflammation of one or more joints, causing pain, stiffness, and reduced range of motion. Common types include osteoarthritis and rheumatoid arthritis.',
    category: 'Conditions',
    relatedTerms: ['Joints', 'Inflammation', 'Pain']
  },
  {
    id: '12',
    term: 'Antihistamine',
    definition: 'A medication that blocks histamine, a substance released during allergic reactions. Used to treat allergies, hay fever, and cold symptoms.',
    category: 'Medications',
    relatedTerms: ['Allergy', 'Histamine', 'Immune System']
  },
  {
    id: '13',
    term: 'Biopsy',
    definition: 'A medical procedure where a small sample of tissue is removed from the body for examination under a microscope to diagnose disease.',
    category: 'Procedures',
    relatedTerms: ['Diagnosis', 'Tissue', 'Cancer']
  },
  {
    id: '14',
    term: 'Migraine',
    definition: 'A neurological condition characterized by intense, debilitating headaches often accompanied by nausea, vomiting, and sensitivity to light and sound.',
    category: 'Conditions',
    relatedTerms: ['Headache', 'Neurological', 'Pain']
  },
  {
    id: '15',
    term: 'Vaccine',
    definition: 'A biological preparation that provides immunity to a particular infectious disease by stimulating the production of antibodies.',
    category: 'Medications',
    relatedTerms: ['Immunity', 'Antibodies', 'Prevention']
  },
  {
    id: '16',
    term: 'Ultrasound',
    definition: 'A diagnostic imaging technique that uses high-frequency sound waves to create images of structures inside the body.',
    category: 'Procedures',
    relatedTerms: ['Imaging', 'Sonography', 'Diagnosis']
  },
  {
    id: '17',
    term: 'Anemia',
    definition: 'A condition where you lack enough healthy red blood cells to carry adequate oxygen to body tissues, causing fatigue and weakness.',
    category: 'Conditions',
    relatedTerms: ['Blood', 'Red Blood Cells', 'Iron']
  },
  {
    id: '18',
    term: 'Statin',
    definition: 'A class of medications used to lower cholesterol levels in the blood by blocking an enzyme needed to produce cholesterol.',
    category: 'Medications',
    relatedTerms: ['Cholesterol', 'Heart Disease', 'Lipids']
  },
  {
    id: '19',
    term: 'Endoscopy',
    definition: 'A procedure using a flexible tube with a light and camera to examine the interior of a hollow organ or cavity of the body.',
    category: 'Procedures',
    relatedTerms: ['Diagnosis', 'Camera', 'Examination']
  },
  {
    id: '20',
    term: 'Thyroid',
    definition: 'A butterfly-shaped gland in the neck that produces hormones regulating metabolism, energy, and body temperature.',
    category: 'Anatomy',
    relatedTerms: ['Hormones', 'Metabolism', 'Gland']
  },
  {
    id: '21',
    term: 'Pneumonia',
    definition: 'An infection that inflames air sacs in one or both lungs, which may fill with fluid, causing cough, fever, and difficulty breathing.',
    category: 'Conditions',
    relatedTerms: ['Lungs', 'Infection', 'Respiratory']
  },
  {
    id: '22',
    term: 'Corticosteroid',
    definition: 'A class of steroid hormones used to reduce inflammation and suppress the immune system in various conditions.',
    category: 'Medications',
    relatedTerms: ['Inflammation', 'Immune System', 'Steroid']
  },
  {
    id: '23',
    term: 'ECG/EKG',
    definition: 'Electrocardiogram - a test that measures the electrical activity of the heart to detect heart problems and monitor heart health.',
    category: 'Procedures',
    relatedTerms: ['Heart', 'Cardiac', 'Diagnosis']
  },
  {
    id: '24',
    term: 'Osteoporosis',
    definition: 'A condition where bones become weak and brittle, increasing the risk of fractures. Common in older adults, especially women.',
    category: 'Conditions',
    relatedTerms: ['Bones', 'Fracture', 'Calcium']
  },
  {
    id: '25',
    term: 'Antidepressant',
    definition: 'A medication used to treat depression and other mood disorders by affecting neurotransmitters in the brain.',
    category: 'Medications',
    relatedTerms: ['Depression', 'Mental Health', 'Neurotransmitters']
  },
  {
    id: '26',
    term: 'X-ray',
    definition: 'A form of electromagnetic radiation used to create images of the inside of the body, particularly bones and dense tissues.',
    category: 'Procedures',
    relatedTerms: ['Imaging', 'Radiation', 'Bones']
  },
  {
    id: '27',
    term: 'Liver',
    definition: 'A large organ that filters blood, produces bile for digestion, stores nutrients, and performs many metabolic functions.',
    category: 'Anatomy',
    relatedTerms: ['Digestion', 'Metabolism', 'Detoxification']
  },
  {
    id: '28',
    term: 'Bronchitis',
    definition: 'Inflammation of the bronchial tubes that carry air to and from the lungs, causing coughing and mucus production.',
    category: 'Conditions',
    relatedTerms: ['Lungs', 'Respiratory', 'Cough']
  },
  {
    id: '29',
    term: 'Anticoagulant',
    definition: 'A medication that prevents blood clots from forming or growing larger. Also known as blood thinners.',
    category: 'Medications',
    relatedTerms: ['Blood Clot', 'Thrombosis', 'Circulation']
  },
  {
    id: '30',
    term: 'Colonoscopy',
    definition: 'An examination of the colon using a flexible tube with a camera to detect abnormalities, polyps, or cancer.',
    category: 'Procedures',
    relatedTerms: ['Colon', 'Cancer Screening', 'Diagnosis']
  },
  {
    id: '31',
    term: 'Eczema',
    definition: 'A chronic skin condition causing red, itchy, and inflamed patches of skin. Also known as atopic dermatitis.',
    category: 'Conditions',
    relatedTerms: ['Skin', 'Inflammation', 'Allergy']
  },
  {
    id: '32',
    term: 'Analgesic',
    definition: 'A medication used to relieve pain without causing loss of consciousness. Includes over-the-counter and prescription pain relievers.',
    category: 'Medications',
    relatedTerms: ['Pain', 'Relief', 'Painkiller']
  },
  {
    id: '33',
    term: 'Blood Test',
    definition: 'A laboratory analysis of a blood sample to check for various conditions, measure organ function, or monitor treatment.',
    category: 'Procedures',
    relatedTerms: ['Laboratory', 'Diagnosis', 'Screening']
  },
  {
    id: '34',
    term: 'Kidney',
    definition: 'A pair of organs that filter waste products from the blood, regulate fluid balance, and produce urine.',
    category: 'Anatomy',
    relatedTerms: ['Filtration', 'Urine', 'Renal']
  },
  {
    id: '35',
    term: 'COPD',
    definition: 'Chronic Obstructive Pulmonary Disease - a group of lung diseases that block airflow and make breathing difficult.',
    category: 'Conditions',
    relatedTerms: ['Lungs', 'Breathing', 'Chronic']
  },
  {
    id: '36',
    term: 'Diuretic',
    definition: 'A medication that increases urine production to help remove excess fluid from the body. Often used to treat high blood pressure.',
    category: 'Medications',
    relatedTerms: ['Fluid', 'Blood Pressure', 'Kidney']
  },
  {
    id: '37',
    term: 'Mammogram',
    definition: 'An X-ray examination of the breast used to detect and diagnose breast diseases, particularly breast cancer.',
    category: 'Procedures',
    relatedTerms: ['Breast', 'Cancer Screening', 'X-ray']
  },
  {
    id: '38',
    term: 'Stroke',
    definition: 'A medical emergency where blood flow to part of the brain is blocked or a blood vessel bursts, causing brain damage.',
    category: 'Conditions',
    relatedTerms: ['Brain', 'Blood Flow', 'Emergency']
  },
  {
    id: '39',
    term: 'Beta Blocker',
    definition: 'A medication that reduces blood pressure by blocking the effects of adrenaline on the heart and blood vessels.',
    category: 'Medications',
    relatedTerms: ['Blood Pressure', 'Heart', 'Cardiovascular']
  },
  {
    id: '40',
    term: 'Physical Therapy',
    definition: 'Treatment using physical methods such as exercise, massage, and heat to restore movement and function.',
    category: 'Procedures',
    relatedTerms: ['Rehabilitation', 'Exercise', 'Movement']
  },
  {
    id: '41',
    term: 'Pancreas',
    definition: 'An organ that produces digestive enzymes and hormones including insulin to regulate blood sugar.',
    category: 'Anatomy',
    relatedTerms: ['Insulin', 'Digestion', 'Diabetes']
  },
  {
    id: '42',
    term: 'Celiac Disease',
    definition: 'An autoimmune disorder where eating gluten triggers an immune response that damages the small intestine.',
    category: 'Conditions',
    relatedTerms: ['Gluten', 'Autoimmune', 'Intestine']
  },
  {
    id: '43',
    term: 'Probiotic',
    definition: 'Live microorganisms that provide health benefits when consumed, particularly for digestive health.',
    category: 'Medications',
    relatedTerms: ['Gut Health', 'Bacteria', 'Digestion']
  },
  {
    id: '44',
    term: 'Allergy Test',
    definition: 'A procedure to identify substances that trigger allergic reactions, using skin tests or blood tests.',
    category: 'Procedures',
    relatedTerms: ['Allergy', 'Immune System', 'Diagnosis']
  },
  {
    id: '45',
    term: 'Spleen',
    definition: 'An organ that filters blood, stores blood cells, and helps fight infection as part of the immune system.',
    category: 'Anatomy',
    relatedTerms: ['Blood', 'Immune System', 'Infection']
  },
  {
    id: '46',
    term: 'Psoriasis',
    definition: 'A chronic autoimmune skin condition causing rapid skin cell buildup, resulting in thick, scaly patches.',
    category: 'Conditions',
    relatedTerms: ['Skin', 'Autoimmune', 'Inflammation']
  },
  {
    id: '47',
    term: 'ACE Inhibitor',
    definition: 'A medication that relaxes blood vessels and lowers blood pressure by blocking an enzyme that produces angiotensin.',
    category: 'Medications',
    relatedTerms: ['Blood Pressure', 'Heart', 'Hypertension']
  },
  {
    id: '48',
    term: 'Stress Test',
    definition: 'A test that monitors heart function during physical activity to detect heart problems.',
    category: 'Procedures',
    relatedTerms: ['Heart', 'Exercise', 'Cardiac']
  },
  {
    id: '49',
    term: 'Gallbladder',
    definition: 'A small organ that stores bile produced by the liver and releases it to aid in fat digestion.',
    category: 'Anatomy',
    relatedTerms: ['Bile', 'Digestion', 'Liver']
  },
  {
    id: '50',
    term: 'Lupus',
    definition: 'A chronic autoimmune disease where the immune system attacks healthy tissues, causing inflammation throughout the body.',
    category: 'Conditions',
    relatedTerms: ['Autoimmune', 'Inflammation', 'Chronic']
  }
];
