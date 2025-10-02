import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: "",
    nationalId: "",
    isVerifiedWithCredentials: false,
    isVerifiedWithBiometrics: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.username = action.payload.username;
            state.nationalId = action.payload?.photo_url || null; // only keep national ID
            state.isVerifiedWithCredentials = action.payload?.isVerifiedWithCredentials || false;
            state.isVerifiedWithBiometrics = action.payload?.isVerifiedWithBiometrics || false;
        },
        logOut: (state) => {
            state.username = "";
            state.nationalId = "";
            state.isVerifiedWithCredentials = false;
            state.isVerifiedWithBiometrics = false;
        },
        setNationalId: (state, action) => {
            state.nationalId = action.payload?.photo_url || null;
        }
    }
});

export const { setCredentials, logOut, setNationalId } = userSlice.actions;
export default userSlice.reducer;
