import { AirType } from "../../models/products/characteristics/air-conditioning/air-type";
import { HeatCold } from "../../models/products/characteristics/air-conditioning/heat-cold";
import { GeneralCharacteristics } from "./general-characteristics";

export interface AirConditioningCharacteristics extends GeneralCharacteristics{
    airType: AirType;
    heatCold: HeatCold;
}
