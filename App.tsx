import React, { useEffect, useState, useContext } from "react";
import { NavigatorContext, NavigatorProvider } from "./State/Map";
import {
  NativeRouter,
  Route,
  Link,
  Switch,
  useHistory,
  useLocation
} from "react-router-native";

import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text
} from "native-base";

import {
  StyleSheet,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity
} from "react-native";
import MainScreen from "./screens/Main";
import MapContainer from "./screens/Navigator";

const WithRouter = ({ children, ...props }) => (
  <NativeRouter {...props}>{children}</NativeRouter>
);

const StartApp = () => {
  const history = useHistory();
  const location = useLocation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigatorProvider>
        <Container>
          <Header style={{ backgroundColor: "#f1f3f4" }}>
            <Text>Header</Text>
          </Header>
          <Switch>
          <Route exact path="/" component={MainScreen} />
          <Route exact path="/map" component={MapContainer} />
          </Switch>

          <Footer style={{ backgroundColor: "#f1f3f4" }}>
            <FooterTab>
              <Button
                active={location.pathname === "/map"}
                onPress={() => history.push("/map")}
              >
                <Icon name="navigate" />
                <Text>Navigation</Text>
              </Button>
              <Button
                active={location.pathname === "/"}
                vertical
                onPress={() => history.push("/")}
              >
                <Icon name="settings" />
                <Text>Menu</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </NavigatorProvider>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <WithRouter>
      <StartApp />
    </WithRouter>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e2ee"
  }
});
