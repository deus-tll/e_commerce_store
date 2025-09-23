import Card from "../ui/Card.jsx";

const AnalyticsCard = ({ title, value, icon: Icon, color }) => {
return (
    <Card className={`p-6 overflow-hidden relative ${color}`}>
        <div className="flex justify-between items-center">
            <div className="z-10">
                <p className="text-emerald-300 text-sm mb-1 font-semibold">
                    {title}
                </p>
                <h3 className="text-white text-3xl font-bold">{value}</h3>
            </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30" />
        <div className="absolute -bottom-4 -right-4 text-emerald-800 opacity-50">
            <Icon className="h-32 w-32" />
        </div>
    </Card>
);
};

export default AnalyticsCard;