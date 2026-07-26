export default function About() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-primary-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-accent-400 font-medium mb-2">About STIM</p>
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
            A tourism information system for the Province of Sorsogon
          </h1>
          <p className="text-lg text-primary-100 leading-relaxed max-w-3xl">
            STIM is a web-based tourism information and management system designed to provide centralized, verified tourism information for the Province of Sorsogon, with Bulan as the pilot implementation area.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        <div className="bg-white rounded-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">Purpose of STIM</h2>
          <p className="text-gray-600 leading-relaxed">
            The system addresses the lack of a centralized digital tourism platform for Sorsogon by consolidating destinations, accommodations, food and beverage establishments, retail products, events, and announcements into one verified website. It also supports AI-based itinerary generation and administrative tourism data management.
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">Province of Sorsogon</h2>
          <p className="text-gray-600 leading-relaxed">
            The Province of Sorsogon, located in the Bicol Region of the Philippines, is known for its natural resources, coastal destinations, historical landmarks, eco-tourism sites, and local products. Sosogon is designed to promote the province's tourism potential through organized and accessible digital information.
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">Role of the Tourism Office</h2>
          <p className="text-gray-600 leading-relaxed">
            The Tourism Office is responsible for maintaining accurate tourism records, approving business listings, managing events and announcements, monitoring visitor analytics, and ensuring that all information published in the system is verified and reliable.
          </p>
        </div>
      </div>
    </div>
  )
}