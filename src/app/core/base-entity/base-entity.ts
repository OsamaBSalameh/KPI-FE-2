export abstract class BaseEntity<T> {
    public id?: number | undefined 
    public createdAt?: Date | undefined
    public createdBy?: number

    public modifiedAt?: Date 
    public modifiedBy?: number

    public isEnabled: boolean = true

    constructor(model?: Partial<T>) {
        if (model) Object.assign(this, model);
        if (this.createdAt) this.createdAt = new Date(this.createdAt);
        if (this.modifiedAt) this.modifiedAt = new Date(this.modifiedAt);
    }

    public toJson(): any {
        return JSON.parse(JSON.stringify(this));
    }
}