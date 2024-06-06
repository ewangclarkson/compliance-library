import {validate, ValidationError} from "class-validator"
import {ClassConstructor, plainToClass} from "class-transformer";

const validationErrors = async (
    input: any
): Promise<ValidationError[] | false> => {
    const error = await validate(input, {
        validationError: {target: false}
    });

    if (error.length) return error;

    return false;
};

export const RequestValidator = async <T>(
    type: ClassConstructor<T>,
    body: any): Promise<{ errors: boolean | string; input: T }> => {

    const input = plainToClass(type, body);

    const errors = await validationErrors(input);
    if (errors) {
        const errorMessage = errors.map((error: ValidationError) =>
            (Object as any).values(error.constraints)
        ).join(",'\n' ");
        return Promise.resolve({errors: errorMessage, input});
    }
    return Promise.resolve({errors: false, input});
};