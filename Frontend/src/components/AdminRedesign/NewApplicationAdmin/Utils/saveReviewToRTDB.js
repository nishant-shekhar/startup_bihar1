// src/utils/saveReviewToRTDB.js
import { ref, set, serverTimestamp, update } from "firebase/database";
import { rtdb } from "../firebase";

const safeKey = (s) =>
  String(s || "")
    .trim()
    .replace(/[.#$[\]/\s]/g, "_") // RTDB disallowed chars + spaces
    .slice(0, 120);

export async function saveStartupReviewToRTDB({
  sbNo,
  entityName,
  stage,
  answers,
  apiResult, // full JSON from backend: { sb_no, schema, response, meta, ... }
}) {
  if (!sbNo) throw new Error("sbNo missing");
  const key = safeKey(sbNo);

  const now = Date.now();

  const payload = {
    sb_no: String(sbNo),
    entity_name: String(entityName || ""),
    stage: String(stage || ""),

    // Inputs
    answers: {
      innovation_note: String(answers?.innovation_note || ""),
      uniqueness_note: String(answers?.uniqueness_note || ""),
      employment_potential_note: String(answers?.employment_potential_note || ""),
      wealth_potential_note: String(answers?.wealth_potential_note || ""),
      product_development_capability_note: String(answers?.product_development_capability_note || ""),
      success_stories_and_growth_plan: String(answers?.success_stories_and_growth_plan || ""),
    },

    // Entire API object (keeps every detail)
    api: apiResult || null,

    // Audit
    updatedAt_ms: now,
    updatedAt: serverTimestamp(),
  };

  // Path: StartupReviews/{sbNo}
  const base = ref(rtdb, `StartupReviews/${key}`);

  // Write full record
  await set(base, payload);

  // Optional: maintain a lightweight index for lists
  const idx = ref(rtdb, `StartupReviewsIndex/${key}`);
  await update(idx, {
    sb_no: String(sbNo),
    entity_name: String(entityName || ""),
    stage: String(stage || ""),
    decision: apiResult?.response?.decision || "",
    overall_final: apiResult?.response?.scores?.overall_final ?? apiResult?.response?.overall_score ?? null,
    updatedAt_ms: now,
    updatedAt: serverTimestamp(),
  });

  return true;
}