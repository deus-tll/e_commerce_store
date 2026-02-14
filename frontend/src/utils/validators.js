const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateRequired = (val, fieldName) => {
	if (!val?.trim()) return `${fieldName} is required.`;
	return null;
};

export const validateEmail = (val) => {
	const requiredError = validateRequired(val, "Email");
	if (requiredError) return requiredError;

	if (!EMAIL_REGEX.test(val.trim())) {
		return "Invalid email address.";
	}

	return null;
};

export const validatePassword = (val, minLength = 6) => {
	if (!val) return "Password is required.";
	if (val.length < minLength) return `Password must be at least ${minLength} characters.`;
	return null;
};

export const validateConfirmPassword = (val, password, matchField = "Passwords") => {
	if (!val) return "Please confirm your password.";
	if (val !== password) return `${matchField} don't match.`;
	return null;
};

export const validatePrice = (val) => {
	const num = parseFloat(val);
	if (!val || isNaN(num) || num <= 0) {
		return "Price must be a positive number.";
	}
	return null;
};

export const validateStock = (val) => {
	const num = parseInt(val, 10);
	if (!val || isNaN(num) || num < 0) {
		return "Stock cannot be negative.";
	}
	return null;
};

export const validateRating = (val) => {
	if (!val || val < 1 || val > 5) {
		return "Please select a rating.";
	}
	return null;
};

export const validateImage = (val, isEdit, fieldName = "Image") => {
	if (!isEdit && !val) {
		return `${fieldName} is required.`;
	}
	return null;
};