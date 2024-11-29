import { Marker } from "./marker";

export interface User {
    uid: string;
    email: string;
    role:string;
    rut:number;
    markers?:Marker[];
}
