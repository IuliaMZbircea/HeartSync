const severityWeights: Record<string, number> = {
  genetic: 3,
  chronic: 2,
  acute: 1,
};

export default function calculateRiskScore(types: string[], alerts: number): 'high' | 'medium' | 'low' {
  const score = types.reduce((acc, t) => acc + (severityWeights[t] || 0), 0) + alerts;

  if (score >= 5) return 'high';
  if (score >= 3) return 'medium';
  return 'low';
}
