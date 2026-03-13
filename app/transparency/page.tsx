import type { Metadata } from "next";
import { SectionHeader, Container, Badge } from "@/components/ui/Elements";
import { mockCremationRecords, mockStats } from "@/lib/mockData";
import { Shield, Download, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "Transparency Dashboard" };

function statusBadge(record: { certificateNumber: string }) {
  return <Badge variant="green">✓ Certificate Issued</Badge>;
}

export default function TransparencyPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white py-12 md:py-16 lg:py-20">
        <Container>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-green-900/50 rounded-xl flex items-center justify-center border border-green-700">
              <Shield className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <span className="text-saffron-400 text-sm font-medium tracking-widest uppercase">✦ Public Record ✦</span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mt-2 mb-3">
                Transparency Dashboard
              </h1>
              <p className="text-stone-300 text-lg max-w-2xl">
                Every cremation performed by Moksha Seva is publicly documented. Search, verify,
                and download certificates freely.
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
              { label: "Total Cremations", value: mockStats.totalCremations.toLocaleString() },
              { label: "Certificates Issued", value: (mockStats.totalCremations - 12).toLocaleString() },
              { label: "Active Cases", value: mockStats.activeCases.toString() },
              { label: "Cities Covered", value: mockStats.citiesCovered.toString() },
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
            <h2 className="font-serif text-2xl font-bold text-stone-800">Cremation Records</h2>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> Download CSV
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-200 shadow-sm">
            <table className="w-full text-sm" aria-label="Complete cremation records">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  {["Body ID", "Location Found", "Date Found", "Cremation Date", "Cremation Ground", "Officer", "Certificate No.", "Status"].map((h) => (
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
                        <Badge variant="green">✓ Issued</Badge>
                        <button
                          aria-label={`View certificate for ${rec.bodyId}`}
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
            Showing {mockCremationRecords.length} records · All data is verified and legally certified
          </p>
        </Container>
      </section>

      {/* Monthly report note */}
      <section className="py-10 bg-green-50 border-t border-green-100">
        <Container size="md">
          <div className="text-center">
            <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">
              Monthly Transparency Reports
            </h3>
            <p className="text-stone-600 text-sm mb-4">
              We publish detailed monthly reports including fund utilization, case statistics, and
              operational updates. All reports are free to download.
            </p>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> Download Latest Report (March 2024)
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
