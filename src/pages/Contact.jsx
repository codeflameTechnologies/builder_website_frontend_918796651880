import { useState } from "react";
import { createEnquiry } from "../api/enquiries";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    whatsapp: true,
    propertyType: "flat",
    budget: "2.5cr-5.0cr",
    visitDate: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createEnquiry(formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit your enquiry. Please call or WhatsApp us.");
    } finally {
      setSubmitting(false);
    }
  };

  const propertyTypes = [
    {
      value: "flat",
      label: "Luxury Flat",
      icon: "apartment",
    },
    {
      value: "villa",
      label: "Signature Villa",
      icon: "villa",
    },
    {
      value: "commercial",
      label: "Commercial",
      icon: "storefront",
    },
    {
      value: "plot",
      label: "Plotted Land",
      icon: "landscape",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      
      {/* =====================================================
          TOP HEADER
      ====================================================== */}

      <main>

        {/* =====================================================
            TOP MARQUEE
        ====================================================== */}
        <div className="bg-black px-6 py-2 text-white lg:px-16">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between text-[11px] uppercase tracking-[0.15em]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-orange-400" />
              <span>
                Corporate Experience Center Open Today • 9:30 AM – 7:30 PM IST
              </span>
            </div>

            <div className="hidden gap-8 md:flex text-gray-300">
              <span>RERA Registered Builder: RC/REP/HARERA/GGM/745</span>
              <span>•</span>
              <span>Valet Parking & Dedicated Buyer Hospitality Lounge</span>
            </div>
          </div>
        </div>

        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="bg-white px-6 py-16 shadow-sm lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid items-end gap-10 lg:grid-cols-12">

              <div className="lg:col-span-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded bg-[#e5eeff] px-3 py-2 text-xs font-semibold uppercase tracking-wider">
                  <span>▣</span>
                  <span>Corporate Liaison & Private Advisory</span>
                </div>

                <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                  Get in Touch with{" "}
                  <span className="italic">Apex Homes</span>{" "}
                  Builders & Developers
                </h1>

                <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-500">
                  Visit our corporate experience center or speak directly with
                  our senior property consultants to schedule private
                  walkthroughs, examine architectural master plans, and review
                  RERA dossier documentation.
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:col-span-4">
                <a
                  href="tel:+919876543210"
                  className="flex items-center justify-center gap-3 rounded bg-black px-6 py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-gray-800"
                >
                  ☎
                  <span>Direct Sales Hotline</span>
                </a>

                <a
                  href="https://wa.me/919876543210?text=Hello%20Apex%20Homes,%20I%20would%20like%20to%20inquire%20about%20your%20current%20luxury%20projects."
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 rounded bg-[#25D366] px-6 py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:opacity-90"
                >
                  💬
                  <span>Instant WhatsApp Desk</span>
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            MAIN CONTACT + FORM
        ====================================================== */}
        <section className="px-6 py-16 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-12">

            {/* =================================================
                LEFT COLUMN
            ================================================== */}
            <div className="space-y-8 lg:col-span-5">

              {/* Address Card */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#e5eeff] text-xl">
                    🏢
                  </div>

                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                      Registered Corporate Headquarters
                    </span>

                    <h2 className="mt-2 text-xl font-semibold">
                      Apex Towers Experience Center
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Apex Towers, 4th Floor, Sector 12, Dwarka,
                      <br />
                      New Delhi - 110075, India
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-sm font-semibold">
                      🕐
                      <span>Mon – Sun: 9:30 AM – 7:30 PM IST</span>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="relative mt-6 h-44 overflow-hidden rounded-lg bg-[#dce9ff]">
                  <iframe
                    title="Apex Homes Location"
                    className="h-full w-full border-0"
                    src="https://www.google.com/maps?q=Dwarka%20Sector%2012%20New%20Delhi&output=embed"
                    loading="lazy"
                  />

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded bg-white/90 p-2 text-xs shadow backdrop-blur">
                    <span>📍 Metro Station: Sector 12 Dwarka (300m)</span>

                    <a
                      href="https://maps.google.com/?q=Dwarka+Sector+12+New+Delhi"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold underline"
                    >
                      Open Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* Telephone Card */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eff4ff]">
                    ☎
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">
                      Telephone Lines
                    </h3>

                    <p className="text-xs text-gray-500">
                      Instant response through executive PBX switchboard
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">

                  <div className="rounded-lg bg-[#eff4ff] p-4">
                    <span className="text-xs uppercase text-gray-500">
                      VIP Residential Sales
                    </span>

                    <div className="mt-2 font-semibold">
                      +91 98765 43210
                    </div>

                    <a
                      href="tel:+919876543210"
                      className="mt-2 inline-block text-xs font-bold uppercase tracking-wider underline"
                    >
                      Call Directly →
                    </a>
                  </div>

                  <div className="rounded-lg bg-[#eff4ff] p-4">
                    <span className="text-xs uppercase text-gray-500">
                      Corporate Desk
                    </span>

                    <div className="mt-2 font-semibold">
                      011-45678900
                    </div>

                    <a
                      href="tel:01145678900"
                      className="mt-2 inline-block text-xs font-bold uppercase tracking-wider underline"
                    >
                      Boardline Call →
                    </a>
                  </div>

                </div>
              </div>

              {/* Email Card */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eff4ff]">
                    ✉
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">
                      Direct Email Channels
                    </h3>

                    <p className="text-xs text-gray-500">
                      Confidential investment memos & formal tenders
                    </p>
                  </div>
                </div>

                <div className="space-y-3">

                  <a
                    href="mailto:sales@apexhomes.in"
                    className="flex items-center justify-between rounded bg-[#eff4ff] p-4 transition hover:bg-[#dce9ff]"
                  >
                    <div>
                      <span className="block text-xs uppercase text-gray-500">
                        New Allotments & Bookings
                      </span>

                      <span className="font-semibold">
                        sales@apexhomes.in
                      </span>
                    </div>

                    <span>↗</span>
                  </a>

                  <a
                    href="mailto:info@apexhomes.in"
                    className="flex items-center justify-between rounded bg-[#eff4ff] p-4 transition hover:bg-[#dce9ff]"
                  >
                    <div>
                      <span className="block text-xs uppercase text-gray-500">
                        Corporate Liaison & General
                      </span>

                      <span className="font-semibold">
                        info@apexhomes.in
                      </span>
                    </div>

                    <span>✉</span>
                  </a>

                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="rounded-xl bg-[#dce9ff] p-6">
                <div className="flex items-start justify-between gap-4">

                  <div>
                    <span className="rounded bg-white px-2 py-1 text-[10px] font-semibold uppercase">
                      Live Dispatch
                    </span>

                    <h4 className="mt-3 text-xl font-semibold">
                      Private WhatsApp Concierge
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Receive unit availability, verified floor layouts, and
                      cost-sheet estimations directly via chat.
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                    💬
                  </div>
                </div>

                <a
                  href="https://wa.me/919876543210?text=Hi%20Apex%20Homes,%20please%20share%20project%20brochures%20and%20pricing%20sheets."
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Connect on WhatsApp (+91 98765 43210)
                  <span>→</span>
                </a>
              </div>

            </div>

            {/* =================================================
                RIGHT COLUMN — ENQUIRY FORM
            ================================================== */}
            <div className="rounded-xl bg-white p-6 shadow-md lg:col-span-7 lg:p-10">

              <div className="border-b border-gray-100 pb-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                    SOW Section 5 • Official Enquiry Protocol
                  </span>

                  <span className="w-fit rounded bg-[#eff4ff] px-2 py-1 text-[10px] font-semibold">
                    Average Response: &lt; 15 Mins
                  </span>
                </div>

                <h2 className="mt-4 font-serif text-3xl font-semibold">
                  Schedule an Executive Consultation
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Register your purchase requirements below. Our client
                  relationship managers coordinate priority site inspections,
                  architectural walkthroughs, and bespoke investment portfolios.
                </p>
              </div>

              {error && <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-6"
              >

                {/* Name + Phone */}
                <div className="grid gap-5 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase">
                      Full Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Vikramaditya Singhania"
                      required
                      className="w-full rounded border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase">
                      Mobile Number *
                    </label>

                    <div className="flex">
                      <span className="flex items-center rounded-l border border-r-0 border-gray-200 bg-[#eff4ff] px-4 text-sm">
                        +91
                      </span>

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="98765 00000"
                        required
                        className="w-full rounded-r border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                      />
                    </div>
                  </div>

                </div>

                {/* Email + WhatsApp */}
                <div className="grid gap-5 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase">
                      Official Email Address *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="w-full rounded border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                    />
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 md:pt-8">
                    <input
                      type="checkbox"
                      name="whatsapp"
                      checked={formData.whatsapp}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />

                    <span className="text-sm">
                      Enable WhatsApp alerts for updates & OTP dispatch
                    </span>
                  </label>

                </div>

                {/* Property Type */}
                <div>
                  <label className="mb-3 block text-xs font-semibold uppercase">
                    Interested Property Type *
                  </label>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                    {propertyTypes.map((property) => (
                      <label
                        key={property.value}
                        className="cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="propertyType"
                          value={property.value}
                          checked={
                            formData.propertyType === property.value
                          }
                          onChange={handleChange}
                          className="peer sr-only"
                        />

                        <div className="rounded bg-[#eff4ff] p-4 text-center transition peer-checked:bg-black peer-checked:text-white">
                          <div className="mb-2 text-xl">
                            {property.value === "flat" && "🏢"}
                            {property.value === "villa" && "🏡"}
                            {property.value === "commercial" && "🏬"}
                            {property.value === "plot" && "🌳"}
                          </div>

                          <span className="text-xs font-semibold">
                            {property.label}
                          </span>
                        </div>
                      </label>
                    ))}

                  </div>
                </div>

                {/* Budget + Date */}
                <div className="grid gap-5 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase">
                      Budget Preference
                    </label>

                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                    >
                      <option value="1.5cr-2.5cr">
                        ₹ 1.50 Cr – ₹ 2.50 Cr
                      </option>

                      <option value="2.5cr-5.0cr">
                        ₹ 2.50 Cr – ₹ 5.00 Cr
                      </option>

                      <option value="5.0cr-10.0cr">
                        ₹ 5.00 Cr – ₹ 10.00 Cr
                      </option>

                      <option value="10.0cr+">
                        ₹ 10.00 Cr+ (Ultra-Luxury Estates)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase">
                      Preferred Site Visit Date
                    </label>

                    <input
                      type="date"
                      name="visitDate"
                      value={formData.visitDate}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                    />
                  </div>

                </div>

                {/* Notes */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase">
                    Specific Requirements & Architectural Inquiries
                  </label>

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Specify project of interest, preferred floor, parking requirements..."
                    className="w-full resize-none rounded border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-3 rounded bg-black py-4 text-sm font-semibold uppercase tracking-wider text-white shadow-lg transition hover:bg-gray-800"
                  >
                    <span>➤</span>
                    Submit Enquiry & Request Callback
                  </button>

                  <p className="mt-3 text-center text-xs leading-5 text-gray-500">
                    By submitting this dossier, you authorize Apex Homes
                    Builders & Developers to share certified digital brochures
                    via WhatsApp/SMS. No spam guaranteed.
                  </p>
                </div>

                {/* Success */}
                {submitted && (
                  <div className="rounded bg-[#dce9ff] p-5">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <span className="text-green-700">✓</span>
                      <span>Enquiry Successfully Submitted</span>
                    </div>

                    <p className="mt-2 text-sm text-gray-600">
                      Our sales team will contact you shortly regarding your
                      property enquiry.
                    </p>
                  </div>
                )}

              </form>
            </div>

          </div>
        </section>

        {/* =====================================================
            MAP / REGIONAL PRESENCE
        ====================================================== */}
        <section className="bg-[#eff4ff] px-6 py-16 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1440px]">

            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Regional Builder Presence
                </span>

                <h2 className="mt-2 font-serif text-3xl font-semibold md:text-4xl">
                  Experience Centers & Active Sites across Delhi NCR
                </h2>
              </div>

              <div className="flex gap-4 text-xs">
                <span>● Corporate Center</span>
                <span>● Active Construction Sites</span>
              </div>
            </div>

            <div className="relative h-[480px] overflow-hidden rounded-xl shadow-lg">
              <iframe
                title="Delhi NCR Map"
                className="h-full w-full border-0"
                src="https://www.google.com/maps?q=Delhi%20NCR&output=embed"
                loading="lazy"
              />

              <div className="absolute left-6 top-6 hidden max-w-sm rounded-xl bg-white/95 p-5 shadow-xl backdrop-blur-md sm:block">
                <div className="flex items-center gap-2 font-semibold">
                  📍 Pavilion Navigation Desk
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Located just off the Dwarka Express Highway with direct access
                  from IGI Airport Terminal 3.
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Apex Towers Dwarka</span>
                    <span className="text-gray-500">Open Now</span>
                  </div>

                  <div className="flex justify-between">
                    <span>The Grand View</span>
                    <span className="text-gray-500">Site Office Ready</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Apex Reserve</span>
                    <span className="text-gray-500">Show Suite Open</span>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Sector+12+Dwarka+New+Delhi"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block rounded bg-[#eff4ff] py-2 text-center text-sm font-semibold"
                >
                  Get Driving Directions
                </a>
              </div>

              <div className="absolute bottom-6 right-6 hidden items-center gap-6 rounded-xl bg-white/95 p-5 shadow-xl backdrop-blur-md md:flex">
                <div>
                  <span className="text-[10px] uppercase text-gray-500">
                    Total Land Under Dev
                  </span>
                  <div className="text-2xl font-bold">142+ Acres</div>
                </div>

                <div className="h-10 w-px bg-gray-300" />

                <div>
                  <span className="text-[10px] uppercase text-gray-500">
                    Families Welcomed
                  </span>
                  <div className="text-2xl font-bold">4,800+</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SUPPORT CARDS
        ====================================================== */}
        <section className="bg-white px-6 py-16 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-[1440px]">

            <div className="mb-10 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                Client Hospitality Standards
              </span>

              <h2 className="mt-2 font-serif text-3xl font-semibold md:text-4xl">
                Care & Assistance for Seamless Property Walkthroughs
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">

              {/* Card 1 */}
              <div className="flex flex-col justify-between rounded-xl bg-[#eff4ff] p-6">
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#dce9ff] text-2xl">
                    🚐
                  </div>

                  <span className="rounded bg-[#dce9ff] px-2 py-1 text-[10px] font-semibold">
                    VIP Privilege
                  </span>

                  <h3 className="mt-4 text-xl font-semibold">
                    Complimentary Pick & Drop
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Specially appointed chauffeur services available for senior
                    citizens, families, and outstation investors.
                  </p>
                </div>

                <a
                  href="tel:+919876543210"
                  className="mt-6 text-sm font-semibold underline"
                >
                  Request Chauffeur Transfer →
                </a>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col justify-between rounded-xl bg-[#eff4ff] p-6">
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#dce9ff] text-2xl">
                    ↓
                  </div>

                  <span className="rounded bg-[#dce9ff] px-2 py-1 text-[10px] font-semibold">
                    Digital Dossiers
                  </span>

                  <h3 className="mt-4 text-xl font-semibold">
                    Project Brochures & Plans
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Instant access to architectural schematics, unit
                    specifications, elevation renders and RERA disclosures.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    alert("Digital Dossier Bundle initiated.")
                  }
                  className="mt-6 text-left text-sm font-semibold underline"
                >
                  Download Comprehensive Pack →
                </button>
              </div>

              {/* Card 3 */}
              <div className="flex flex-col justify-between rounded-xl bg-[#eff4ff] p-6">
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#dce9ff] text-2xl">
                    🎧
                  </div>

                  <span className="rounded bg-[#dce9ff] px-2 py-1 text-[10px] font-semibold">
                    Active Owners
                  </span>

                  <h3 className="mt-4 text-xl font-semibold">
                    Buyer Support & Grievances
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Direct line to possession desk, deed registration officers
                    and handover engineering teams.
                  </p>
                </div>

                <a
                  href="mailto:support@apexhomes.in"
                  className="mt-6 text-sm font-semibold underline"
                >
                  Escalations: support@apexhomes.in →
                </a>
              </div>

            </div>

            {/* Virtual Tour */}
            <div className="mt-6 flex flex-col items-center justify-between gap-6 rounded-xl bg-[#eff4ff] p-6 lg:flex-row">

              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#dce9ff] text-2xl">
                  360°
                </div>

                <div>
                  <h4 className="text-xl font-semibold">
                    Cannot visit in person today?
                  </h4>

                  <p className="mt-1 text-sm text-gray-500">
                    Schedule an interactive 1-on-1 virtual walkthrough hosted
                    by our principal architects.
                  </p>
                </div>
              </div>

              <a
                href="#enquiry"
                className="flex shrink-0 items-center gap-2 rounded bg-black px-6 py-3 text-sm font-semibold text-white"
              >
                Book Virtual Tour
                <span>→</span>
              </a>
            </div>

          </div>
        </section>

      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="bg-[#eff4ff]">
        <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-16">

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

            <div>
              <h3 className="font-serif text-2xl font-semibold">
                Apex Homes
              </h3>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                Crafting architectural excellence and luxury residential
                enclaves across Delhi NCR with precision, permanent value, and
                peerless design.
              </p>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase">
                  Corporate Suite
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Apex Tower, 14th Floor, Sector 62, Golf Course Ext. Road,
                  Gurugram, Delhi NCR - 122002
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider">
                Curated Portfolios
              </h4>

              <ul className="mt-5 space-y-3 text-sm text-gray-500">
                <li>Ultra Luxury Residences</li>
                <li>Golf Course Penthouses</li>
                <li>Commercial High Street</li>
                <li>Signature Villas</li>
                <li>Private Viewings</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider">
                Compliance & RERA
              </h4>

              <p className="mt-5 text-sm text-gray-500">
                All projects are registered under State Real Estate Regulatory
                Authorities.
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <div className="rounded bg-white p-3">
                  <strong>RERA Gurugram:</strong>
                  <br />
                  RC/REP/HARERA/GGM/745/477/2023
                </div>

                <div className="rounded bg-white p-3">
                  <strong>RERA Noida NCR:</strong>
                  <br />
                  UPRERAPRJ982341/PHASE-II
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider">
                VIP Registry
              </h4>

              <p className="mt-5 text-sm text-gray-500">
                Receive confidential briefings on pre-launch estates and private
                releases.
              </p>

              <div className="mt-4 flex rounded-lg bg-white p-1">
                <input
                  type="email"
                  placeholder="Enter your business email"
                  className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                />

                <button className="rounded bg-black px-4 py-2 text-sm font-semibold text-white">
                  Join
                </button>
              </div>
            </div>

          </div>

          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-gray-200 pt-6 text-xs text-gray-500 md:flex-row">
            <p>
              © 2025 Apex Homes Builders & Developers Private Limited. All
              rights reserved.
            </p>

            <div className="flex gap-5">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">RERA Disclaimers</a>
              <a href="/admin">Enterprise Portal</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Contact;