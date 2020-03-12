import React from "react";
import { Content, Text } from "native-base";
import { Link, useHistory } from "react-router-native";
import { Alert } from "react-native";

const Main = () => {
  const history = useHistory();
  return (
    <Content
      contentContainerStyle={{
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: "#f1f3f4"
      }}
    >
      <Link to="/">
        <Text>Home</Text>
      </Link>
      <Link to="/map">
        <Text>Map</Text>
      </Link>
      <Link to="/other">
        <Text>Other</Text>
      </Link>
    </Content>
  );
};

export default Main;
