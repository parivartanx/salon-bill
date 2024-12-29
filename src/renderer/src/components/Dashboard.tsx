import { ApexOptions } from 'apexcharts'
import React from 'react'
import ReactApexChart from 'react-apexcharts'

const Dashboard: React.FC = () => {
  // Bar Chart Configuration (Monthly Sales)
  const barChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 300,
    },
    colors: ['#1C64F2', '#16BDCA'],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    title: {
      text: 'Monthly Sales',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#4B5563', // Gray-800
      },
    },
    legend: {
      position: 'bottom',
    },
  }

  const barChartSeries = [
    {
      name: 'Sales',
      data: [450, 650, 800, 700, 850, 1000],
    },
    {
      name: 'Orders',
      data: [120, 150, 200, 170, 250, 300],
    },
  ]

  // Donut Chart Configuration (Traffic Sources)
  const donutChartSeries = [450, 300, 150, 100] // Raw data

  const donutChartOptions: ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Amit', 'Sumit', 'Rakesh', 'Mukesh'],
    colors: ['#F97316', '#34D399', '#3B82F6', '#F43F5E'],
    title: {
      text: 'Service By',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#4B5563', // Gray-800
      },
    },
    legend: {
      position: 'bottom',
    },
    tooltip: {
      y: {
        formatter: (value) => value.toString(), // Display raw data in tooltip
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '16px',
              fontWeight: 600,
              color: '#4B5563',
              formatter: () => {
                // Calculate total of all data
                const total = donutChartSeries.reduce((a, b) => a + b, 0)
                return total.toString()
              },
            },
          },
        },
      },
    },
  }

  // Bar Chart Configuration (Best Selling Categories) - Updated to top 10 categories
  const categoryChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 300,
    },
    colors: ['#F43F5E', '#F97316', '#FACC15', '#34D399', '#3B82F6', '#8B5CF6', '#FF66B2', '#66B2FF', '#FF3366', '#FF9933'], // Different colors for each category
    xaxis: {
      categories: [
        'Haircut', 'Hairstyling', 'Hair Treatments', 'Facials', 'Waxing',
        'Threading', 'Manicures', 'Pedicures', 'Head Massage', 'Full Body Massage'
      ], // Top 10 best-selling categories
    },
    title: {
      text: 'Best Selling Categories',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#4B5563', // Gray-800
      },
    },
    legend: {
      position: 'bottom',
    },
    plotOptions: {
      bar: {
        distributed: true, // Enables different colors for each category
      },
    },
  }

  const categoryChartSeries = [
    {
      name: 'Sales',
      data: [800, 650, 500, 400, 300, 250, 200, 150, 100, 50], // Sales data for top 10 categories
    },
  ]

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Summary Cards */}
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Today&apos;s Sales</h3>
          <p className="text-2xl font-bold text-blue-600">₹1,250.00</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Total Service</h3>
          <p className="text-2xl font-bold text-green-600">42</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <ReactApexChart
            options={barChartOptions}
            series={barChartSeries}
            type="bar"
            height={300}
          />
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <ReactApexChart
            options={donutChartOptions}
            series={donutChartSeries}
            type="donut"
            height={300}
          />
        </div>

        {/* Best Selling Categories Chart */}
        <div className="bg-white rounded-lg shadow-lg p-4 col-span-2">
          <ReactApexChart
            options={categoryChartOptions}
            series={categoryChartSeries}
            type="bar"
            height={300}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
