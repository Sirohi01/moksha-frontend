"use client";
import React, { useState, useEffect } from "react";
import type { Metadata } from "next";
import { SectionHeader, Container, Badge } from "@/components/ui/Elements";
import { Download, ExternalLink, Shield } from "lucide-react";
import Button from "@/components/ui/Button";
import { transparencyConfig } from "@/config/transparency.config";
import { getIcon } from "@/config/icons.config";
import { usePageConfig } from "@/hooks/usePageConfig";
import { formsAPI, adminAPI } from "@/lib/api";

interface Report {
  _id: string;
  caseNumber: string;
  exactLocation: string;
  dateFound: string;
  resolvedAt?: string;
  area: string;
  city: string;
  state: string;
  hospitalName?: string;
  policeStationName?: string;
  status: string;
}

export default function TransparencyPage() {
  const { config, loading: configLoading, error: configError } = usePageConfig('transparency', transparencyConfig);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  
  // Use fallback config if dynamic config is null
  const activeConfig = config || transparencyConfig;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        // Fetch only resolved reports using public-safe endpoint
        const reportsRes = await formsAPI.getPublicReports(1, 100);
        if (reportsRes.success) {
          setReports(reportsRes.data);
        }

        // Fetch specialized public stats for transparency
        const statsRes = await formsAPI.getPublicStats();
        if (statsRes.success) {
          setStats(statsRes.data);
        }
      } catch (err) {
        console.error('Failed to fetch transparency data:', err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Handle loading state
  if (configLoading || loadingData) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  const HeroIcon = Shield; // Fallback to Shield icon

  return (
    <>
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white py-12 md:py-16 lg:py-20">
        <Container>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-green-900/50 rounded-xl flex items-center justify-center border border-green-700">
              <HeroIcon className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <span className="text-amber-500 text-sm font-medium tracking-widest uppercase">{activeConfig.hero.badge}</span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mt-2 mb-3">
                {activeConfig.hero.title}
              </h1>
              <p className="text-stone-300 text-lg max-w-2xl">
                {activeConfig.hero.description}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Summary stats */}
      <section className="py-10 bg-amber-50 border-b border-amber-100">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: activeConfig.stats.labels.totalCremations, value: (stats?.resolved || 0).toLocaleString() },
              { label: activeConfig.stats.labels.certificatesIssued, value: (stats?.resolved || 0).toLocaleString() },
              { label: activeConfig.stats.labels.activeCases, value: (stats?.pending || 0).toString() },
              { label: activeConfig.stats.labels.citiesCovered, value: "12+" }, // Dynamic cities if available
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-3xl font-bold text-amber-600">{s.value}</p>
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
            <h2 className="font-serif text-2xl font-bold text-stone-800">{activeConfig.records.title}</h2>
            {/* <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" /> {activeConfig.records.downloadButton}
            </Button> */}
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-200 shadow-sm">
            <table className="w-full text-sm" aria-label={activeConfig.records.tableAriaLabel}>
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  {activeConfig.records.tableHeaders.map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {reports.length > 0 ? reports.map((rec, idx) => (
                  <tr key={rec._id} className={`hover:bg-amber-50 transition-colors ${idx % 2 === 0 ? "" : "bg-stone-50/50"}`}>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                        {rec.caseNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-700 max-w-[180px]">{rec.exactLocation}</td>
                    <td className="px-4 py-3 text-stone-600 whitespace-nowrap">{new Date(rec.dateFound).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-stone-600 whitespace-nowrap">{rec.resolvedAt ? new Date(rec.resolvedAt).toLocaleDateString() : 'Pending'}</td>
                    <td className="px-4 py-3 text-stone-600 max-w-[160px]">{rec.city}, {rec.state}</td>
                    <td className="px-4 py-3 text-stone-600 whitespace-nowrap">{rec.policeStationName || 'In Search'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-stone-600">{rec._id.substring(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="green">{activeConfig.records.statusBadge}</Badge>
                        <button
                          aria-label={`${activeConfig.records.viewCertificateLabel} ${rec.caseNumber}`}
                          className="text-amber-600 hover:text-amber-800"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={activeConfig.records.tableHeaders.length} className="px-4 py-10 text-center text-stone-500">
                      No resolved records found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-stone-500 text-xs mt-4 text-center">
            {activeConfig.records.showingRecordsText} {reports.length} records · {activeConfig.records.footerText}
          </p>
        </Container>
      </section>

      {/* Monthly report note */}
      {/* <section className="py-10 bg-green-50 border-t border-green-100">
        <Container size="md">
          <div className="text-center">
            <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">
              {activeConfig.reports.title}
            </h3>
            <p className="text-stone-600 text-sm mb-4">
              {activeConfig.reports.description}
            </p>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> {activeConfig.reports.downloadButton} ({activeConfig.reports.reportMonth})
            </Button>
          </div>
        </Container>
      </section> */}
    </>
  );
}
