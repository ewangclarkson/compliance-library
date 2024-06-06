import { RetrievingPayload } from "../dto/RetrievingPayload";
export declare class RetrievingPayloadBuilder {
    private modelClass;
    private index;
    private id;
    private static instance;
    private constructor();
    static builder(): RetrievingPayloadBuilder;
    model(model: new () => any): RetrievingPayloadBuilder;
    elasticIndex(index: string): RetrievingPayloadBuilder;
    keyValue(id: string): this;
    build(): RetrievingPayload;
}
