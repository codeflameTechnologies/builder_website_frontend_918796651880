import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPropertyById } from "../api/properties";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPropertyById(id)
      .then(setProperty)
      .catch(() => setError("Property not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400">Loading...</div>;
  }

  if (error || !property) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">{error || "Property not found."}</p>
        <Link to="/properties" className="text-blue-900 font-medium underline">Back to listings</Link>
      </div>
    );
  }

  const {
    name, type, listingType, price, area, bhk, location,
    address, description, images = [], amenities = [], loanAvailable, status,
  } = property;

  const enquiryMessage = encodeURIComponent(`Hi, I'm interested in "${name}" (${location}). Please share more details.`);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link to="/properties" className="text-sm text-blue-900 hover:underline">← Back to Properties</Link>

      <div className="grid md:grid-cols-2 gap-8 mt-4">
        <div>
          <div className="rounded-xl overflow-hidden h-80 bg-gray-100">
            {images.length > 0 ? (
              <img src={images[activeImg]} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No image available</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-16 rounded-lg overflow-hidden border-2 ${i === activeImg ? "border-amber-500" : "border-transparent"}`}
                >
                  <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${listingType === "sale" ? "bg-blue-900" : "bg-amber-500"}`}>
              For {listingType === "sale" ? "Sale" : "Rent"}
            </span>
            {status === "sold" && (
              <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">Sold</span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
          <p className="text-gray-500 mb-4">{type} • {location}</p>
          <p className="text-2xl font-semibold text-amber-600 mb-4">{price}</p>

          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <Info label="Area" value={area || "—"} />
            <Info label="BHK" value={bhk || "—"} />
            <Info label="Loan Available" value={loanAvailable ? "Yes" : "No"} />
            <Info label="Status" value={status === "available" ? "Available" : "Sold"} />
          </div>

          {description && <p className="text-gray-700 mb-4">{description}</p>}

          {amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {amenities.map((a) => (
                  <span key={a} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">{a}</span>
                ))}
              </div>
            </div>
          )}

          {address && <p className="text-sm text-gray-500 mb-4">📍 {address}</p>}

          <div className="flex gap-3">
            <a
              href={`https://wa.me/919876543210?text=${enquiryMessage}`}
              target="_blank" rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium"
            >
              WhatsApp Enquiry
            </a>
            <a href="tel:+919876543210" className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium">
              Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg px-3 py-2">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium text-gray-700">{value}</p>
    </div>
  );
}
