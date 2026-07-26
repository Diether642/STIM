import { useEffect, useState } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { getReportVisitors, getReportPopular, getReportSearches } from '../../api/admin'
import LoadingSpinner from '../../components/common/LoadingSpinner'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export default function ReportsAnalytics() {
  const [visitorData, setVisitorData] = useState([])
  const [popularData, setPopularData] = useState([])
  const [searchData, setSearchData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getReportVisitors(30), getReportPopular(10), getReportSearches()])
      .then(([visitors, popular, searches]) => {
        setVisitorData(visitors || [])
        setPopularData(popular || [])
        setSearchData(searches || [])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner size="lg" />

  const visitorChartData = {
    labels: visitorData.map((d) => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Page Views',
        data: visitorData.map((d) => d.total_views),
        borderColor: '#0E6B4F',
        backgroundColor: 'rgba(14, 107, 79, 0.1)',
        tension: 0.3,
      },
    ],
  }

  const popularChartData = {
    labels: popularData.map((d) => d.name),
    datasets: [
      {
        label: 'Views',
        data: popularData.map((d) => d.view_count),
        backgroundColor: '#2B7FBF',
      },
    ],
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-primary-600 font-medium mb-2">Admin</p>
        <h1 className="text-4xl font-heading font-bold text-gray-900">Reports and Analytics</h1>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-xl font-heading font-semibold mb-6">Visitor Trend (Last 30 Days)</h2>
          <Line data={visitorChartData} />
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-xl font-heading font-semibold mb-6">Popular Destinations</h2>
          <Bar data={popularChartData} />
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-xl font-heading font-semibold mb-6">Popular Searches</h2>
          {searchData.length === 0 ? (
            <p className="text-gray-500">No search data available.</p>
          ) : (
            <div className="space-y-3">
              {searchData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900 font-medium">{item.query}</span>
                  <span className="text-primary-600 font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}