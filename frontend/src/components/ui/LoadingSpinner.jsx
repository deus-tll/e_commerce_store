const LoadingSpinner = ({ fullscreen = true }) => {
    return (
        <div className={`${fullscreen ? 'min-h-screen' : ''} flex items-center justify-center p-4`}>
            <div className='sr-only'>Loading</div>

            <div className="relative w-20 h-20">
                <div className="w-20 h-20 border-gray-200 border-2 rounded-full" />
                <div className="w-20 h-20 border-emerald-500 border-t-2 border-r-2 border-b-transparent border-l-transparent animate-spin rounded-full absolute left-0 top-0" />
            </div>
        </div>
    );
};

export default LoadingSpinner;