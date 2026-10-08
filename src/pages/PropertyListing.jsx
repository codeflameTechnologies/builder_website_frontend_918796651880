import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllProperties } from "../api/properties";

export default function PropertyListing() {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get("type") || "all");
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async (type = filter) => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllProperties(type);
      const q = searchParams.get("q")?.trim().toLowerCase() || "";
      const filtered = q ? data.filter((p) => [p.name, p.type, p.location, p.address].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))) : data;
      setProperties(filtered);
    } catch (err) {
      setError("Could not load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [filter, searchParams]);

  useEffect(() => {
    const type = searchParams.get("type") || "all";
    setFilter(type);
    setQuery(searchParams.get("q") || "");
    fetchData(type);
  }, [searchParams, fetchData]);

  const updateFilter = (next) => {
    setFilter(next);
    const params = new URLSearchParams(searchParams);
    if (next === "all") params.delete("type"); else params.set("type", next);
    window.history.replaceState({}, "", `/properties${params.toString() ? `?${params}` : ""}`);
    fetchData(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">All Properties</h1><p className="text-sm text-gray-500 mt-1">{query ? `Results for “${query}”` : "Browse our current inventory."}</p></div>
        <Link to="/contact" className="inline-flex justify-center rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">Book a Consultation</Link>
      </div>

      <div className="flex gap-2 mb-8">
        {[
          { key: "all", label: "All" },
          { key: "sale", label: "For Sale" },
          { key: "rent", label: "For Rent" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => updateFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              filter === f.key ? "bg-blue-900 text-white border-blue-900" : "text-blue-900 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading properties...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : properties.length === 0 ? (
        <p className="text-gray-500">No properties found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

function PropertyCard({ property }) {
  const { _id, name, type, listingType, price, location, images, status } = property;
  const image = images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800";

  return (
    <Link
      to={`/properties/${_id}`}
      className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-semibold text-white ${
          listingType === "sale" ? "bg-blue-900" : "bg-amber-500"
        }`}>
          For {listingType === "sale" ? "Sale" : "Rent"}
        </span>
        {status === "sold" && (
          <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
            SOLD
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-2">{type} • {location}</p>
        <span className="font-semibold text-amber-600">{price}</span>
      </div>
    </Link>
  );
}
