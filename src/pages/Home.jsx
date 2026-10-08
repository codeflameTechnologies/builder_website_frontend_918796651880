import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProperties } from "../api/properties";
import { createEnquiry } from "../api/enquiries";
import { Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [searchTab, setSearchTab] = useState("buy");
  const [budget, setBudget] = useState(500);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [saleProperties, setSaleProperties] = useState([]);
  const [rentProperties, setRentProperties] = useState([]);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [callbackForm, setCallbackForm] = useState({ name: "", phone: "", propertyId: "", propertyName: "", propertyType: "" });
  const [callbackError, setCallbackError] = useState("");
  const [callbackLoading, setCallbackLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setPropertyLoading(true);

    Promise.all([getAllProperties("sale"), getAllProperties("rent")])
      .then(([saleData, rentData]) => {
        if (!active) return;
        const mapProperty = (p) => ({
          ...p,
          image: p.images?.[0],
          layout: p.bhk ? `${p.bhk} BHK` : p.type,
          baths: "—",
          tag: p.status === "available" ? "Available" : "Sold",
        });
        const saleMapped = saleData.map(mapProperty);
        const rentMapped = rentData.map(mapProperty);
        setSaleProperties(saleMapped.slice(0, 6));
        setRentProperties(rentMapped.slice(0, 6));

        const availableForEnquiry = [...saleMapped, ...rentMapped];
        setCallbackForm((current) => {
          if (current.propertyId || !availableForEnquiry.length) return current;
          const first = availableForEnquiry[0];
          return {
            ...current,
            propertyId: first._id,
            propertyName: first.name,
            propertyType: first.listingType || first.type || ""
          };
        });
      })
      .catch(() => {
        if (!active) return;
        setSaleProperties([]);
        setRentProperties([]);
      })
      .finally(() => {
        if (active) setPropertyLoading(false);
      });

    return () => { active = false; };
  }, []);

  const budgetLabel =
    budget < 100 ? `₹ ${budget} Lakh` : `₹ ${(budget / 100).toFixed(2)} Cr`;

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setCallbackLoading(true);
    setCallbackError("");
    try {
      await createEnquiry({
        name: callbackForm.name,
        phone: callbackForm.phone,
        email: "website-callback@apexhomes.in",
        propertyType: callbackForm.propertyType || "general",
        propertyId: callbackForm.propertyId || undefined,
        propertyName: callbackForm.propertyName || undefined,
        whatsapp: true
      });
      setSubmitted(true);
    } catch (err) {
      setCallbackError(err.response?.data?.message || "Unable to submit. Please call or WhatsApp us.");
    } finally { setCallbackLoading(false); }
  };

  return (
    <div className="w-full">
      {/* ---------- HERO WITH SEARCH ---------- */}
      <section className="relative w-full overflow-hidden bg-gray-900">
        <div
          className="relative w-full min-h-[600px] lg:min-h-[700px] flex items-center bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(10,20,35,0.85), rgba(10,20,35,0.6)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600')",
          }}
        >
          <div className="relative max-w-7xl w-full mx-auto px-6 lg:px-10 py-24">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                Premier Real Estate Developer • Delhi NCR
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white max-w-3xl leading-tight mb-4">
              Crafting Premium Living Spaces in Delhi NCR
            </h1>
            <p className="text-lg text-gray-200 max-w-2xl mb-10">
              Engineered for discerning lifestyles — visionary design, clear-title
              documentation, and hand-selected developments across Gurugram,
              South Delhi, Dwarka and Noida.
            </p>

            {/* Search box */}
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-5 lg:p-6">
              <div className="flex items-center gap-2 pb-4">
                <button
                  type="button"
                  onClick={() => setSearchTab("buy")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    searchTab === "buy"
                      ? "bg-blue-900 text-white shadow-sm"
                      : "bg-gray-100 text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Buy Residential
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTab("rent")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    searchTab === "rent"
                      ? "bg-blue-900 text-white shadow-sm"
                      : "bg-gray-100 text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Rent Portfolio
                </button>
                <span className="hidden md:inline-flex items-center gap-1 ml-auto text-xs text-gray-500">
                  ✅ 100% RERA Verified Inventory
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wider text-gray-500">
                    Select Location
                  </label>
                  <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-900">
                    <option>All Delhi NCR Regions</option>
                    <option>Dwarka, Sector 19 &amp; Expressway</option>
                    <option>South Delhi</option>
                    <option>Gurugram</option>
                    <option>Noida Expressway</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wider text-gray-500">
                    Property Type
                  </label>
                  <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-900">
                    <option>Any Configuration</option>
                    <option>2 BHK</option>
                    <option>3 BHK</option>
                    <option>4 BHK</option>
                    <option>Villa</option>
                    <option>Penthouse</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs uppercase tracking-wider text-gray-500">
                      Max Budget
                    </label>
                    <span className="text-xs font-bold text-blue-900">{budgetLabel}</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={800}
                    step={10}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-blue-900 cursor-pointer"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => { const p = new URLSearchParams(); p.set("type", searchTab === "buy" ? "sale" : "rent"); if (location) p.set("q", location); if (propertyType) p.set("q", `${location} ${propertyType}`.trim()); navigate(`/properties?${p.toString()}`); }}
                  className="h-[42px] px-4 rounded-lg bg-blue-900 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors"
                >
                  🔍 Search Properties
                </button>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <span className="text-xs uppercase font-semibold text-gray-700">Popular:</span>
                {["Sector 19 Dwarka 3 BHK", "Golf Course Ext. Villas", "Under ₹75 Lakh", "Bank Approved Projects"].map(
                  (tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer">
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- COMPANY INTRO + STATS ---------- */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-semibold uppercase tracking-wider">
              Two Decades of Excellence
            </div>
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              Apex Homes: Setting the Standard for Trust &amp; Construction Purity
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Founded with a steadfast commitment to transparency and build craftsmanship,
              Apex Homes has shaped Delhi NCR's most prestigious skylines — with certified
              materials and clear title documentation on every property.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {[
                ["⚖️", "100% Freehold", "Clear title deeds & sanction drawings."],
                ["🏛️", "Elite Architecture", "Max ventilation & acoustic insulation."],
                ["✅", "Pre-Approved Loans", "Direct tie-up with SBI, HDFC & ICICI."],
              ].map(([icon, title, desc]) => (
                <div key={title} className="p-4 rounded-xl bg-gray-50">
                  <div className="text-2xl mb-1">{icon}</div>
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500 mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-gray-50 p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
                  Verified Track Record
                </span>
                <span className="px-2.5 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                  RERA Certified
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["18+", "Years of Legacy"],
                  ["45+", "Projects Delivered"],
                  ["3,200+", "Happy Families"],
                  ["100%", "RERA Compliant"],
                ].map(([num, label]) => (
                  <div key={label} className="p-4 rounded-lg bg-white shadow-sm">
                    <span className="text-2xl font-bold text-gray-900 block">{num}</span>
                    <span className="text-sm font-semibold text-gray-700 block mt-1">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FOR SALE ---------- */}
      <section className="w-full py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold block mb-1">
                From Our Backend Inventory
              </span>
              <h2 className="text-3xl font-bold text-gray-900">For Sale</h2>
              <p className="text-gray-500 mt-2">Explore properties currently listed for sale.</p>
            </div>
            <Link to="/properties?type=sale" className="text-blue-900 font-semibold text-sm hover:underline">
              View All Sale Properties →
            </Link>
          </div>

          {propertyLoading ? (
            <p className="text-gray-500">Loading sale properties...</p>
          ) : saleProperties.length === 0 ? (
            <div className="rounded-xl bg-white border border-dashed border-gray-300 p-10 text-center text-gray-500">
              No properties are currently listed for sale. Add a sale property from the admin dashboard.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {saleProperties.map((p) => <HomePropertyCard key={p._id} property={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ---------- FOR RENT ---------- */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold block mb-1">
                From Our Backend Inventory
              </span>
              <h2 className="text-3xl font-bold text-gray-900">For Rent</h2>
              <p className="text-gray-500 mt-2">Explore properties currently available for rent.</p>
            </div>
            <Link to="/properties?type=rent" className="text-blue-900 font-semibold text-sm hover:underline">
              View All Rental Properties →
            </Link>
          </div>

          {propertyLoading ? (
            <p className="text-gray-500">Loading rental properties...</p>
          ) : rentProperties.length === 0 ? (
            <div className="rounded-xl bg-gray-50 border border-dashed border-gray-300 p-10 text-center text-gray-500">
              No properties are currently listed for rent. Add a rental property from the admin dashboard.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rentProperties.map((p) => <HomePropertyCard key={p._id} property={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ---------- CONTACT / VIP FORM ---------- */}
      <section className="w-full py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="rounded-2xl bg-blue-900 text-white p-8 lg:p-14 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs uppercase font-semibold inline-block">
                Direct Builder Desk
              </span>
              <h2 className="text-3xl font-bold leading-tight">
                Request a Private Site Tour &amp; Inventory Consultation
              </h2>
              <p className="text-gray-200">
                Speak directly with our senior project principals — verified floor plans,
                brochures and loan schedules within 15 minutes.
              </p>
              <div className="pt-2 space-y-2 text-sm">
                <p>📞 Direct Sales Desk: +91 98765 43210</p>
                <p>✉️ advisory@apexhomesbuilders.com</p>
                <p>✅ Zero brokerage — directly from Builder</p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <form
                onSubmit={handleInquirySubmit}
                className="bg-white text-gray-900 p-6 rounded-xl shadow-xl space-y-4"
              >
                <h3 className="text-lg font-bold">Get Immediate Call Back</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs uppercase text-gray-500">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={callbackForm.name}
                      onChange={(e) => setCallbackForm((v) => ({ ...v, name: e.target.value }))}
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full px-3 py-2 rounded bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase text-gray-500">Mobile (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      value={callbackForm.phone}
                      onChange={(e) => setCallbackForm((v) => ({ ...v, phone: e.target.value }))}
                      placeholder="+91 98765 00000"
                      className="w-full px-3 py-2 rounded bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase text-gray-500">Interested Project</label>
                  <select
                    value={callbackForm.propertyId}
                    onChange={(e) => {
                      const selected = [...saleProperties, ...rentProperties].find((p) => p._id === e.target.value);
                      setCallbackForm((v) => ({
                        ...v,
                        propertyId: selected?._id || "",
                        propertyName: selected?.name || "",
                        propertyType: selected?.listingType || selected?.type || ""
                      }));
                    }}
                    className="w-full px-3 py-2 rounded bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    disabled={propertyLoading || (!saleProperties.length && !rentProperties.length)}
                  >
                    {propertyLoading ? (
                      <option value="">Loading properties...</option>
                    ) : [...saleProperties, ...rentProperties].length ? (
                      <>
                        <option value="">Select a property</option>
                        {saleProperties.length > 0 && (
                          <optgroup label="For Sale">
                            {saleProperties.map((p) => (
                              <option key={`sale-${p._id}`} value={p._id}>{p.name} — {p.location}</option>
                            ))}
                          </optgroup>
                        )}
                        {rentProperties.length > 0 && (
                          <optgroup label="For Rent">
                            {rentProperties.map((p) => (
                              <option key={`rent-${p._id}`} value={p._id}>{p.name} — {p.location}</option>
                            ))}
                          </optgroup>
                        )}
                      </>
                    ) : (
                      <option value="">No properties available</option>
                    )}
                  </select>
                </div>

                {callbackError && <p className="text-red-600 text-sm">{callbackError}</p>}

                {submitted ? (
                  <p className="text-green-600 font-semibold text-center text-sm py-2">
                    Thank you! Our team will call you within 15 minutes.
                  </p>
                ) : (
                  <button
                    type="submit"
                    disabled={callbackLoading}
                    className="w-full py-3 rounded bg-blue-900 text-white font-semibold hover:bg-blue-800 transition-colors disabled:opacity-60"
                  >
                    {callbackLoading ? "Submitting..." : "Book Free Site Visit"}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HomePropertyCard({ property: p }) {
  const image = p.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800";
  const listingLabel = p.listingType === "rent" ? "For Rent" : "For Sale";
  return (
    <article className="group rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
        <img src={image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`px-2.5 py-1 rounded ${p.listingType === "rent" ? "bg-amber-500" : "bg-blue-900"} text-white text-[11px] uppercase font-semibold`}>{listingLabel}</span>
          <span className="px-2.5 py-1 rounded bg-green-600 text-white text-[11px] uppercase font-semibold">{p.tag}</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">📍 {p.location}</span>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors">{p.name}</h3>
          <div className="my-2"><span className="text-lg font-bold text-gray-900">{p.price}</span></div>
          <div className="grid grid-cols-3 gap-2 py-2 px-2 rounded bg-gray-50 my-2 text-center">
            <div><span className="text-[10px] uppercase text-gray-400 block">Layout</span><span className="text-sm font-bold text-gray-800">{p.layout || p.type || "—"}</span></div>
            <div><span className="text-[10px] uppercase text-gray-400 block">Area</span><span className="text-sm font-bold text-gray-800">{p.area || "—"}</span></div>
            <div><span className="text-[10px] uppercase text-gray-400 block">Status</span><span className="text-sm font-bold text-gray-800">{p.status || "—"}</span></div>
          </div>
        </div>
        <div className="pt-3 flex items-center gap-2">
          <a href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi, I'm interested in ${p.name}.`)}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 px-3 rounded bg-green-500 text-white text-sm font-semibold text-center hover:bg-green-600 transition-colors">WhatsApp</a>
          <Link to={`/properties/${p._id}`} className="flex-1 py-2.5 px-3 rounded bg-blue-900 text-white text-sm font-semibold text-center hover:bg-blue-800 transition-colors">View Details</Link>
        </div>
      </div>
    </article>
  );
}

