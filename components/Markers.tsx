import React from "react";
import { Marker } from "react-native-maps";
import { LatLng } from "types/map";

const Markers = ({ coords }) =>
  coords.length > 0 && coords.map((marker: LatLng, idx: number) => (
    <Marker key={idx} title={idx.toString()} coordinate={marker} />
  ));

export default Markers;
