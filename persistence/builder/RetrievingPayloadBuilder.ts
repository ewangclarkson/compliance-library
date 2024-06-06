import {RetrievingPayload} from "../dto/RetrievingPayload";

export class RetrievingPayloadBuilder {
    private modelClass!: new () => any;
    private index!: string;
    private id: any = null;
    private static instance: RetrievingPayloadBuilder | null = null;

    private constructor() {}

    static builder(): RetrievingPayloadBuilder {
        if (!this.instance) {
            this.instance = new RetrievingPayloadBuilder();
        }
        return this.instance;
    }

    model(model: new () => any): RetrievingPayloadBuilder {
        this.modelClass = model;
        return this;
    }

    elasticIndex(index: string): RetrievingPayloadBuilder {
        this.index = index;
        return this;
    }

    //key that should be use when retrieving data from elastic search
    keyValue(id: string) {
        this.id = id;
        return this;
    }

    build(): RetrievingPayload {

        if (!this.modelClass || !this.index) throw Error("all mandatory fields must be populated");

        return new RetrievingPayload({
            model: this.modelClass,
            index: this.index,
            id: this.id
        });
    }

}