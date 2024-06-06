import {Type} from "class-transformer";

export default class Location {
    @Type(() => Number)
    lat!: number;
    @Type(() => Number)
    lng!: number;
}