import { useState, useCallback } from 'react';

const useFormData = (initialState) => {
	const [formData, setFormData] = useState(initialState);
	const [errors, setErrors] = useState({});

	const handleInputChange = useCallback((e) => {
		const { name, value } = e.target;

		setFormData(prev => ({
			...prev,
			[name]: value
		}));

		setErrors(prev => {
			if (!prev[name]) return prev;
			const newErrors = { ...prev };
			delete newErrors[name];
			return newErrors;
		});
	}, []);

	const setFormField = useCallback((name, value) => {
		setFormData(prev => ({
			...prev,
			[name]: value
		}));

		setErrors(prev => {
			if (!prev[name]) return prev;
			const newErrors = { ...prev };
			delete newErrors[name];
			return newErrors;
		});
	}, []);

	const validate = useCallback((validationRules, context = {}) => {
		const nextErrors = {};

		Object.keys(validationRules).forEach(field => {
			const rule = validationRules[field];
			const errorMessage = rule(formData[field], { ...formData, ...context });
			if (errorMessage) {
				nextErrors[field] = errorMessage;
			}
		});

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	}, [formData]);

	const resetForm = useCallback(() => {
		setFormData(initialState);
		setErrors({});
	}, [initialState]);

	return {
		formData,
		setFormData,
		errors,
		setErrors,
		handleInputChange,
		setFormField,
		validate,
		resetForm
	};
};

export default useFormData;