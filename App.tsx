import React, { useEffect, useState } from "react";
import Geolocation from "@react-native-community/geolocation";
import {
  StyleSheet,
  Text,
  View,
  Button
} from "react-native";
import Map from "./Map";

export default function App() {
  const [error, setError] = useState("");
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0
  });

  useEffect(() => {
    Geolocation.requestAuthorization();
    getPosition();
  }, [])

  const getPosition = () => {
    Geolocation.getCurrentPosition(
      pos => {
        setError("");
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      e => setError(e.message)
    );
  };

  return (
    <View style={styles.container}>
      <Map coords={position} />
      <Button title="Get Current Position" onPress={getPosition} />
      {error ? (
        <Text>Error retrieving current position</Text>
      ) : (
        <>
          <Text>Latitude: {position.latitude}</Text>
          <Text>Longitude: {position.longitude}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
