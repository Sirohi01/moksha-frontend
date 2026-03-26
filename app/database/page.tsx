import type { Metadata } from "next";
import { Container, Badge, SectionHeader } from "@/components/ui/Elements";
import { mockBodies } from "@/lib/mockData";
import { Search, User, MapPin, Calendar, AlertTriangle } from "lucide-react";
import type { UnidentifiedBody } from "@/types";

export const metadata: Metadata = { title: "Unidentified Bodies Database" };

function statusBadge(status: UnidentifiedBody["status"]) {
  const map = {
    pending: <Badge variant="yellow">⚠ Pending ID</Badge>,
    identified: <Badge variant="green">✓ Identified</Badge>,
    cremated: <Badge variant="stone">Cremated</Badge>,
  };
  return map[status];
}

export default function DatabasePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-stone-900 to-stone-800 text-white py-20">
        <Container>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-amber-900/50 rounded-xl flex items-center justify-center border border-amber-700">
              <Search className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <span className="text-saffron-400 text-sm font-medium tracking-widest uppercase">✦ Public Database ✦</span>
              <h1 className="font-serif text-4xl font-bold mt-2 mb-3">
                Unidentified Bodies Database
              </h1>
              <p className="text-stone-300 text-lg max-w-2xl">
                If you are searching for a missing family member, search our database. Each record
                includes physical descriptions to aid identification.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Alert */}
      <section className="bg-amber-50 border-b border-amber-200 py-4">
        <Container>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-amber-800 text-sm">
              If you recognize anyone in this database, please contact us immediately at{" "}
              <a href="tel:+919220147229" className="font-semibold underline">9220147229</a>{" "}
              or your nearest police station.
            </p>
          </div>
        </Container>
      </section>

      {/* Search bar */}
      <section className="py-8 bg-cream-50 border-b border-cream-200">
        <Container size="lg">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="search"
                placeholder="Search by location, description, date..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
                aria-label="Search unidentified bodies database"
              />
            </div>
            <select
              className="px-4 py-3 rounded-lg border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
              aria-label="Filter by status"
            >
              <option value="">All Status</option>
              <option value="pending">Pending ID</option>
              <option value="identified">Identified</option>
              <option value="cremated">Cremated</option>
            </select>
          </div>
        </Container>
      </section>

      {/* Records */}
      <section className="py-12 bg-white">
        <Container>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-stone-600 text-sm">{mockBodies.length} records found</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockBodies.map((body) => (
              <div
                key={body.id}
                className="border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Photo placeholder */}
                <div className="h-36 bg-stone-100 flex items-center justify-center border-b border-stone-200">
                  <div className="text-center">
                    <User className="w-10 h-10 text-stone-300 mx-auto mb-1" />
                    <p className="text-stone-400 text-xs">
                      {body.photoUrl ? "Photo available" : "No photo"}
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-saffron-700 bg-saffron-50 px-2 py-1 rounded">
                      {body.bodyId}
                    </span>
                    {statusBadge(body.status)}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
                      <span className="text-stone-600">{body.locationFound}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                      <span className="text-stone-600">Found: {body.dateFound}</span>
                    </div>
                    {body.age && (
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                        <span className="text-stone-600">
                          {body.gender}, approx. {body.age} yrs
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-100">
                    <p className="text-xs text-stone-500 font-medium mb-1">Clothing Description:</p>
                    <p className="text-xs text-stone-600">{body.clothesDescription}</p>
                    {body.marksOrTattoos && (
                      <>
                        <p className="text-xs text-stone-500 font-medium mt-2 mb-1">Marks / Tattoos:</p>
                        <p className="text-xs text-stone-600">{body.marksOrTattoos}</p>
                      </>
                    )}
                  </div>

                  {body.cremationDate && (
                    <div className="mt-3 pt-3 border-t border-stone-100">
                      <p className="text-xs text-stone-500">
                        Cremated on: <span className="font-medium text-stone-700">{body.cremationDate}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
