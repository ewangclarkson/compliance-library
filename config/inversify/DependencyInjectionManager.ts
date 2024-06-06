import {Container} from "inversify";
import {DI} from "./inversify.ioc.types"
import PersistenceFactoryImpl from "../../persistence/abstraction/implementation/PersistenceFactoryImpl";
import SecurityCompliance from "../../security/SecurityCompliance";
import SecurityComplianceImpl from "../../security/implementation/SecurityComplianceImpl";
import PersistenceFactory from "../../persistence/abstraction/PersistenceFactory";
import AppConfigurationProperties from "../AppConfigurationProperties";
import KafkaCompliance from "../../kafka/abstraction/KafkaCompliance";
import KafkaComplianceImpl from "../../kafka/abstraction/implementation/KafkaComplianceImpl";

//singleton design
export default class DependencyInjectionManager {
    private readonly container: Container;
    private static instance: DependencyInjectionManager;

    private constructor() {
        this.container = new Container();
    }

    initializeBindings() {
        this.container.bind<PersistenceFactory>(DI.PersistenceFactory).to(PersistenceFactoryImpl);
        this.container.bind<SecurityCompliance>(DI.SecurityCompliance).to(SecurityComplianceImpl);
        this.container.bind<KafkaCompliance>(DI.KafkaCompliance).to(KafkaComplianceImpl);
        this.container.bind<AppConfigurationProperties>(DI.AppConfigurationProperties).to(AppConfigurationProperties);
    }

    static getInstance(): DependencyInjectionManager {
        if (!this.instance) {
            this.instance = new DependencyInjectionManager();
        }
        return this.instance;
    }

    getContainer(): Container {
        return this.container;
    }

}
