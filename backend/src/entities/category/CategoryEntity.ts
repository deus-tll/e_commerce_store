export class CategoryEntity {
    public readonly id: string;
    public readonly name: string;
    public readonly slug: string;
    public readonly image: string;
    public readonly allowedAttributes: readonly string[];
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(data: { id: string; name: string; slug: string; image: string; allowedAttributes: readonly string[]; createdAt: Date; updatedAt: Date; }) {
        this.id = data.id;
        this.name = data.name;
        this.slug = data.slug;
        this.image = data.image;
        this.allowedAttributes = Object.freeze([...data.allowedAttributes]);
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;

        Object.freeze(this);
    }
}