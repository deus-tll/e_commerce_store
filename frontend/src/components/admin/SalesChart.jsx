import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";

import Card from "../ui/Card.jsx";

const SalesChart = ({ data }) => {
	return (
		<Card className="p-6">
			<h3 className="text-lg font-semibold text-white mb-6">Sales & Revenue Performance</h3>
			<div className="h-[400px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data}>
						<CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
						<XAxis
							dataKey="date"
							stroke="#9CA3AF"
							fontSize={12}
							tickLine={false}
							axisLine={false}
							dy={10}
						/>
						<YAxis
							yAxisId="left"
							stroke="#10B981"
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							yAxisId="right"
							orientation="right"
							stroke="#3B82F6"
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<Tooltip
							contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#F3F4F6" }}
							itemStyle={{ fontSize: "12px" }}
						/>
						<Legend wrapperStyle={{ paddingTop: "20px" }} />
						<Line
							yAxisId="left"
							type="monotone"
							dataKey="sales"
							stroke="#10B981"
							strokeWidth={3}
							dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
							activeDot={{ r: 8 }}
							name="Sales (Orders)"
						/>
						<Line
							yAxisId="right"
							type="monotone"
							dataKey="revenue"
							stroke="#3B82F6"
							strokeWidth={3}
							dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
							activeDot={{ r: 8 }}
							name="Revenue ($)"
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</Card>
	);
};

export default SalesChart;