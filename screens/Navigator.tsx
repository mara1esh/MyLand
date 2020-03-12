import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import Map from "../components/Map";
import { NavigatorContext } from "../State/Map";
import Geolocation from "@react-native-community/geolocation";
import { LatLng, DrawType, MapType } from "../types/map";
import { Region } from "react-native-maps";
import { getAreaOfPolygon } from "geolib";

import { Content, Button, Text, Icon, ActionSheet, Root } from "native-base";

const mapTypes: string[] = [
  MapType.standard,
  MapType.satellite,
  MapType.hybrid,
  "Cancel"
];
const MAP_CANCEL_INDEX = 3;
const drawTypes: string[] = [DrawType.polygon, DrawType.polyline, "Cancel"];
const DRAW_CANCEL_INDEX = 2;

const MapContainer: React.FC<{}> = () => {
  const {
    latitude,
    longitude,
    coordinate,
    distanceTravelled,
    markers,
    mapType,
    changeMapType,
    setRouteCoordinates,
    setDistance,
    setPrevLatLng,
    routeCoordinates,
    setLatLng,
    drawType,
    setDrawType,
    addMarker,
    cleanState
  } = useContext(NavigatorContext);

  const [watchID, setWatchID] = useState<number>(-1);
  const [area, setArea] = useState<string>("");

  const [delta, setDelta] = useState<{ lat: number; lon: number }>({
    lat: 0.01,
    lon: 0.01
  });

  const [highAccuracy, setHighAccuracy] = useState<boolean>(true);
  const [distanceFilter, setDistanceFilter] = useState<number>(6);

  useEffect((): void => {
    getCurrentPosition();
  }, []);

  const getCurrentPosition = (): void => {
    Geolocation.getCurrentPosition(
      position => {
        const {
          latitude: resLatitude,
          longitude: resLongitude
        } = position.coords;

        const newCoordinate: LatLng = {
          latitude: resLatitude,
          longitude: resLongitude
        };

        setLatLng(newCoordinate);
      },
      err => Alert.alert(err.message),
      { enableHighAccuracy: true }
    );
  };

  const subscribeToWatcher = (): void => {
    const tmp = Geolocation.watchPosition(
      position => {
        const {
          latitude: resLatitude,
          longitude: resLongitude
        } = position.coords;

        const newCoordinate: LatLng = {
          latitude: resLatitude,
          longitude: resLongitude
        };

        // TODO create checking for Android system
        coordinate.timing(newCoordinate).start();
        setLatLng(newCoordinate);
        setRouteCoordinates(newCoordinate);
        setDistance(newCoordinate);
        setPrevLatLng(newCoordinate);
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: highAccuracy, distanceFilter }
    );

    setWatchID(tmp);
  };

  const unsubscribeToWatcher = (): void => {
    Geolocation.clearWatch(watchID);
    setWatchID(-1);
  };

  const putMarker = (): void => {
    Geolocation.getCurrentPosition(
      position => {
        const {
          latitude: resLatitude,
          longitude: resLongitude
        } = position.coords;

        const newCoordinate: LatLng = {
          latitude: resLatitude,
          longitude: resLongitude
        };

        addMarker(newCoordinate);
      },
      err => Alert.alert(err.message),
      { enableHighAccuracy: true }
    );
  };

  const getArea = (): void => {
    const m2 = getAreaOfPolygon(routeCoordinates);
    const m2ToGa = m2 / 10000;
    setArea(`${m2.toFixed(2)} m2 || ${m2ToGa.toFixed(2)} Ga`);
  };

  const changeDrawType = (): void => {
    ActionSheet.show(
      {
        options: drawTypes,
        cancelButtonIndex: DRAW_CANCEL_INDEX,
        title: "Select type of draw"
      },
      (buttonIndex: number) => {
        if (buttonIndex === DRAW_CANCEL_INDEX) return;
        setDrawType(drawTypes[buttonIndex] as DrawType);
      }
    );
  };

  const handleMapType = (): void => {
    ActionSheet.show(
      {
        options: mapTypes,
        cancelButtonIndex: MAP_CANCEL_INDEX,
        title: "Select type of map"
      },
      (buttonIndex: number) => {
        if (buttonIndex === MAP_CANCEL_INDEX) return;
        changeMapType(mapTypes[buttonIndex] as MapType);
      }
    );
  };

  const mapProps = {
    region: { latitude, longitude, latDelta: delta.lat, lonDelta: delta.lon },
    onRegionChange: (region: Region) => {
      const { latitudeDelta, longitudeDelta, latitude, longitude } = region;
      setDelta({ lat: latitudeDelta, lon: longitudeDelta });
      setLatLng({ latitude, longitude });
    },
    routeCoordinates,
    markers,
    coordinate,
    styles: styles.map,
    drawType,
    mapType
  };
  return (
    <Root>
      <Content contentContainerStyle={styles.container}>
        <Map {...mapProps} />
        <View style={styles.activities}>
          <Button
            onPress={getCurrentPosition}
            style={[styles.buttonPattern, styles.btnMyPosition]}
          >
            <Icon name="person" />
          </Button>
          <Button
            onPress={handleMapType}
            style={[styles.buttonPattern, styles.btnMapType]}
          >
            <Icon name="map" />
          </Button>
          <Button
            onPress={changeDrawType}
            disabled={watchID !== -1}
            style={[ styles.btnChangeDraw]}
          >
            <Icon name="paper" />
          </Button>
        </View>

        <View style={styles.indicators}>
          {watchID !== -1 && distanceTravelled >= -1 && (
            <Button onPress={unsubscribeToWatcher} style={styles.buttonPattern}>
              <Text>Stop tracking</Text>
            </Button>
          )}
          {watchID === -1 && distanceTravelled === -1 && (
            <Button onPress={subscribeToWatcher} style={styles.buttonPattern}>
              <Text>Start tracking</Text>
            </Button>
          )}
          {watchID === -1 && distanceTravelled >= 0 && (
            <Button
              style={styles.buttonPattern}
              onPress={() => {
                if (watchID !== -1) unsubscribeToWatcher();
                cleanState();
                getCurrentPosition();
              }}
            >
              <Text>Reset</Text>
            </Button>
          )}

          {/* <Button onPress={putMarker}>
            <Text>Put marker</Text>
          </Button> */}
          {distanceTravelled > 1 && (
            <>
              <Text>Passed: {distanceTravelled}m.</Text>
              <Button
                onPress={getArea}
                style={styles.buttonPattern}
                disabled={!routeCoordinates.length}
              >
                <Text>Get</Text>
              </Button>
              <Text>{area}</Text>
            </>
          )}
        </View>
      </Content>
    </Root>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    margin: 0,
    position: "absolute",
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999
  },
  activities: {
    backgroundColor: "red",
    padding: 0,
    flexBasis: 0,
    marginTop: "30%",
    alignItems: "flex-end",
    paddingRight: 10
  },
  buttonPattern: {
    backgroundColor: "rgba(13, 125, 252, 0.80)"
  },
  btnMyPosition: {
    marginBottom: 5
  },
  btnMapType: {},
  btnChangeDraw: {
    marginTop: 160
  },
  indicators: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    left: 10
  }
});

export default MapContainer;
