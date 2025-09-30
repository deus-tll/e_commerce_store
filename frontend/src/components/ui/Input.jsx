const base = "w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500";

export const Input = ({ error, className = "", leftIcon: LeftIcon, ...props }) => (
    <div className="relative">
        {LeftIcon && <LeftIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />}
        <input
            className={`${base} ${LeftIcon ? 'pl-10' : ''} ${error ? 'border-red-500' : 'border-gray-600'} ${className}`}
            {...props}
        />
    </div>
);

export const Textarea = ({ error, className = "", leftIcon: LeftIcon, rows = 4, ...props }) => (
    <div className="relative">
        {LeftIcon && <LeftIcon className="absolute left-3 top-3 text-gray-400 h-4 w-4" />}
        <textarea
            rows={rows}
            className={`${base} ${LeftIcon ? 'pl-10' : ''} ${error ? 'border-red-500' : 'border-gray-600'} ${className}`}
            {...props}
        />
    </div>
);

export const Select = ({ error, className = "", leftIcon: LeftIcon, children, ...props }) => (
    <div className="relative">
        {LeftIcon && <LeftIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />}
        <select
            className={`${base} ${LeftIcon ? 'pl-10' : ''} ${error ? 'border-red-500' : 'border-gray-600'} ${className}`}
            {...props}
        >
            {children}
        </select>
    </div>
);

export const FileInput = ({ id, name, label = "Upload", accept = "image/*", onChange, value, className = "", leftIcon: LeftIcon, ...props }) => {
    return (
        <div className={`mt-1 flex items-center ${className}`}>
            <label htmlFor={id}
                   className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                {LeftIcon && <LeftIcon className='h-5 w-5 inline-block mr-2' />}
                {label}
            </label>
            <input id={id} name={name} type="file" accept={accept} onChange={onChange} className="sr-only" {...props} />
            {value && <span className="ml-3 text-sm text-gray-400">File selected</span>}
        </div>
    );
};