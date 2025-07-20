import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { FaChartBar } from 'react-icons/fa';
import dayjs from 'dayjs';

const FOCUS_COLOR = "#ffeb3b";
const CREATED_COLOR = "#2196F3";
const COMPLETED_COLOR = "#4caf50";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formattedLabel = dayjs(label).format('ddd, MMM D');
    return (
      <div className="bg-card/80 backdrop-blur-sm border border-border p-3 rounded-md shadow-lg">
        <p className="label text-sm font-bold text-foreground">{formattedLabel}</p>
        {payload.map((p, index) => (
          <p key={index} className="intro" style={{ color: p.color }}>
            {`${p.name}: ${p.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const formatXAxis = (tickItem) => {
  return dayjs(tickItem).format('MMM D');
};

export default function FocusGraph() {
  const [data, setData] = useState([]);
  const [view, setView] = useState("focus");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/focus");
        if (!res.ok) throw new Error("Failed to fetch data");
        const { tasksCompleted, focusData, tasksCreated } = await res.json();

        const dataMap = new Map();

        // Helper to initialize map entries
        const ensureDateExists = (date) => {
          if (!dataMap.has(date)) {
            dataMap.set(date, { focusTime: 0, tasksCompleted: 0, tasksCreated: 0 });
          }
        };

        focusData.forEach(item => {
          ensureDateExists(item.date);
          // ✅ Correctly convert seconds to minutes
          dataMap.get(item.date).focusTime = Math.round((item._sum.duration || 0) / 60);
        });

        tasksCompleted.forEach(item => {
          ensureDateExists(item.createdAt);
          dataMap.get(item.createdAt).tasksCompleted = item._count.completed || 0;
        });

        tasksCreated.forEach(item => {
          ensureDateExists(item.createdAt);
          dataMap.get(item.createdAt).tasksCreated = item._count.created || 0;
        });

        const formattedData = Array.from(dataMap.entries()).map(([date, values]) => ({
          date,
          ...values,
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching focus data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-card p-4 rounded-lg border border-border shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-foreground">Focus Analysis (Last 7 Days)</h2>
        <button
          className="px-3 py-1 text-sm font-medium rounded-md transition-colors bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
          onClick={() => setView(view === "focus" ? "tasks" : "focus")}
        >
          {view === "focus" ? "View Tasks" : "View Focus"}
        </button>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatXAxis} // ✅ Apply the date formatter
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
            {view === "focus" ? (
              <Bar dataKey="focusTime" fill={FOCUS_COLOR} name="Focus Time (min)" radius={[4, 4, 0, 0]} />
            ) : (
              <>
                <Bar dataKey="tasksCreated" fill={CREATED_COLOR} name="Tasks Created" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tasksCompleted" fill={COMPLETED_COLOR} name="Tasks Completed" radius={[4, 4, 0, 0]} />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col flex-grow items-center justify-center text-center text-muted-foreground">
          <FaChartBar size={40} className="mb-4" />
          <h3 className="text-lg font-semibold">No Data Yet</h3>
          <p className="text-sm">Complete tasks and focus sessions to see your progress here.</p>
        </div>
      )}
    </div>
  );
}