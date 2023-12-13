export const retentionReason = (
  release: Release,
  environmentId: EnvironmentId,
  index?: number,
): string => {
  let reason = "only";
  if (index === 0) reason = "most recent";
  if (index && index > 0) reason = `${formatOrdinal(index + 1)} most recent`;

  return `${release.Id} kept because it is the ${reason} deployment to ${environmentId}`;
};

const ORDINAL_SUFFIXES = new Map([
  ["one", "st"],
  ["two", "nd"],
  ["few", "rd"],
  ["other", "th"],
]);

// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/PluralRules#using_options
export const formatOrdinal = (ordinal: number): string => {
  const rules = new Intl.PluralRules("en-US", { type: "ordinal" });
  const rule = rules.select(ordinal);

  const suffix = ORDINAL_SUFFIXES.get(rule);

  return `${ordinal}${suffix}`;
};
