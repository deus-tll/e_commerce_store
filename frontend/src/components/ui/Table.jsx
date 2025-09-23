const Table = ({ columns = [], data = [], rowKey }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                {col.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {data.map((row) => (
                        <tr key={row[rowKey] || rowKey(row)} className="hover:bg-gray-700 transition-colors">
                            {columns.map((col) => (
                                <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;