//后台系统用户状态管理切片
import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit/react'

export interface CounterState {
  token:string
  isAdmin:number
}

const initialState: CounterState = {
    token:localStorage.getItem('access_token') || '',
    isAdmin: 0,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setIsAdmin:(state, action: PayloadAction<number>) => {
      state.isAdmin = action.payload
    },
  }
})

export const {setToken,setIsAdmin} = userSlice.actions

export default userSlice.reducer