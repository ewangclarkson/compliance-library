import { Container } from "inversify";
export default class DependencyInjectionManager {
    private readonly container;
    private static instance;
    private constructor();
    initializeBindings(): void;
    static getInstance(): DependencyInjectionManager;
    getContainer(): Container;
}
