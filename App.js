/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from "react";
import {
  View,
  Text,
  InteractionManager,
  Animated,
  Easing,
  Alert,
  Dimensions,
  PermissionsAndroid,
  StyleSheet
} from "react-native";
import { RNCamera } from "react-native-camera";
import { get, post } from "./request";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: "undetermined",
      show: true,
      animation: new Animated.Value(0)
    };
  }
  componentDidMount() {
    // post(222).then(res => console.log("res", res));
    this.requestCameraPermission();
  }

  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );

      const granted2 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Cool Photo App RECORD_AUDIO Permission",
          message:
            "Cool Photo App needs access to your RECORD_AUDIO " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );

      if (
        granted === PermissionsAndroid.RESULTS.GRANTED &&
        granted2 === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log("You can use the camera");
        this.setState({
          permissions: "granted"
        });
        InteractionManager.runAfterInteractions(() => {
          this.startAnimation();
        });
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  success = false;

  lastResult = null;

  barcodeReceived = e => {
    const currentResult = e.data;
    if (!this.success && currentResult !== this.lastResult) {
      this.success = true;
      this.lastResult = currentResult;
      Alert.alert(
        "扫描成功",
        "扫描结果：" + e.data,
        [
          {
            text: "取消",
            onPress: () => {
              this.lastResult = null;
              this.success = false;
            }
          },
          {
            text: "发送至服务器",
            onPress: () => {
              post(e.data).then(res => {
                Alert.alert(res.message);
                this.success = false;
              });
            }
          }
        ],
        {
          cancelable: false
        }
      );
    }
  };

  startAnimation() {
    if (this.state.show) {
      this.state.animation.setValue(0);
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear
      }).start(() => this.startAnimation());
    }
  }

  render() {
    const { permissions } = this.state;
    return (
      <View style={styles.container}>
        {permissions === "granted" && (
          <RNCamera
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            googleVisionBarcodeType={
              RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType
                .QR_CODE
            }
            flashMode={RNCamera.Constants.FlashMode.auto}
            onBarCodeRead={this.barcodeReceived}
          >
            <View
              style={{
                height: (height - 244) / 3,
                width: width,
                backgroundColor: "rgba(0,0,0,0.5)"
              }}
            />
            <View
              style={{
                flexDirection: "row"
              }}
            >
              <View style={styles.itemStyle} />
              <View style={styles.rectangle}>
                <Animated.View
                  style={[
                    styles.animatedStyle,
                    {
                      transform: [
                        {
                          translateY: this.state.animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 200]
                          })
                        }
                      ]
                    }
                  ]}
                />
              </View>
              <View style={styles.itemStyle} />
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                width: width,
                alignItems: "center"
              }}
            >
              <Text style={styles.textStyle}>
                将二维码放入框内， 即可自动扫描
              </Text>
            </View>
          </RNCamera>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  preview: {
    flex: 1
  },
  itemStyle: {
    backgroundColor: "rgba(0,0,0,0.5)",
    width: (width - 200) / 2,
    height: 200
  },
  textStyle: {
    color: "#fff",
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 18
  },
  animatedStyle: {
    height: 2,
    backgroundColor: "#00c050"
  },
  rectangle: {
    height: 200,
    width: 200
  }
});
