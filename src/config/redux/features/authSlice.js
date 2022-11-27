import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: "",
  token: {
    refresh: '',
    access: ''
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setDataUser: (state, action) => {
      state.data = action.payload;
    },
    setTokenUser: (state, action) => {
      state.token = {
        refresh: action.payload.refresh,
        access: action.payload.access
      }
    },
    clearDataUser:(state) => {
      state.data = ''
      state.token = {
        refresh: '',
        access: ''
      }
    }
  },
});
export const { setDataUser, setTokenUser, clearDataUser } = authSlice.actions
// import { useSelector, useDispatch } from 'react-redux'
// import { decrement, increment } from './counterSlice'
// const count = useSelector(state => state.counter.value)
//   const dispatch = useDispatch()
// onClick={() => dispatch(increment())}
export default authSlice.reducer;
