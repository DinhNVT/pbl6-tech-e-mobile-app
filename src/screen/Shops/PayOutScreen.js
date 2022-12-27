import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { React, useEffect, useState } from "react";

import AppStyles from "../../theme/AppStyles";
import CartService from "../../config/service/CartService";

const PayOutScreen = () => {
  const [historyPayout, sẹtHistoryPayout] = useState("");
  const [money, setMoney] = useState(0);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getHistoryPayout = () => {
    CartService.getHistoryPayout().then((res) => {
      if (res?.data?.length > 0) {
        sẹtHistoryPayout(res.data[0]);
      } else console.log(res);
    });
  };

  const handleGetPayout = () => {
    setIsLoading(true);
    if (
      parseFloat(money) > 0 &&
      parseFloat(money) < historyPayout.current_balance
    ) {
      CartService.postGetPayout({
        money: money,
      }).then((res) => {
        if (res.message.includes("successfull")) {
          console.log("ok");
          getHistoryPayout();
          setSuccess(true);
          setError(false);
          setIsLoading(false);
        } else {
          console.log(res);
          setSuccess(false);
          setError(true);
          setIsLoading(false);
        }
      });
    } else {
      setSuccess(false);
      setError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getHistoryPayout();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView>
        <View
          style={{ display: "flex", flexDirection: "row", marginBottom: 8 }}
        >
          <Text style={[AppStyles.FontStyle.headline_5]}>
            Số tiền còn lại:{" "}
          </Text>
          <Text
            style={[
              AppStyles.FontStyle.headline_5,
              { color: AppStyles.ColorStyles.color.primary_normal },
            ]}
          >
            {!!historyPayout ? historyPayout.current_balance : "0"}$
          </Text>
        </View>
        {success && (
          <Text style={{ color: AppStyles.ColorStyles.color.success_400 }}>
            Rút tiền thành công
          </Text>
        )}
        {error && (
          <Text style={{ color: AppStyles.ColorStyles.color.error_400 }}>
            Rút tiền thất bại
          </Text>
        )}

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: 8,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextInput
            style={{
              borderRadius: 4,
              borderWidth: 1,
              borderColor: AppStyles.ColorStyles.color.primary_normal,
              width: "73%",
              paddingHorizontal: 8,
              fontSize: 17,
              height: 48,
            }}
            keyboardType="numeric"
            value={money.toString()}
            onChangeText={setMoney}
          ></TextInput>
          <TouchableOpacity
            onPress={handleGetPayout}
            style={{
              borderRadius: 4,
              borderWidth: 1,
              borderColor: AppStyles.ColorStyles.color.primary_normal,
              width: "25%",
              paddingHorizontal: 8,
              fontSize: 17,
              height: 48,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: AppStyles.ColorStyles.color.primary_normal,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={[AppStyles.FontStyle.button, { color: "white" }]}>
                Rút tiền
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View
          style={{
            borderTopColor: AppStyles.ColorStyles.color.gray_200,
            borderTopWidth: 1,
          }}
        >
          <Text style={[AppStyles.FontStyle.headline_6]}>Lịch sử rút tiền</Text>
          {!!historyPayout ? (
            historyPayout.payments.map((item) => (
              <View
                style={{
                  borderBottomColor: AppStyles.ColorStyles.color.gray_200,
                  borderBottomWidth: 1,
                  paddingVertical: 8,
                  marginBottom: 8,
                }}
              >
                <Text>
                  Thời gian:{" "}
                  {`${new Date(
                    item.created_at
                  ).toLocaleTimeString()} ${new Date(
                    item.created_at
                  ).toLocaleDateString()}`}
                </Text>
                <Text style={{ color: AppStyles.ColorStyles.color.error_400 }}>
                  Số tiền: -{item.money}$
                </Text>
              </View>
            ))
          ) : (
            <Text>Không có giao dịch</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PayOutScreen;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flex: 1,
    backgroundColor: "white",
  },
});
