import { Document } from "langchain";

export const APP_KNOWLEDGE_DOCS: Document[] = [
  // ────────────────────────────────────────────────
  // CRITICAL: Always use live data for available specialties
  // ────────────────────────────────────────────────
  new Document({
    pageContent: `
CRITICAL RULE: When user asks "what specialties do you have?" or "is there a [specialty] doctor?", ALWAYS call the search_specialties tool first to get the LIVE list from the database. 
Do NOT use this knowledge base to claim what exists—it's for explanations only. If the tool shows it's not available, say "Sorry, not available yet—here are alternatives."
    `,
    metadata: { type: "critical-rule", category: "data-sources", priority: "highest" },
  }),

  // ────────────────────────────────────────────────
  // Location Handling (No Defaults)
  // ────────────────────────────────────────────────
  new Document({
    pageContent: `
Location Rules: NEVER use a default location (no Kanayannur or anything). ALWAYS ask: "Where are you located? (City/Area, e.g., Ernakulam)" or check profile via get_user_profile and confirm: "Your profile says [city]—is that correct?"
If user says "Ernakulam", use lat: 9.98, lng: 76.27. Ask for radius: "How far to search? (Default 50km)".
Send lat/lng/radiusKm to search_doctors tool.
    `,
    metadata: { type: "location-rules", category: "behavior", priority: "high" },
  }),

  new Document({
    pageContent: `
CRITICAL RULE: When user asks "what specialties do you have?" or "is there a [specialty] doctor?", ALWAYS call the search_specialties tool first to get the LIVE list from the database. 
Do NOT use this knowledge base to claim what exists—it's for explanations only. If the tool shows it's not available, say "Sorry, not available yet—here are alternatives."
    `,
    metadata: { type: "critical-rule", category: "data-sources", priority: "highest" },
  }),
  new Document({
    pageContent: `
Location Rules: NEVER use a default location (no Kanayannur or anything). ALWAYS ask: "Where are you located? (City/Area, e.g., Ernakulam)" or check profile via get_user_profile and confirm: "Your profile says [city]—is that correct?"
If user says "Ernakulam", use lat: 9.98, lng: 76.27. Ask for radius: "How far to search? (Default 50km)".
Send lat/lng/radiusKm to search_doctors tool.
    `,
    metadata: { type: "location-rules", category: "behavior", priority: "high" },
  }),
  new Document({
    pageContent: `
Symptom Handling: When user describes symptoms, suggest 1-2 likely specialties using this knowledge, then call search_specialties to confirm availability, then search_doctors with specialtyId or search field.
Examples:
- Headache, dizziness → Neurology
- Chest pain, palpitations → Cardiology
- Joint pain, fracture → Orthopedics
- Fever, cough → General Medicine or Pulmonology
- Irregular periods → Gynecology
Always say: "Based on [symptoms], I suggest [specialty]. Is that right?"
    `,
    metadata: { type: "symptom-guide", category: "behavior", priority: "high" },
  }),
  new Document({
    pageContent: `
Cardiology: Heart and blood vessel disorders. Symptoms: chest pain, shortness of breath, irregular heartbeat, high blood pressure, leg swelling, fatigue.
    `,
    metadata: {
      type: "specialty",
      name: "Cardiology",
      symptoms: ["chest pain", "palpitations"],
      category: "medical",
    },
  }),

  new Document({
    pageContent: `
After search: Show top 3 doctors with distance, rating, fee. Ask: "Which doctor? Preferred date?" Then get availability, lock slot, confirm wallet.
    `,
    metadata: { type: "flow", category: "booking", priority: "high" },
  }),

  // ────────────────────────────────────────────────
  // Symptom-to-Specialty Mapping Guide
  // ────────────────────────────────────────────────
  new Document({
    pageContent: `
Symptom Handling: When user describes symptoms, suggest 1-2 likely specialties using this knowledge, then call search_specialties to confirm availability, then search_doctors with specialtyId or search field.
Examples:
- Headache, dizziness → Neurology
- Chest pain, palpitations → Cardiology
- Joint pain, fracture → Orthopedics
- Fever, cough → General Medicine or Pulmonology
- Irregular periods → Gynecology
Always say: "Based on [symptoms], I suggest [specialty]. Is that right?"
    `,
    metadata: { type: "symptom-guide", category: "behavior", priority: "high" },
  }),

  // ────────────────────────────────────────────────
  // 25+ Common Specialties with Symptoms (Educational Only)
  // ────────────────────────────────────────────────
  new Document({
    pageContent: `
Cardiology: Heart and blood vessel disorders. Symptoms: chest pain, shortness of breath, irregular heartbeat, high blood pressure, leg swelling, fatigue.
    `,
    metadata: {
      type: "specialty",
      name: "Cardiology",
      symptoms: ["chest pain", "palpitations"],
      category: "medical",
    },
  }),
  new Document({
    pageContent: `
Neurology: Brain, spinal cord, nerves. Symptoms: severe headache, numbness, seizures, memory loss, dizziness, weakness in limbs.
    `,
    metadata: {
      type: "specialty",
      name: "Neurology",
      symptoms: ["headache", "dizziness"],
      category: "medical",
    },
  }),
  new Document({
    pageContent: `
Orthopedics: Bones, joints, muscles. Symptoms: back pain, knee pain, fractures, joint swelling, difficulty walking, sports injuries.
    `,
    metadata: {
      type: "specialty",
      name: "Orthopedics",
      symptoms: ["joint pain", "fracture"],
      category: "medical",
    },
  }),
  new Document({
    pageContent: `
General Medicine: Adult general health. Symptoms: fever, fatigue, diabetes, hypertension, routine checkups, unexplained weight loss.
    `,
    metadata: {
      type: "specialty",
      name: "General Medicine",
      symptoms: ["fever", "tiredness"],
      category: "medical",
    },
  }),
  new Document({
    pageContent: `
Pediatrics: Children and infants. Symptoms: child fever, cough, vaccinations, growth issues, abdominal pain in kids.
    `,
    metadata: {
      type: "specialty",
      name: "Pediatrics",
      symptoms: ["child fever", "cough"],
      category: "medical",
    },
  }),
  new Document({
    pageContent: `
Gynecology: Women's reproductive health. Symptoms: irregular periods, pelvic pain, pregnancy concerns, menopause, infertility.
    `,
    metadata: {
      type: "specialty",
      name: "Gynecology",
      symptoms: ["irregular periods"],
      category: "medical",
    },
  }),
  new Document({
    pageContent: `
Dermatology: Skin, hair, nails. Symptoms: acne, rashes, hair loss, itching, pigmentation issues.
    `,
    metadata: {
      type: "specialty",
      name: "Dermatology",
      symptoms: ["rash", "acne", "skin", "hair"],
      category: "medical",
    },
  }),
  new Document({
    pageContent: `
ENT (Ear, Nose, Throat): Ear/nose/throat issues. Symptoms: ear pain, sore throat, sinusitis, hearing loss.
    `,
    metadata: {
      type: "specialty",
      name: "ENT",
      symptoms: ["ear pain", "sore throat"],
      category: "medical",
    },
  }),
  new Document({
    pageContent: `
Psychiatry: Mental health. Symptoms: anxiety, depression, sleep issues, stress, OCD.
    `,
    metadata: {
      type: "specialty",
      name: "Psychiatry",
      symptoms: ["anxiety", "depression"],
      category: "mental-health",
    },
  }),
  new Document({
    pageContent: `
Gastroenterology: Digestive system. Symptoms: stomach pain, acidity, diarrhea, constipation, liver issues.
    `,
    metadata: {
      type: "specialty",
      name: "Gastroenterology",
      symptoms: ["stomach pain"],
      category: "medical",
    },
  }),
  new Document({
    pageContent: `
Endocrinology: Hormones, diabetes, thyroid. Symptoms: weight gain/loss, fatigue, thyroid swelling, high sugar.
    `,
    metadata: {
      type: "specialty",
      name: "Endocrinology",
      symptoms: ["diabetes symptoms"],
      category: "medical",
    },
  }),
  new Document({
    pageContent: `
Pulmonology: Lungs and breathing. Symptoms: chronic cough, asthma, breathlessness, chest infection.
    `,
    metadata: {
      type: "specialty",
      name: "Pulmonology",
      symptoms: ["cough", "breathlessness"],
      category: "medical",
    },
  }),
  new Document({
    pageContent: `
Urology: Urinary tract, kidneys. Symptoms: urinary pain, kidney stones, prostate issues, frequent urination.
    `,
    metadata: {
      type: "specialty",
      name: "Urology",
      symptoms: ["urinary pain"],
      category: "medical",
    },
  }),
  new Document({
    pageContent: `
Nephrology: Kidneys. Symptoms: swelling in legs, high creatinine, dialysis needs, kidney failure signs.
    `,
    metadata: {
      type: "specialty",
      name: "Nephrology",
      symptoms: ["kidney pain"],
      category: "medical",
    },
  }),
  new Document({
    pageContent: `
Oncology: Cancer. Symptoms: unexplained lumps, weight loss, persistent pain, abnormal bleeding.
    `,
    metadata: { type: "specialty", name: "Oncology", symptoms: ["lump"], category: "medical" },
  }),
  new Document({
    pageContent: `
Ophthalmology: Eyes. Symptoms: vision blur, eye pain, redness, cataract, glaucoma.
    `,
    metadata: {
      type: "specialty",
      name: "Ophthalmology",
      symptoms: ["eye pain"],
      category: "medical",
    },
  }),
  new Document({
    pageContent: `
Rheumatology: Joint inflammation. Symptoms: arthritis pain, joint stiffness, lupus symptoms.
    `,
    metadata: {
      type: "specialty",
      name: "Rheumatology",
      symptoms: ["joint stiffness"],
      category: "medical",
    },
  }),
  new Document({
    pageContent: `
Dental: Teeth and gums. Symptoms: toothache, gum bleeding, cavities, braces needs.
    `,
    metadata: { type: "specialty", name: "Dental", symptoms: ["toothache"], category: "medical" },
  }),
  new Document({
    pageContent: `
Homeopathy: Alternative medicine. Symptoms: chronic conditions, allergies, skin issues (holistic approach).
    `,
    metadata: {
      type: "specialty",
      name: "Homeopathy",
      symptoms: ["allergies"],
      category: "alternative",
    },
  }),
  new Document({
    pageContent: `
Ayurveda: Traditional Indian medicine. Symptoms: digestive issues, stress, joint pain (herbal/natural).
    `,
    metadata: {
      type: "specialty",
      name: "Ayurveda",
      symptoms: ["digestive issues"],
      category: "alternative",
    },
  }),
  new Document({
    pageContent: `
Radiology: Imaging (X-ray, MRI). Symptoms: Not direct—referred for scans on pain, injury.
    `,
    metadata: { type: "specialty", name: "Radiology", category: "diagnostic" },
  }),
  new Document({
    pageContent: `
Pathology: Lab tests. Symptoms: Blood tests for infections, diabetes, etc.
    `,
    metadata: { type: "specialty", name: "Pathology", category: "diagnostic" },
  }),
  new Document({
    pageContent: `
Physiotherapy: Physical rehab. Symptoms: Post-injury pain, mobility issues, back pain.
    `,
    metadata: {
      type: "specialty",
      name: "Physiotherapy",
      symptoms: ["mobility issues"],
      category: "rehab",
    },
  }),
  new Document({
    pageContent: `
Nutrition/Dietetics: Diet advice. Symptoms: Weight management, diabetes diet, nutritional deficiencies.
    `,
    metadata: {
      type: "specialty",
      name: "Nutrition",
      symptoms: ["weight loss"],
      category: "wellness",
    },
  }),
  new Document({
    pageContent: `
Emergency Medicine: Urgent care. Symptoms: Accidents, severe pain, stroke signs—immediate help.
    `,
    metadata: {
      type: "specialty",
      name: "Emergency Medicine",
      symptoms: ["severe pain"],
      category: "urgent",
    },
  }),

  // ────────────────────────────────────────────────
  // Booking Flow Reminder
  // ────────────────────────────────────────────────
  new Document({
    pageContent: `
After search: Show top 3 doctors with distance, rating, fee. Ask: "Which doctor? Preferred date?" Then get availability, lock slot, confirm wallet.
    `,
    metadata: { type: "flow", category: "booking", priority: "high" },
  }),
];
