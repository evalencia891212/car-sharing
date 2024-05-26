import { Route } from "./route";

export class Station {
    station_id!: number;
    station_name!: string;
    location!: string;
    marker_type: string='station';
    course:number = 1;
    check_in!: string;
    active!: number;
    routes!:Route[];
}
