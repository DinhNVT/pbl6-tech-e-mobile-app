import { StyleSheet } from "react-native";

const ColorStyles = {
  color: {
    primary_light: "#E6F0F4",
    primary_light_hover: "#DAE8EE",
    primary_light_active: "#B2D0DC",
    primary_normal: "#05668D",
    primary_normal_hover: "#055C7F",
    primary_normal_active: "#045271",
    primary_dark: "#044D6A",
    primary_dark_hover: "#033D55",
    primary_dark_active: "#022E3F",
    primary_darker: "#022431",
    secondary_50: "#FDF2F3",
    secondary_100: "#FAD5DB",
    secondary_200: "#F8C1C9",
    secondary_300: "#F4A5B1",
    secondary_400: "#F294A1",
    secondary_500: "#EF798A",
    secondary_600: "#D96E7E",
    secondary_700: "#AA5662",
    secondary_800: "#83434C",
    secondary_900: "#64333A",
    gray_25: "#FCFCFD",
    gray_50: "#F9FAFB",
    gray_100: "#F2F4F7",
    gray_200: "#E4E7EC",
    gray_300: "#D0D5DD",
    gray_400: "#98A2B3",
    gray_500: "#667085",
    gray_600: "#475467",
    gray_700: "#344054",
    gray_800: "#1D2939",
    gray_900: "#101828",
    error_25: "#FFFBFA",
    error_50: "#FEF3F2",
    error_100: "#FEE4E2",
    error_200: "#FECDCA",
    error_300: "#FDA29B",
    error_400: "#F97066",
    error_500: "#F04438",
    error_600: "#D92D20",
    error_700: "#B42318",
    error_800: "#912018",
    error_900: "#7A271A",
    warning_25: "#FFFCF5",
    warning_50: "#FFFAEB",
    warning_100: "#FEF0C7",
    warning_200: "#FEDF89",
    warning_300: "#FEC84B",
    warning_400: "#FDB022",
    warning_500: "#F79009",
    warning_600: "#DC6803",
    warning_700: "#B54708",
    warning_800: "#93370D",
    warning_900: "#792E0D",
    success_25: "#F6FEF9",
    success_50: "#ECFDF3",
    success_100: "#D1FADF",
    success_200: "#A6F4C5",
    success_300: "#6CE9A6",
    success_400: "#32D583",
    success_500: "#12B76A",
    success_600: "#039855",
    success_700: "#027A48",
    success_800: "#05603A",
    success_900: "#054F31",
  },
  fontSize: {
    title: 30,
    content: 20,
    normal: 16
  },
  buttonWidth: {
    main: "70%"
  },
  textInputWidth: {
    main: "80%"
  },
  borderRadius: {
    main: 25,
    small: 5
  }
};

const FontStyle = StyleSheet.create({
  subtitle_1: {
    fontFamily: 'Nunito-Regular',
    fontSize: 17,
    letterSpacing: 0.15
  },
  subtitle_2: {
    fontFamily: 'Nunito-Medium',
    fontSize: 15,
    letterSpacing: 0.1
  },
  body_1: {
    fontFamily: 'Nunito-Medium',
    fontSize: 17,
    letterSpacing: 0.5
  },
  body_2: {
    fontFamily: 'Nunito-Regular',
    fontSize: 15,
    letterSpacing: 0.25
  },
  BUTTON: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 15,
    letterSpacing: 1.25,
    textTransform: 'uppercase'
  },
  button: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 15,
    letterSpacing: 0.25
  },
  caption: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    letterSpacing: 0.4
  },
  OVERLINE: {
    fontFamily: 'Nunito-Regular',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase'
  },
  headline_1: {
    fontFamily: 'Nunito-Light',
    fontSize: 101,
    letterSpacing: -1.5,
  },
  headline_2: {
    fontFamily: 'Nunito-Light',
    fontSize: 63,
    letterSpacing: -0.5,
  },
  headline_3: {
    fontFamily: 'Nunito-Regular',
    fontSize: 36,
  },
  headline_4: {
    fontFamily: 'Nunito-Regular',
    fontSize: 36,
    letterSpacing: 0.25,
  },
  headline_5: {
    fontFamily: 'Nunito-Regular',
    fontSize: 25,
  },
  headline_6: {
    fontFamily: 'Nunito-Medium',
    fontSize: 21,
    letterSpacing: 0.15,
  },
})

const AppStyles = {
  ColorStyles,
  FontStyle
}
export default AppStyles
