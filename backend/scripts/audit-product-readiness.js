import { seedData } from '../src/seed-data.js'
import { buildProductReadinessReport } from '../src/product-readiness.js'

const report = buildProductReadinessReport(seedData)

console.log(JSON.stringify({
  readiness: report.readiness,
  summary: report.summary,
  issueCount: report.issues.length,
  issues: report.issues,
}, null, 2))

if (report.issues.length > 0) {
  console.error(JSON.stringify(report.samples, null, 2))
  process.exit(1)
}
