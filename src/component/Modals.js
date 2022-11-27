import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import AppStyles from "../theme/AppStyles";

export const ModalYesNo = (props) => {
  return (
    <View>
      <TouchableWithoutFeedback onPress={props.handleNo}>
        <View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={props.modalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text
                  style={[styles.modalText, AppStyles.FontStyle.subtitle_1]}
                >
                  {props.title}
                </Text>
                <View style={styles.buttonContainer}>
                  <Pressable
                    style={[styles.buttonModal, styles.buttonNo]}
                    onPress={props.handleNo}
                  >
                    <Text style={styles.textStyleNo}>Không</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.buttonModal, styles.buttonYes]}
                    onPress={props.handleYes}
                  >
                    <Text style={styles.textStyleYes}>Có</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonModal: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
  },
  buttonNo: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 10,
    width: 100,
    borderWidth: 1,
    borderColor: AppStyles.ColorStyles.color.gray_400,
  },
  buttonYes: {
    backgroundColor: AppStyles.ColorStyles.color.primary_normal,
    marginHorizontal: 10,
    width: 100,
  },
  textStyleNo: {
    color: "black",
    fontWeight: "400",
    textAlign: "center",
  },
  textStyleYes: {
    color: "white",
    fontWeight: "400",
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
