export class RetrievingPayload {
    model!: new () => any;
    index!: string;
    id: any;

    constructor(payload: { model: new () => any, index: string, id: any }) {
        this.model = payload.model;
        this.index = payload.index;
        this.id = payload.id;

    }
}