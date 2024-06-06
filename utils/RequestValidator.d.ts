import { ClassConstructor } from "class-transformer";
export declare const RequestValidator: <T>(type: ClassConstructor<T>, body: any) => Promise<{
    errors: boolean | string;
    input: T;
}>;
