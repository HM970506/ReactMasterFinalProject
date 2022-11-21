import { DefaultTheme } from "styled-components";

//테마를 새로 만들 땐 styled.d.ts에도 항상 type을 추가해주어야 한다~~!!
export const theme: DefaultTheme = {
    red: "#E51013",
    black: {
      veryDark: "#141414",
      darker: "#181818",
      lighter: "#2F2F2F",
    },
    white: {
      lighter: "#fff",
      darker: "#e5e5e5",
    },
  };