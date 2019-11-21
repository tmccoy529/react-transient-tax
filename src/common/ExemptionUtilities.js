/**
 * Quick Solution for Validating Exemption Errors Outside of Formik
 * @param {object} exemption object representation of an exemption
 */
const GetExemptionFormErrors = exemption => {
  const activeFormErrors = [];
  const { fromDate, toDate, type } = exemption;

  if (!type) {
    activeFormErrors.push({ key: "type", error: "Exemption Type Required" });
  }

  if (!fromDate) {
    activeFormErrors.push({ key: "fromDate", error: "From Date Required" });
  }

  if (!toDate) {
    activeFormErrors.push({ key: "toDate", error: "To Date Required" });
  }

  return activeFormErrors;
};

/**
 * Check to verify if a given exemption field has an value less than 0.
 * Note: Exemption values are negative
 * @param {array} exemptionTotals Array of exemption field total objects
 */
const HasAtLeast1Exemption = (exemptionTotals = []) => {
  const sum = (prev, next) => prev + next;

  return exemptionTotals.some(
    total =>
      total &&
      Object.keys(total).length > 0 &&
      Object.keys(total)
        .map(key => total[key])
        .reduce(sum) < 0
  );
};

export { GetExemptionFormErrors, HasAtLeast1Exemption };
