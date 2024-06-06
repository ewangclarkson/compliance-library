const DI = { //dependency injection types
    PersistenceFactory: Symbol.for("PersistenceFactory"),
    SecurityCompliance: Symbol.for("SecurityCompliance"),
    KafkaCompliance: Symbol.for("KafkaCompliance"),
    AppConfigurationProperties: Symbol.for("AppConfigurationProperties"),
};

export {DI};