const SectionHeader = ({ title, subtitle, right }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
            <div className="text-center w-full">
                <h2 className="text-2xl font-semibold text-emerald-300">{title}</h2>
                {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
            </div>
            {right}
        </div>
    );
};

export default SectionHeader;


