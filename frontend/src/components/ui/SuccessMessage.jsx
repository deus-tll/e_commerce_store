/**
 * Displays a styled success notification message.
 * @param {object} props
 * @param {string} props.message The success message to display.
 * @param {object} [props.icon] Optional icon component to display (e.g., Mail, Check, etc.).
 */
const SuccessMessage = ({ message, icon = null }) => {
	if (!message) {
		return null;
	}

	const PassedIcon = icon;

	return (
		<div className="p-3 rounded bg-green-600 text-white">
			<div className='flex items-center space-x-2'>
				{PassedIcon && <PassedIcon className="h-4 w-4 flex-shrink-0" />}
				<span className='font-medium'>{message}</span>
			</div>
		</div>
	);
};

export default SuccessMessage;