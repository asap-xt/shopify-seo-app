// frontend/src/components/analytics/QueriesChart.jsx
// Renders a chart for daily AI query usage using Recharts.

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const QueriesChart = ({ data }) => {
    const { i18n } = useTranslation();

    const chartData = data.map(item => ({
        // Format the date for display on the X-axis
        date: new Date(item.date).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' }),
        queries: item.dailyQueries,
    }));

    return (
        <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="queries" fill="var(--p-color-bg-success-strong)" name="Daily AI Queries" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default QueriesChart;
