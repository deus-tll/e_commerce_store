import {Link} from "react-router-dom";
import {Search} from "lucide-react";

import Button from "./Button.jsx";

const EmptyState = ({ title = "Nothing here", description = "", icon = Search, action = null, showDefaultAction = false }) => {
    const PassedIcon = icon;

    return (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-900/30 rounded-2xl border border-dashed border-gray-800 text-center">
            <div className="bg-gray-800 p-4 rounded-full mb-4">
                <PassedIcon className="h-8 w-8 text-gray-500" />
            </div>

            <div className="text-emerald-400 text-xl font-semibold">{title}</div>
            {description && (
                <p className="text-gray-400 mt-2 max-w-sm mx-auto text-sm leading-relaxed">
                    {description}
                </p>
            )}

            {(action || showDefaultAction) && (
                <div className="mt-8">
                    {action || (
                        <Link to="/">
                            <Button variant="secondary">Go to Homepage</Button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default EmptyState;