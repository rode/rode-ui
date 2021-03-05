// TODO: test this

export const getVulnerabilityBreakdown = (vulnerabilities) => {
  let low = 0;
  let medium = 0;
  let high = 0;
  let unknown = 0;

  vulnerabilities.forEach((vuln) => {
    if (vuln.effectiveSeverity === "LOW") {
      low++;
    } else if (vuln.effectiveSeverity === "MEDIUM") {
      medium++;
    } else if (vuln.effectiveSeverity === "HIGH") {
      high++;
    } else {
      unknown++;
    }
  });

  const values = [
    high && `${high} high`,
    medium && `${medium} medium`,
    low && `${low} low`,
    unknown && `${unknown} unknown`,
  ];
  return values.filter((val) => val).join(", ");
};
