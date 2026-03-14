import type { Metadata } from "next";
import { SectionHeader, Container, Badge } from "@/components/ui/Elements";
import { mockCremationRecords, mockStats } from "@/lib/mockData";
import { Download, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";
import { transparencyConfig } from "@/config/transparency.config";
import { getIcon } from "@/config/icons.config";

export const metadata: Metadata = { title: transparencyConfig.metadata.title };

function statusBadge(record: { certificateNumber: string }) {
  return <Badge variant="green">{transparencyConfig.records.certificateIssuedBadge}</Badge>;
}

export default function TransparencyPage() {
  const HeroIcon = getIcon(transparencyConfig.hero.icon);
  return (
    <>
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white py-12 md:py-16 lg:py-20">
        <Container>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-green-900/50 rounded-xl flex items-center justify-center border border-green-700">
              <HeroIcon className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <span className="text-saffron-400 text-sm font-medium tracking-widest uppercase">{transparencyConfig.hero.badge}</span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mt-2 mb-3">
                {transparencyConfig.hero.title}
              </h1>
              <p className="text-stone-300 text-lg max-w-2xl">
                {transparencyConfig.hero.description}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Summary stats */}
      <section className="py-10 bg-saffron-50 border-b border-saffron-100">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: transparencyConfig.stats.labels.totalCremations, value: mockStats.totalCremations.toLocaleString() },
              { label: transparencyConfig.stats.labels.certificatesIssued, value: (mockStats.totalCremations - 12).toLocaleString() },
              { label: transparencyConfig.stats.labels.activeCases, value: mockStats.activeCases.toString() },
              { label: transparencyConfig.stats.labels.citiesCovered, value: mockStats.citiesCovered.toString() },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-3xl font-bold text-saffron-600">{s.value}</p>
                <p className="text-stone-600 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Records table */}
      <section className="py-16 bg-white">
        <Container>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="font-serif text-2xl font-bold text-stone-800">{transparencyConfig.records.title}</h2>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> {transparencyConfig.records.downloadButton}
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-200 shadow-sm">
            <table className="w-full text-sm" aria-label={transparencyConfig.records.tableAriaLabel}>
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  {transparencyConfig.records.tableHeaders.map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {mockCremationRecords.map((rec, idx) => (
                  <tr key={rec.id} className={`hover:bg-saffron-50 transition-colors ${idx % 2 === 0 ? "" : "bg-stone-50/50"}`}>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-bold text-saffron-700 bg-saffron-50 px-2 py-1 rounded">
                        {rec.bodyId}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-700 max-w-[180px]">{rec.locationFound}</td>
                    <td className="px-4 py-3 text-stone-600 whitespace-nowrap">{rec.dateFound}</td>
                    <td className="px-4 py-3 text-stone-600 whitespace-nowrap">{rec.cremationDate}</td>
                    <td className="px-4 py-3 text-stone-600 max-w-[160px]">{rec.cremationGround}</td>
                    <td className="px-4 py-3 text-stone-600 whitespace-nowrap">{rec.officerInCharge}</td>
                    <td className="px-4 py-3 font-mono text-xs text-stone-600">{rec.certificateNumber}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="green">{transparencyConfig.records.statusBadge}</Badge>
                        <button
                          aria-label={`${transparencyConfig.records.viewCertificateLabel} ${rec.bodyId}`}
                          className="text-saffron-600 hover:text-saffron-800"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-stone-500 text-xs mt-4 text-center">
            {transparencyConfig.records.showingRecordsText} {mockCremationRecords.length} records · {transparencyConfig.records.footerText}
          </p>
        </Container>
      </section>

      {/* Monthly report note */}
      <section className="py-10 bg-green-50 border-t border-green-100">
        <Container size="md">
          <div className="text-center">
            <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">
              {transparencyConfig.reports.title}
            </h3>
            <p className="text-stone-600 text-sm mb-4">
              {transparencyConfig.reports.description}
            </p>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> {transparencyConfig.reports.downloadButton} ({transparencyConfig.reports.reportMonth})
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
