export type LatLng = {
    latitude: number;
    longitude: number;
  };

export enum DrawType {
  polygon = "polygon",
  polyline = "polyline" 
}

export enum MapType {
  standard = "standard", 
  satellite="satellite", 
  hybrid="hybrid"
}