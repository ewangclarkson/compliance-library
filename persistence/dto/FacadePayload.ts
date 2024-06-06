import {EntityManager} from "typeorm";
import {PersistenceOperation} from "../PersistenceOperation";
import {ElasticIndex} from "../../config/constants/ElasticIndex";

export class FacadePayload {
    manager!: EntityManager;
    operation!: PersistenceOperation;
    model!: any;
    index!: string;
    data?: any;
    key!: string;
}