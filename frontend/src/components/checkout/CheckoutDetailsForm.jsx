import {User, Phone, MapPin, CreditCard} from "lucide-react";

import useFormData from "../../hooks/useFormData.js";

import {validateRequired} from "../../utils/validators.js";

import FormField from "../ui/FormField.jsx";
import {Input} from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import {forwardRef, useImperativeHandle} from "react";

const getInitialState = () => ({
    fullName: "",
    phone: "",
    address: ""
});

const validationRules = {
    fullName: (val) => validateRequired(val, "Full name"),
    phone: (val) => validateRequired(val, "Phone number"),
    address: (val) => validateRequired(val, "Shipping address")
};

const CheckoutDetailsForm = forwardRef(({ onSubmit, loading }, ref) => {
    const { formData, errors, handleInputChange, validate } = useFormData(getInitialState());

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        if (validate(validationRules)) {
            onSubmit(formData);
        }
    }

    useImperativeHandle(ref, () => ({
        requestSubmit: handleSubmit
    }));

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-xl font-semibold text-emerald-400">Shipping Details</p>

            <FormField label="Full Name" error={errors.fullName}>
                <Input
                    leftIcon={User}
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                />
            </FormField>

            <FormField label="Phone Number" error={errors.phone}>
                <Input
                    leftIcon={Phone}
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+380..."
                />
            </FormField>

            <FormField label="Shipping Address" error={errors.address}>
                <Input
                    leftIcon={MapPin}
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="City, Street, Building..."
                />
            </FormField>

            <Button type="submit" disabled={loading} className="w-full justify-center lg:hidden">
                <CreditCard className="h-4 w-4" />
                {loading ? "Processing..." : "Pay Now"}
            </Button>
        </form>
    );
});

export default CheckoutDetailsForm;