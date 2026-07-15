'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
)

const navy = '#001f50'
const orange = '#fe8015'
const green = '#166534'
const muted = '#7f9ee9'

export function MemberGrowthChart() {
  return (
    <Line
      data={{
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'Members',
            data: [180, 195, 205, 215, 228, 238, 245],
            borderColor: navy,
            backgroundColor: 'rgba(0,31,80,0.12)',
            fill: true,
            tension: 0.35,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: false } },
      }}
    />
  )
}

export function FamilyBranchChart() {
  return (
    <Pie
      data={{
        labels: ['Alubokho North', 'Alubokho South', 'Alubokho East', 'Other'],
        datasets: [
          {
            data: [86, 72, 55, 32],
            backgroundColor: [navy, orange, muted, '#e2e3e1'],
          },
        ],
      }}
      options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
    />
  )
}

export function ApprovalStatusChart() {
  return (
    <Bar
      data={{
        labels: ['Approved', 'Pending', 'Rejected', 'Suspended'],
        datasets: [
          {
            label: 'Registrations',
            data: [227, 18, 9, 5],
            backgroundColor: [green, orange, '#ba1a1a', navy],
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
      }}
    />
  )
}

export function ContributionTrendChart() {
  return (
    <Line
      data={{
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
          {
            label: 'KES (000s)',
            data: [95, 110, 120, 140, 155, 170, 185],
            borderColor: orange,
            backgroundColor: 'rgba(254,128,21,0.15)',
            fill: true,
            tension: 0.35,
          },
        ],
      }}
      options={{ responsive: true, plugins: { legend: { display: false } } }}
    />
  )
}

export function IncomeExpenseChart() {
  return (
    <Bar
      data={{
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          { label: 'Income', data: [120, 135, 140, 150, 160, 175], backgroundColor: green },
          { label: 'Expenses', data: [40, 55, 48, 70, 62, 80], backgroundColor: orange },
        ],
      }}
      options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
    />
  )
}

export function BudgetUtilChart() {
  return (
    <Doughnut
      data={{
        labels: ['Used', 'Remaining'],
        datasets: [
          {
            data: [68, 32],
            backgroundColor: [orange, '#e2e3e1'],
          },
        ],
      }}
      options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
    />
  )
}

export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest dark:bg-[#0d1729] rounded-xl border border-outline-variant dark:border-[#1a2d4f] p-lg">
      <h3 className="font-h3 text-[18px] text-primary dark:text-primary-fixed-dim mb-md">{title}</h3>
      <div className="min-h-[220px]">{children}</div>
    </div>
  )
}
