import { PWAMetric } from "@domain/valueobjects/insights";

export function validateWordCSVString(csvString: string): boolean {
  const csvRegex = /^[\w-]+(,[\w-]+)*$/; // matches "word" or "word1,word2,word3"
  return csvRegex.test(csvString);
}

export function calcPWAScore(pwaLighthouseResult: any): number {
  let fast_reliable = 0;
  let fast_reliable_total = 0;
  let installable = 0;
  let installable_total = 0;
  let optimized = 0;
  let optimized_total = 0;
  pwaLighthouseResult.categories.pwa.auditRefs.forEach((auditRef: any) => {
    const audit = pwaLighthouseResult.audits[auditRef.id];
    if (
      audit.scoreDisplayMode === "binary" ||
      audit.scoreDisplayMode === "numeric"
    ) {
      switch (auditRef.group) {
        case PWAMetric.RELIABLE:
          fast_reliable_total++;
          break;
        case PWAMetric.INSTALLABLE:
          installable_total++;
          break;
        case PWAMetric.OPTIMIZED:
          optimized_total++;
          break;
      }

      if (audit && audit.score >= 0.9) {
        switch (auditRef.group) {
          case PWAMetric.RELIABLE:
            fast_reliable++;
            break;
          case PWAMetric.INSTALLABLE:
            installable++;
            break;
          case PWAMetric.OPTIMIZED:
            optimized++;
            break;
        }
      }
    }
  });
  let score = 0;
  if (fast_reliable === fast_reliable_total) score |= 1;
  if (installable === installable_total) score |= 2;
  if (optimized === optimized_total) score |= 4;

  return score;
}
