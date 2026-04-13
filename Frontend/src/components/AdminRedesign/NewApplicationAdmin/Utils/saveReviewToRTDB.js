// src/utils/saveReviewToRTDB.js
import { ref, set, serverTimestamp, update, get } from "firebase/database";
import { rtdb } from "../firebase";

const safeKey = (s) =>
  String(s || "")
    .trim()
    .replace(/[.#$[\]/\s]/g, "_")
    .slice(0, 140);

const normYesNo = (v) => {
  const s = String(v ?? "").trim().toLowerCase();
  if (["yes", "y", "true", "1", "registered"].includes(s)) return "Yes";
  if (["no", "n", "false", "0", "unregistered", "not registered"].includes(s)) return "No";
  return String(v ?? "").trim();
};

const asStr = (v) => String(v ?? "").trim();

const asNumOrNull = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const asBool = (v) => Boolean(v);

const cleanArray = (arr) =>
  Array.isArray(arr)
    ? arr
        .filter((x) => x !== undefined && x !== null && String(x).trim() !== "")
        .map((x) => (typeof x === "string" ? x.trim() : x))
    : [];

const normalizeParsedCofounders = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.map((cf, idx) => ({
    index: idx + 1,
    raw: asStr(cf?.raw),
    name: asStr(cf?.name),
    email: asStr(cf?.email),
    phone: asStr(cf?.phone),
    qualification: asStr(cf?.qualification),
  }));
};

const getResponse = (apiResult) =>
  apiResult?.response && typeof apiResult.response === "object" ? apiResult.response : {};

const getMeta = (apiResult) =>
  apiResult?.meta && typeof apiResult.meta === "object" ? apiResult.meta : {};

const buildQuickSignals = ({ response, hasRegisteredEntity }) => {
  const qualifiers = response?.qualifiers || {};
  const missing = response?.missing_flags || {};
  const team = response?.team_assessment || {};
  const evidence = response?.evidence_signals || {};
  const fraud = response?.fraud_risk || {};
  const derived = team?.derived_team_signals || {};
  const scores = response?.scores || {};

  return {
    decision: asStr(response?.decision),
    business_type: asStr(response?.business_type),
    startup_quality: asStr(response?.startup_quality),
    differentiation_flag: asStr(response?.differentiation_flag),

    overall_score: asNumOrNull(response?.overall_score),
    qualifier_count: asNumOrNull(response?.qualifier_count),

    problem_score: asNumOrNull(scores?.problem_clarity),
    solution_score: asNumOrNull(scores?.solution_strength),
    innovation_score: asNumOrNull(scores?.innovation_depth),
    business_model_score: asNumOrNull(scores?.business_model_clarity),
    execution_score: asNumOrNull(scores?.execution_readiness),
    team_score: asNumOrNull(scores?.team_capability),

    evidence_score: asNumOrNull(evidence?.evidence_score),
    evidence_quality: asStr(evidence?.evidence_quality),
    proof_strength: asNumOrNull(evidence?.proof_strength),

    buzzword_risk: asNumOrNull(fraud?.buzzword_risk),
    buzzword_risk_label: asStr(fraud?.buzzword_risk_label),
    possible_claim_inflation: asBool(fraud?.possible_claim_inflation),

    institution_signal: asStr(team?.institution_signal),
    qualification_bucket: asStr(team?.qualification_bucket),
    founder_relevance_score: asNumOrNull(team?.founder_relevance_score),
    cofounder_strength_score: asNumOrNull(team?.cofounder_strength_score),
    team_completeness_score: asNumOrNull(team?.team_completeness_score),
    derived_team_capability_score: asNumOrNull(derived?.teamCapabilityScore),

    has_registered_entity: asBool(hasRegisteredEntity),

    has_clear_monetization: asBool(qualifiers?.clear_monetization),
    has_evidence_or_validation: asBool(qualifiers?.evidence_or_validation),
    has_go_to_market_clarity: asBool(qualifiers?.go_to_market_clarity),
    has_defensibility_moat: asBool(qualifiers?.defensibility_moat),
    has_technology_leverage: asBool(qualifiers?.technology_leverage),
    has_non_linear_scalability: asBool(qualifiers?.non_linear_scalability),
    has_large_addressable_market: asBool(qualifiers?.large_addressable_market),
    has_execution_feasibility: asBool(qualifiers?.execution_feasibility),

    missing_target_customer: asBool(missing?.target_customer_unclear),
    missing_pricing: asBool(missing?.pricing_unclear),
    missing_differentiation: asBool(missing?.differentiation_unclear),
    missing_evidence: asBool(missing?.evidence_missing),
    missing_execution_plan: asBool(missing?.execution_plan_unclear),
    missing_scale_path: asBool(missing?.scale_path_unclear),
    missing_team_strength: asBool(missing?.team_strength_unclear),
  };
};

export async function saveStartupReviewToRTDB({
  sbNo,
  entityName,
  stage,
  isRegisteredEntity,
  founderQualification,
  natureOfEntity,
  dateOfRegistration,
  roc,
  answers,
  apiResult,
}) {
  if (!sbNo) throw new Error("sbNo missing");

  const key = safeKey(sbNo);
  const now = Date.now();

  const payload = {
    sb_no: asStr(sbNo),
    entity_name: asStr(entityName),
    stage: asStr(stage),

    isRegisteredEntity: normYesNo(isRegisteredEntity),
    founderQualification: asStr(founderQualification),
    natureOfEntity: asStr(natureOfEntity),
    dateOfRegistration: asStr(dateOfRegistration),
    roc: asStr(roc),

    answers: {
      innovation_note: asStr(answers?.innovation_note),
      uniqueness_note: asStr(answers?.uniqueness_note),
      employment_potential_note: asStr(answers?.employment_potential_note),
      wealth_potential_note: asStr(answers?.wealth_potential_note),
      product_development_capability_note: asStr(answers?.product_development_capability_note),
      success_stories_and_growth_plan: asStr(answers?.success_stories_and_growth_plan),
    },

    api: apiResult || null,
    updatedAt_ms: now,
    updatedAt: serverTimestamp(),
  };

  const base = ref(rtdb, `StartupReviews/${key}`);
  await set(base, payload);

  const idx = ref(rtdb, `StartupReviewsIndex/${key}`);
  await update(idx, {
    sb_no: asStr(sbNo),
    entity_name: asStr(entityName),
    stage: asStr(stage),

    isRegisteredEntity: normYesNo(isRegisteredEntity),
    founderQualification: asStr(founderQualification),
    natureOfEntity: asStr(natureOfEntity),
    dateOfRegistration: asStr(dateOfRegistration),
    roc: asStr(roc),

    decision: apiResult?.response?.decision || "",
    overall_final:
      apiResult?.response?.scores?.overall_final ??
      apiResult?.response?.overall_score ??
      null,

    updatedAt_ms: now,
    updatedAt: serverTimestamp(),
  });

  return true;
}

// NEW SAVE FUNCTION FOR STRICT NEW PROMPT
export async function saveStartupReviewToRTDBNew({
  applicationId,
  startupName,
  founderName,
  email,
  phone,
  status,
  applicationType,
  sectorCategory,
  stage,
  teamSize,
  website,
  district,
  state,
  blockName,
  pincode,
  applicantAddress,
  gender,
  category,
  dateOfBirth,
  qualification,
  institution,
  linkedinProfile,
  hasRegisteredEntity,
  entityName,
  entityType,
  entityRegistrationNumber,
  dateOfRegistration,
  businessAddress,
  pitchDeckFileName,
  pitchDeckURL,
  profilePhotoFileName,
  profilePhotoURL,
  entityCertificateFileName,
  entityCertificateURL,
  coFounderCount,
  isSoleFounder,
  coFounders,
  answers,
  apiResult,
  reviewMonth = "April",
}) {
  if (!applicationId) throw new Error("applicationId missing");

  const key = safeKey(applicationId);
  const monthKey = safeKey(reviewMonth);
  const now = Date.now();

  const response = getResponse(apiResult);
  const meta = getMeta(apiResult);

  const scores = response?.scores || {};
  const teamAssessment = response?.team_assessment || {};
  const derivedSignals = teamAssessment?.derived_team_signals || {};
  const evidenceSignals = response?.evidence_signals || {};
  const fraudRisk = response?.fraud_risk || {};
  const registrationStatus = response?.registration_status || {};
  const debug = response?.debug || {};

  const parsedCofounders = normalizeParsedCofounders(teamAssessment?.parsed_cofounders);
  const quick = buildQuickSignals({ response, hasRegisteredEntity });

  const basePath = `startupAIReview/${monthKey}/${key}`;
  const base = ref(rtdb, basePath);
  const existingSnap = await get(base);
  const existing = existingSnap.exists() ? existingSnap.val() : null;

  const payload = {
    applicationId: asStr(applicationId),
    startupName: asStr(startupName),
    founderName: asStr(founderName),
    email: asStr(email),
    phone: asStr(phone),
    status: asStr(status),
    applicationType: asStr(applicationType),
    sectorCategory: asStr(sectorCategory),
    stage: asStr(stage),
    teamSize: asNumOrNull(teamSize),
    website: asStr(website),
    district: asStr(district),
    state: asStr(state),
    blockName: asStr(blockName),
    pincode: asStr(pincode),
    applicantAddress: asStr(applicantAddress),
    gender: asStr(gender),
    category: asStr(category),
    dateOfBirth: asStr(dateOfBirth),

    founderProfile: {
      qualification: asStr(qualification),
      institution: asStr(institution),
      linkedinProfile: asStr(linkedinProfile),
      coFounderCount: asNumOrNull(coFounderCount),
      isSoleFounder: asBool(isSoleFounder),
      coFoundersRaw: asStr(coFounders),
    },

    entityDetails: {
      hasRegisteredEntity: asBool(hasRegisteredEntity),
      hasRegisteredEntityLabel: normYesNo(hasRegisteredEntity),
      entityName: asStr(entityName),
      entityType: asStr(entityType),
      entityRegistrationNumber: asStr(entityRegistrationNumber),
      dateOfRegistration: asStr(dateOfRegistration),
      businessAddress: asStr(businessAddress),
    },

    files: {
      pitchDeckFileName: asStr(pitchDeckFileName),
      pitchDeckURL: asStr(pitchDeckURL),
      profilePhotoFileName: asStr(profilePhotoFileName),
      profilePhotoURL: asStr(profilePhotoURL),
      entityCertificateFileName: asStr(entityCertificateFileName),
      entityCertificateURL: asStr(entityCertificateURL),
    },

    answers: {
      problemStatement: asStr(answers?.problemStatement),
      solution: asStr(answers?.solution),
      innovation: asStr(answers?.innovation),
      businessModel: asStr(answers?.businessModel),
    },

    review: {
      sb_no: asStr(response?.sb_no || applicationId),
      decision: asStr(response?.decision),
      business_type: asStr(response?.business_type),
      startup_quality: asStr(response?.startup_quality),
      differentiation_flag: asStr(response?.differentiation_flag),
      overall_score: asNumOrNull(response?.overall_score),
      qualifier_count: asNumOrNull(response?.qualifier_count),
      summary: asStr(response?.summary),

      scores: {
        problem_clarity: asNumOrNull(scores?.problem_clarity),
        solution_strength: asNumOrNull(scores?.solution_strength),
        innovation_depth: asNumOrNull(scores?.innovation_depth),
        business_model_clarity: asNumOrNull(scores?.business_model_clarity),
        execution_readiness: asNumOrNull(scores?.execution_readiness),
        team_capability: asNumOrNull(scores?.team_capability),
      },

      ratings: cleanArray(response?.ratings),

      qualifiers: {
        technology_leverage: asBool(response?.qualifiers?.technology_leverage),
        non_linear_scalability: asBool(response?.qualifiers?.non_linear_scalability),
        large_addressable_market: asBool(response?.qualifiers?.large_addressable_market),
        defensibility_moat: asBool(response?.qualifiers?.defensibility_moat),
        clear_monetization: asBool(response?.qualifiers?.clear_monetization),
        execution_feasibility: asBool(response?.qualifiers?.execution_feasibility),
        go_to_market_clarity: asBool(response?.qualifiers?.go_to_market_clarity),
        evidence_or_validation: asBool(response?.qualifiers?.evidence_or_validation),
      },

      missing_flags: {
        target_customer_unclear: asBool(response?.missing_flags?.target_customer_unclear),
        pricing_unclear: asBool(response?.missing_flags?.pricing_unclear),
        differentiation_unclear: asBool(response?.missing_flags?.differentiation_unclear),
        evidence_missing: asBool(response?.missing_flags?.evidence_missing),
        execution_plan_unclear: asBool(response?.missing_flags?.execution_plan_unclear),
        scale_path_unclear: asBool(response?.missing_flags?.scale_path_unclear),
        team_strength_unclear: asBool(response?.missing_flags?.team_strength_unclear),
      },

      strengths: cleanArray(response?.strengths),
      risks_and_gaps: cleanArray(response?.risks_and_gaps),
      pitch_questions: cleanArray(response?.pitch_questions),
      improvement_suggestions: cleanArray(response?.improvement_suggestions),

      registration_status: {
        is_registered: asBool(registrationStatus?.is_registered),
        confidence_boost_applied: asNumOrNull(registrationStatus?.confidence_boost_applied),
      },

      team_assessment: {
        institution_signal: asStr(teamAssessment?.institution_signal),
        institution_reason: asStr(teamAssessment?.institution_reason),
        founder_relevance_score: asNumOrNull(teamAssessment?.founder_relevance_score),
        cofounder_strength_score: asNumOrNull(teamAssessment?.cofounder_strength_score),
        team_completeness_score: asNumOrNull(teamAssessment?.team_completeness_score),

        qualification_bucket: asStr(teamAssessment?.qualification_bucket),
        founder_qualification: asStr(teamAssessment?.founder_qualification),
        founder_institution: asStr(teamAssessment?.founder_institution),

        derived_team_signals: {
          teamSize: asNumOrNull(derivedSignals?.teamSize),
          coFounderCount: asNumOrNull(derivedSignals?.coFounderCount),
          qualifiedCofounders: asNumOrNull(derivedSignals?.qualifiedCofounders),
          founderHasLinkedin: asBool(derivedSignals?.founderHasLinkedin),
          teamCapabilityScore: asNumOrNull(derivedSignals?.teamCapabilityScore),
        },

        execution_adjustment_applied: asNumOrNull(teamAssessment?.execution_adjustment_applied),
        parsed_cofounders: parsedCofounders,
      },

      evidence_signals: {
        evidence_score: asNumOrNull(evidenceSignals?.evidence_score),
        evidence_quality: asStr(evidenceSignals?.evidence_quality),
        numbers_count: asNumOrNull(evidenceSignals?.numbers_count),
        currency_mentions: asNumOrNull(evidenceSignals?.currency_mentions),
        dates_count: asNumOrNull(evidenceSignals?.dates_count),
        traction_hits: cleanArray(evidenceSignals?.traction_hits),
        proof_strength: asNumOrNull(evidenceSignals?.proof_strength),
      },

      fraud_risk: {
        buzzword_count: asNumOrNull(fraudRisk?.buzzword_count),
        proof_count: asNumOrNull(fraudRisk?.proof_count),
        strong_proof_count: asNumOrNull(fraudRisk?.strong_proof_count),
        weak_generic_count: asNumOrNull(fraudRisk?.weak_generic_count),
        buzzword_risk: asNumOrNull(fraudRisk?.buzzword_risk),
        buzzword_risk_label: asStr(fraudRisk?.buzzword_risk_label),
        possible_claim_inflation: asBool(fraudRisk?.possible_claim_inflation),
      },

      debug: {
        total_words: asNumOrNull(debug?.total_words),
        traditional_risk: asNumOrNull(debug?.traditional_risk),
        low_evidence_penalty_applied: asNumOrNull(debug?.low_evidence_penalty_applied),
        market_realism_penalty_applied: asNumOrNull(debug?.market_realism_penalty_applied),
        buzzword_risk: asNumOrNull(debug?.buzzword_risk),
      },
    },

    apiMeta: {
      model: asStr(meta?.model),
      total_duration: meta?.total_duration ?? "",
      elapsed_ms: asNumOrNull(meta?.elapsed_ms),
      schema: asStr(apiResult?.schema),
      stage: asStr(apiResult?.stage),
      reviewedMonth: asStr(reviewMonth),
    },

    quick,

    api: apiResult || null,

    updatedAt_ms: now,
    updatedAt: serverTimestamp(),
    createdAt: existing?.createdAt || serverTimestamp(),
  };

  await set(base, payload);

  const rootIndexUpdates = {};

  // Main flat index for listings
  rootIndexUpdates[`startupAIReviewIndex/${monthKey}/${key}`] = {
    applicationId: asStr(applicationId),
    startupName: asStr(startupName),
    founderName: asStr(founderName),
    stage: asStr(stage),
    district: asStr(district),
    state: asStr(state),
    sectorCategory: asStr(sectorCategory),

    hasRegisteredEntity: normYesNo(hasRegisteredEntity),
    qualification: asStr(qualification),
    institution: asStr(institution),
    teamSize: asNumOrNull(teamSize),
    coFounderCount: asNumOrNull(coFounderCount),
    isSoleFounder: asBool(isSoleFounder),

    decision: asStr(response?.decision),
    business_type: asStr(response?.business_type),
    startup_quality: asStr(response?.startup_quality),
    differentiation_flag: asStr(response?.differentiation_flag),
    overall_score: asNumOrNull(response?.overall_score),

    problem_clarity: asNumOrNull(scores?.problem_clarity),
    solution_strength: asNumOrNull(scores?.solution_strength),
    innovation_depth: asNumOrNull(scores?.innovation_depth),
    business_model_clarity: asNumOrNull(scores?.business_model_clarity),
    execution_readiness: asNumOrNull(scores?.execution_readiness),
    team_capability: asNumOrNull(scores?.team_capability),

    institution_signal: asStr(teamAssessment?.institution_signal),
    qualification_bucket: asStr(teamAssessment?.qualification_bucket),
    evidence_quality: asStr(evidenceSignals?.evidence_quality),
    proof_strength: asNumOrNull(evidenceSignals?.proof_strength),
    buzzword_risk_label: asStr(fraudRisk?.buzzword_risk_label),
    possible_claim_inflation: asBool(fraudRisk?.possible_claim_inflation),

    updatedAt_ms: now,
    updatedAt: serverTimestamp(),
  };

  // Secondary indexes for future filters
  rootIndexUpdates[`startupAIReviewIndexes/byDecision/${monthKey}/${safeKey(quick.decision || "unknown")}/${key}`] = {
    applicationId: asStr(applicationId),
    startupName: asStr(startupName),
    founderName: asStr(founderName),
    decision: quick.decision,
    overall_score: quick.overall_score,
    updatedAt_ms: now,
    updatedAt: serverTimestamp(),
  };

  rootIndexUpdates[`startupAIReviewIndexes/byQuality/${monthKey}/${safeKey(quick.startup_quality || "unknown")}/${key}`] = {
    applicationId: asStr(applicationId),
    startupName: asStr(startupName),
    startup_quality: quick.startup_quality,
    overall_score: quick.overall_score,
    updatedAt_ms: now,
    updatedAt: serverTimestamp(),
  };

  rootIndexUpdates[`startupAIReviewIndexes/byQualificationBucket/${monthKey}/${safeKey(quick.qualification_bucket || "unknown")}/${key}`] = {
    applicationId: asStr(applicationId),
    startupName: asStr(startupName),
    qualification_bucket: quick.qualification_bucket || "unknown",
    overall_score: quick.overall_score,
    updatedAt_ms: now,
    updatedAt: serverTimestamp(),
  };

  rootIndexUpdates[`startupAIReviewIndexes/byInstitutionSignal/${monthKey}/${safeKey(quick.institution_signal || "unknown")}/${key}`] = {
    applicationId: asStr(applicationId),
    startupName: asStr(startupName),
    institution_signal: quick.institution_signal || "unknown",
    overall_score: quick.overall_score,
    updatedAt_ms: now,
    updatedAt: serverTimestamp(),
  };

  rootIndexUpdates[`startupAIReviewIndexes/byFraudRisk/${monthKey}/${safeKey(quick.buzzword_risk_label || "low")}/${key}`] = {
    applicationId: asStr(applicationId),
    startupName: asStr(startupName),
    buzzword_risk_label: quick.buzzword_risk_label || "low",
    possible_claim_inflation: quick.possible_claim_inflation,
    overall_score: quick.overall_score,
    updatedAt_ms: now,
    updatedAt: serverTimestamp(),
  };

  rootIndexUpdates[`startupAIReviewIndexes/byRegisteredEntity/${monthKey}/${asBool(hasRegisteredEntity) ? "yes" : "no"}/${key}`] = {
    applicationId: asStr(applicationId),
    startupName: asStr(startupName),
    hasRegisteredEntity: asBool(hasRegisteredEntity),
    overall_score: quick.overall_score,
    updatedAt_ms: now,
    updatedAt: serverTimestamp(),
  };

  if (quick.possible_claim_inflation) {
    rootIndexUpdates[`startupAIReviewIndexes/claimInflation/${monthKey}/${key}`] = {
      applicationId: asStr(applicationId),
      startupName: asStr(startupName),
      buzzword_risk: quick.buzzword_risk,
      overall_score: quick.overall_score,
      updatedAt_ms: now,
      updatedAt: serverTimestamp(),
    };
  }

  await update(ref(rtdb), rootIndexUpdates);

  return {
    ok: true,
    path: basePath,
    applicationId: asStr(applicationId),
    month: monthKey,
  };
}