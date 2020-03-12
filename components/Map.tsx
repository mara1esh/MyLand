import React, { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { LatLng, DrawType } from "../types/map";
import Markers from "./Markers";

import MapView, {
  PROVIDER_GOOGLE,
  Polyline,
  Polygon,
  Region,
  Marker
} from "react-native-maps";
export default ({
  onRegionChange,
  region,
  routeCoordinates,
  coordinate,
  drawType,
  markers,
  mapType
}) => {
  const { polyline, polygon } = DrawType;

  return (
    <MapView
      //provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      showsUserLocation
      mapType={mapType}
      //followsUserLocation
      loadingEnabled
      onRegionChangeComplete={onRegionChange}
      region={{
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: region.latDelta,
        longitudeDelta: region.lonDelta
      }}
    >
      <Markers coords={markers} />
      {drawType === polyline ? (
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={5}
          fillColor="yellow"
          tappable
          onPress={() => {
            Alert.alert("Coords", JSON.stringify(routeCoordinates));
          }}
        />
      ) : (
        <Polygon
          coordinates={routeCoordinates}
          strokeWidth={5}
          fillColor="yellow"
          tappable
          onPress={() => {
            Alert.alert("Coords", JSON.stringify(routeCoordinates));
          }}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});
