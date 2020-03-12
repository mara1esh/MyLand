import React, { createContext, useReducer } from "react";
import { AnimatedRegion } from "react-native-maps";
import { LatLng, DrawType, MapType } from "../types/map";
import { getDistance } from "geolib";

const LATITUDE: number = 37.785834;
const LATITUDE_DELTA: number = 0.01;
const LONGITUDE: number = -122.406417;
const LONGITUDE_DELTA: number = 0.01;

enum ActionTypes {
  setLatitude = "setLatitude",
  setLatLng = "setLatLng",
  setLongitude = "setLongitude",
  setRouteCoordinates = "setRouteCoordinates",
  setDistance = "setDistance",
  setPrevLatLng = "setPrevLatLng",
  setDrawType = "setDrawType",
  cleanState = "cleanState",
  addMarker = "addMarker",
  changeMapType = "changeMapType"
}

type Action = {
  type: string;
  payload?: any;
};

type NavigatorState = {
  latitude: number;
  longitude: number;
  routeCoordinates: Array<LatLng>;
  distanceTravelled: number;
  prevLatLng: LatLng;
  coordinate: AnimatedRegion;
  drawType: DrawType;
  markers: LatLng[];
  mapType: MapType;
  setLatitude: (payload: number) => void;
  setLongitude: (payload: number) => void;
  setLatLng: (payload: LatLng) => void;
  setRouteCoordinates: (payload: LatLng) => void;
  setDistance: (payload: LatLng) => void;
  setPrevLatLng: (payload: LatLng) => void;
  setDrawType: (payload: DrawType) => void;
  addMarker: (payload: LatLng) => void;
  changeMapType: (payload: MapType) => void;
  cleanState: () => void;
};

const initialState: NavigatorState = {
  latitude: LATITUDE,
  longitude: LONGITUDE,
  routeCoordinates: [],
  distanceTravelled: -1,
  prevLatLng: { latitude: undefined, longitude: undefined },
  coordinate: new AnimatedRegion({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  }),
  drawType: DrawType.polyline,
  markers: [],
  mapType: MapType.hybrid,
  setLatitude: () => {},
  setLongitude: () => {},
  setLatLng: () => {},
  setRouteCoordinates: () => {},
  setDistance: () => {},
  setPrevLatLng: () => {},
  setDrawType: () => {},
  addMarker: () => {},
  cleanState: () => {},
  changeMapType: () => {}
};

function reducer(state: NavigatorState, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case ActionTypes.setLatitude:
      return {
        ...state,
        latitude: payload
      };
    case ActionTypes.setLongitude:
      return {
        ...state,
        longitude: payload
      };
    case ActionTypes.setLatLng: {
      const { latitude, longitude } = payload;
      return {
        ...state,
        latitude,
        longitude
      };
    }
    case ActionTypes.setRouteCoordinates: {
      const newRouteCoords = state.routeCoordinates.concat([payload]);
      return {
        ...state,
        routeCoordinates: newRouteCoords
      };
    }
    case ActionTypes.setDistance: {
      //const newDistance = calcDistance(state.prevLatLng, payload);
      let tmp = state.prevLatLng;
      if (state.prevLatLng.latitude === undefined) tmp = payload;
      const newDistance = getDistance(tmp, payload);
      return {
        ...state,
        distanceTravelled: state.distanceTravelled + newDistance
      };
    }
    case ActionTypes.setPrevLatLng:
      return {
        ...state,
        prevLatLng: payload
      };
    case ActionTypes.setDrawType:
      return {
        ...state,
        drawType: payload
      };
    case ActionTypes.cleanState:
      return {
        ...state, 
        //latitude: LATITUDE,
        //longitude: LONGITUDE,
        routeCoordinates: [],
        distanceTravelled: -1,
        prevLatLng: { latitude: undefined, longitude: undefined },
        coordinate: new AnimatedRegion({
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }),
        markers: [],
      };
    case ActionTypes.addMarker:
      return {
        ...state,
        markers: [...state.markers, payload]
      };
    case ActionTypes.changeMapType:
      return {
        ...state,
        mapType: payload
      }
    default:
      return state;
    }
}

export const NavigatorContext = createContext(initialState);

export const NavigatorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    latitude,
    longitude,
    routeCoordinates,
    distanceTravelled,
    prevLatLng,
    coordinate,
    drawType,
    markers,
    mapType
  } = state;

  return (
    <NavigatorContext.Provider
      value={{
        latitude,
        longitude,
        routeCoordinates,
        distanceTravelled,
        prevLatLng,
        coordinate,
        drawType,
        markers,
        mapType,
        setLatitude: (payload: number) =>
          dispatch({ type: ActionTypes.setLatitude, payload }),
        setLongitude: (payload: number) =>
          dispatch({ type: ActionTypes.setLongitude, payload }),
        setRouteCoordinates: (payload: LatLng) =>
          dispatch({ type: ActionTypes.setRouteCoordinates, payload }),
        setDistance: (payload: LatLng) =>
          dispatch({ type: ActionTypes.setDistance, payload }),
        setPrevLatLng: (payload: LatLng) =>
          dispatch({ type: ActionTypes.setPrevLatLng, payload }),
        setLatLng: (payload: LatLng) =>
          dispatch({ type: ActionTypes.setLatLng, payload }),
        setDrawType: (payload: DrawType) =>
          dispatch({ type: ActionTypes.setDrawType, payload }),
        addMarker: (payload: LatLng) =>
          dispatch({ type: ActionTypes.addMarker, payload }),
        changeMapType: (payload: MapType) => dispatch({ type: ActionTypes.changeMapType, payload }),
        cleanState: () => dispatch({ type: ActionTypes.cleanState })
      }}
    >
      {children}
    </NavigatorContext.Provider>
  );
};
