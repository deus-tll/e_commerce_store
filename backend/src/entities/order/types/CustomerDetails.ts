export class CustomerDetails {
    public readonly fullName: string;
    public readonly phone: string;
    public readonly address: string;

    constructor(data: {
        fullName: string;
        phone: string;
        address: string;
    }) {
        this.fullName = data.fullName;
        this.phone = data.phone;
        this.address = data.address;
        Object.freeze(this);
    }
}