const Avatar = ({ name = "", src = "", size = 40 }) => {
    const letter = (name || '?').charAt(0).toUpperCase();
    const dimension = `${size}px`;
    return src ? (
        <img src={src} alt={name} style={{ width: dimension, height: dimension }} className="rounded-full object-cover" />
    ) : (
        <div style={{ width: dimension, height: dimension }} className="rounded-full bg-emerald-600 flex items-center justify-center">
            <span className="text-white font-medium text-sm">{letter}</span>
        </div>
    );
};

export default Avatar;