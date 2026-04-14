// src/utils/saveReviewToRTDB.js
import { ref, set, serverTimestamp, update, get } from "firebase/database";
import { rtdb } from "../firebase";

const safeKey = (s) =>
  String(s || "")
    .trim()
    .replace(/[.#$[\]/\s]/g, "_")
    .slice(0, 140);

const asStr = (v) => String(v ?? "").trim();

const asNumOrNull = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const asBool = (v) => {
  if (typeof v === "boolean") return v;
  const s = String(v ?? "").trim().toLowerCase();
  if (["yes", "y", "true", "1", "registered"].includes(s)) return true;
  if (["no", "n", "false", "0", "unregistered", "not registered"].includes(s))
    return false;
  return Boolean(v);
};

const cleanArray = (arr) =>
  Array.isArray(arr)
    ? arr
        .filter((x) => x !== undefined && x !== null && String(x).trim() !== "")
        .map((x) => (typeof x === "string" ? x.trim() : x))
    : [];

const cleanObject = (obj) => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );
};

const getResponse = (apiResult) =>
  apiResult?.response && typeof apiResult.response === "object"
    ? apiResult.response
    : {};

const getMeta = (apiResult) =>
  apiResult?.meta && typeof apiResult.meta === "object" ? apiResult.meta : {};

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

const mapRatingsByCriterion = (ratings = []) => {
  const out = {};
  if (!Array.isArray(ratings)) return out;

  for (const item of ratings) {
    const key = asStr(item?.criterion_key);
    if (!key) continue;

    out[key] = {
      label: asStr(item?.criterion_label),
      score: asNumOrNull(item?.score),
      reason: asStr(item?.reason),
    };
  }

  return out;
};

const extractFinalScore = (response) =>
  asNumOrNull(
    response?.final_score ??
      response?.overall_score ??
      response?.scores?.overall_final ??
      response?.scores?.final_score
  );

const extractRubricScore = (response) =>
  asNumOrNull(
    response?.rubric_score ??
      response?.scores?.rubric_score ??
      response?.calculation_breakdown?.rubric_score
  );

const extractReadinessModifier = (response) =>
  asNumOrNull(
    response?.readiness_modifier ??
      response?.scores?.readiness_modifier ??
      response?.calculation_breakdown?.readiness_modifier
  );

const extractScoreBand = (response) =>
  asStr(response?.score_band || response?.scores?.score_band);

const extractCalculationBreakdown = (response) => {
  const breakdown = response?.calculation_breakdown || {};
  const weighted = breakdown?.weighted_contributions || {};
  const positive = breakdown?.positive_signals || {};
  const negative = breakdown?.negative_signals || {};

  return {
    formula: cleanObject(breakdown?.formula || {}),
    weightedContributions: cleanObject(weighted),
    positiveSignals: cleanObject(positive),
    negativeSignals: cleanObject(negative),
    positiveTotal: asNumOrNull(breakdown?.positive_total),
    negativeTotal: asNumOrNull(breakdown?.negative_total),
  };
};

const buildEvaluation = ({ response, hasRegisteredEntity }) => {
  const scores = response?.scores || {};
  const evidence = response?.evidence_signals || {};
  const fraud = response?.fraud_risk || {};
  const qualifiers = response?.qualifiers || {};
  const missing = response?.missing_flags || {};
  const team = response?.team_assessment || {};
  const derived = team?.derived_team_signals || {};
  const registration = response?.registration_status || {};
  const debug = response?.debug || {};

  return {
    finalScore: extractFinalScore(response),
    rubricScore: extractRubricScore(response),
    readinessModifier: extractReadinessModifier(response),
    scoreBand: extractScoreBand(response),

    decision: asStr(response?.decision),
    decisionReason: asStr(response?.decision_reason),
    startupQuality: asStr(response?.startup_quality),
    businessType: asStr(response?.business_type),
    differentiationFlag: asStr(response?.differentiation_flag),
    qualifierCount: asNumOrNull(response?.qualifier_count),
    summary: asStr(response?.summary),

    ratings: {
      problemClarity: {
        score: asNumOrNull(scores?.problem_clarity),
        reason: asStr(mapRatingsByCriterion(response?.ratings)?.problem_clarity?.reason),
      },
      solutionStrength: {
        score: asNumOrNull(scores?.solution_strength),
        reason: asStr(mapRatingsByCriterion(response?.ratings)?.solution_strength?.reason),
      },
      innovationDepth: {
        score: asNumOrNull(scores?.innovation_depth),
        reason: asStr(mapRatingsByCriterion(response?.ratings)?.innovation_depth?.reason),
      },
      businessModelClarity: {
        score: asNumOrNull(scores?.business_model_clarity),
        reason: asStr(
          mapRatingsByCriterion(response?.ratings)?.business_model_clarity?.reason
        ),
      },
      executionReadiness: {
        score: asNumOrNull(scores?.execution_readiness),
        reason: asStr(
          mapRatingsByCriterion(response?.ratings)?.execution_readiness?.reason
        ),
      },
      teamCapability: {
        score: asNumOrNull(scores?.team_capability),
        reason: asStr(mapRatingsByCriterion(response?.ratings)?.team_capability?.reason),
      },
    },

    strengths: cleanArray(response?.strengths),
    risksAndGaps: cleanArray(response?.risks_and_gaps),
    improvementSuggestions: cleanArray(response?.improvement_suggestions),
    pitchQuestions: cleanArray(response?.pitch_questions),

    qualifiers: {
      clearMonetization: asBool(qualifiers?.clear_monetization),
      evidenceOrValidation: asBool(qualifiers?.evidence_or_validation),
      goToMarketClarity: asBool(qualifiers?.go_to_market_clarity),
      defensibilityMoat: asBool(qualifiers?.defensibility_moat),
      technologyLeverage: asBool(qualifiers?.technology_leverage),
      nonLinearScalability: asBool(qualifiers?.non_linear_scalability),
      largeAddressableMarket: asBool(qualifiers?.large_addressable_market),
      executionFeasibility: asBool(qualifiers?.execution_feasibility),
    },

    missingFlags: {
      targetCustomerUnclear: asBool(missing?.target_customer_unclear),
      pricingUnclear: asBool(missing?.pricing_unclear),
      differentiationUnclear: asBool(missing?.differentiation_unclear),
      evidenceMissing: asBool(missing?.evidence_missing),
      executionPlanUnclear: asBool(missing?.execution_plan_unclear),
      scalePathUnclear: asBool(missing?.scale_path_unclear),
      teamStrengthUnclear: asBool(missing?.team_strength_unclear),
    },

    evidence: {
      evidenceScore: asNumOrNull(evidence?.evidence_score),
      evidenceQuality: asStr(evidence?.evidence_quality),
      proofStrength: asNumOrNull(evidence?.proof_strength),
      numbersCount: asNumOrNull(evidence?.numbers_count),
      currencyMentions: asNumOrNull(evidence?.currency_mentions),
      datesCount: asNumOrNull(evidence?.dates_count),
      tractionHits: cleanArray(evidence?.traction_hits),
    },

    fraudRisk: {
      buzzwordCount: asNumOrNull(fraud?.buzzword_count),
      buzzwordRisk: asNumOrNull(fraud?.buzzword_risk),
      buzzwordRiskLabel: asStr(fraud?.buzzword_risk_label),
      proofCount: asNumOrNull(fraud?.proof_count),
      strongProofCount: asNumOrNull(fraud?.strong_proof_count),
      weakGenericCount: asNumOrNull(fraud?.weak_generic_count),
      possibleClaimInflation: asBool(fraud?.possible_claim_inflation),
    },

    registrationStatus: {
      isRegistered: asBool(
        registration?.is_registered ?? hasRegisteredEntity ?? false
      ),
      confidenceBoostApplied: asNumOrNull(
        registration?.confidence_boost_applied
      ),
    },

    teamAssessment: {
      institutionSignal: asStr(team?.institution_signal),
      institutionReason: asStr(team?.institution_reason),
      founderRelevanceScore: asNumOrNull(team?.founder_relevance_score),
      cofounderStrengthScore: asNumOrNull(team?.cofounder_strength_score),
      teamCompletenessScore: asNumOrNull(team?.team_completeness_score),
      qualificationBucket: asStr(team?.qualification_bucket),
      founderQualification: asStr(team?.founder_qualification),
      founderInstitution: asStr(team?.founder_institution),

      derivedSignals: {
        teamSize: asNumOrNull(derived?.teamSize),
        coFounderCount: asNumOrNull(derived?.coFounderCount),
        qualifiedCofounders: asNumOrNull(derived?.qualifiedCofounders),
        founderHasLinkedin: asBool(derived?.founderHasLinkedin),
        teamCapabilityScore: asNumOrNull(derived?.teamCapabilityScore),
      },

      executionAdjustmentApplied: asNumOrNull(
        team?.execution_adjustment_applied
      ),
      parsedCofounders: normalizeParsedCofounders(team?.parsed_cofounders),
    },

    calculationBreakdown: extractCalculationBreakdown(response),

    debug: {
      totalWords: asNumOrNull(debug?.total_words),
      traditionalRisk: asNumOrNull(debug?.traditional_risk),
      buzzwordRisk: asNumOrNull(debug?.buzzword_risk),
      evidenceQuality: asStr(debug?.evidence_quality),
      evidenceScore: asNumOrNull(debug?.evidence_score),
      proofStrength: asNumOrNull(debug?.proof_strength),
      lowEvidencePenaltyApplied: asNumOrNull(debug?.low_evidence_penalty_applied),
      marketRealismPenaltyApplied: asNumOrNull(
        debug?.market_realism_penalty_applied
      ),
    },
  };
};

const buildListIndex = ({
  applicationId,
  startupName,
  founderName,
  stage,
  district,
  state,
  sectorCategory,
  teamSize,
  hasRegisteredEntity,
  qualification,
  institution,
  coFounderCount,
  isSoleFounder,
  evaluation,
  now,
}) => ({
  applicationId: asStr(applicationId),
  startupName: asStr(startupName),
  founderName: asStr(founderName),
  stage: asStr(stage),
  district: asStr(district),
  state: asStr(state),
  sectorCategory: asStr(sectorCategory),

  hasRegisteredEntity: asBool(hasRegisteredEntity),
  qualification: asStr(qualification),
  institution: asStr(institution),
  teamSize: asNumOrNull(teamSize),
  coFounderCount: asNumOrNull(coFounderCount),
  isSoleFounder: asBool(isSoleFounder),

  finalScore: asNumOrNull(evaluation?.finalScore),
  rubricScore: asNumOrNull(evaluation?.rubricScore),
  readinessModifier: asNumOrNull(evaluation?.readinessModifier),
  scoreBand: asStr(evaluation?.scoreBand),

  decision: asStr(evaluation?.decision),
  startupQuality: asStr(evaluation?.startupQuality),
  businessType: asStr(evaluation?.businessType),
  differentiationFlag: asStr(evaluation?.differentiationFlag),

  problemScore: asNumOrNull(evaluation?.ratings?.problemClarity?.score),
  solutionScore: asNumOrNull(evaluation?.ratings?.solutionStrength?.score),
  innovationScore: asNumOrNull(evaluation?.ratings?.innovationDepth?.score),
  businessModelScore: asNumOrNull(
    evaluation?.ratings?.businessModelClarity?.score
  ),
  executionScore: asNumOrNull(
    evaluation?.ratings?.executionReadiness?.score
  ),
  teamScore: asNumOrNull(evaluation?.ratings?.teamCapability?.score),

  evidenceQuality: asStr(evaluation?.evidence?.evidenceQuality),
  evidenceScore: asNumOrNull(evaluation?.evidence?.evidenceScore),
  proofStrength: asNumOrNull(evaluation?.evidence?.proofStrength),

  buzzwordRiskLabel: asStr(evaluation?.fraudRisk?.buzzwordRiskLabel),
  buzzwordRisk: asNumOrNull(evaluation?.fraudRisk?.buzzwordRisk),
  possibleClaimInflation: asBool(
    evaluation?.fraudRisk?.possibleClaimInflation
  ),

  qualificationBucket: asStr(evaluation?.teamAssessment?.qualificationBucket),
  institutionSignal: asStr(evaluation?.teamAssessment?.institutionSignal),
  founderRelevanceScore: asNumOrNull(
    evaluation?.teamAssessment?.founderRelevanceScore
  ),
  teamCompletenessScore: asNumOrNull(
    evaluation?.teamAssessment?.teamCompletenessScore
  ),

  updatedAt_ms: now,
  updatedAt: serverTimestamp(),
});
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
  coFounderCount,
  isSoleFounder,
  coFounders,

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

  const basePath = `startupAIReview/${monthKey}/${key}`;
  const baseRef = ref(rtdb, basePath);

  const existingSnap = await get(baseRef);
  const existing = existingSnap.exists() ? existingSnap.val() : null;

  const evaluation = buildEvaluation({
    response,
    hasRegisteredEntity,
  });

  const payload = {
    application: {
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
    },

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
      entityName: asStr(entityName),
      entityType: asStr(entityType),
      entityRegistrationNumber: asStr(entityRegistrationNumber),
      dateOfRegistration: asStr(dateOfRegistration),
      businessAddress: asStr(businessAddress),
    },

    files: {
      pitchDeck: {
        fileName: asStr(pitchDeckFileName),
        url: asStr(pitchDeckURL),
      },
      profilePhoto: {
        fileName: asStr(profilePhotoFileName),
        url: asStr(profilePhotoURL),
      },
      entityCertificate: {
        fileName: asStr(entityCertificateFileName),
        url: asStr(entityCertificateURL),
      },
    },

    answers: {
      problemStatement: asStr(answers?.problemStatement),
      solution: asStr(answers?.solution),
      innovation: asStr(answers?.innovation),
      businessModel: asStr(answers?.businessModel),
    },

    evaluation,

    meta: {
      model: asStr(meta?.model),
      schema: asStr(apiResult?.schema),
      stage: asStr(apiResult?.stage),
      reviewedMonth: asStr(reviewMonth),
      elapsedMs: asNumOrNull(meta?.elapsed_ms),
      totalDuration: meta?.total_duration ?? "",
      createdAt: existing?.meta?.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedAt_ms: now,
    },

    raw: {
      apiResponse: apiResult || null,
    },
  };

  await set(baseRef, payload);

  const indexData = buildListIndex({
    applicationId,
    startupName,
    founderName,
    stage,
    district,
    state,
    sectorCategory,
    teamSize,
    hasRegisteredEntity,
    qualification,
    institution,
    coFounderCount,
    isSoleFounder,
    evaluation,
    now,
  });

  await update(ref(rtdb), {
    [`startupAIReviewIndex/${monthKey}/${key}`]: indexData,
  });

  return {
    ok: true,
    path: basePath,
    indexPath: `startupAIReviewIndex/${monthKey}/${key}`,
    applicationId: asStr(applicationId),
    month: monthKey,
    finalScore: evaluation?.finalScore,
    decision: evaluation?.decision,
  };
}