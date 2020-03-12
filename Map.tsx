import React, { useState } from "react";
import Geolocation from "react-native-geolocation-service";
import { Button, View, Text, Alert, StyleSheet, SafeAreaView } from "react-native";

import MapView, {
  PROVIDER_GOOGLE,
  MarkerAnimated,
  Polyline,
  Region
} from "react-native-maps"; // remove PROVIDER_GOOGLE import if not using Google Maps

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

export default ({ onRegionChange, region, routeCoordinates, coordinate }) => {
  const { latitude, longitude } = region;
  //Alert.alert(longitude)
  const getMapRegion = () => ({
    latitude: region.latitude,
    longitude: region.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  });
  return (
    // <SafeAreaView style={{flex: 1}}>
    <View style={styles.container}>
      <MapView
        //provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        showsUserLocation
        followsUserLocation
        loadingEnabled
        onRegionChangeComplete={onRegionChange}
        region={{
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
      >
        <Polyline coordinates={routeCoordinates} strokeWidth={5} />
        <MarkerAnimated
          ref={marker => {
            this.marker = marker;
          }}
          coordinate={coordinate}
        />
      </MapView>
    </View>
    // </SafeAreaView>
  );
};
