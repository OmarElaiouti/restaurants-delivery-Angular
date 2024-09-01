import { IRestaurant } from "./IRestaurant";

export interface ICity {
    cityId: number;
    cityName: string;
    restaurants: IRestaurant[];
  }