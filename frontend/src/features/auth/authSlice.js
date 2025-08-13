import { createSlice } from "@reduxjs/toolkit";

 const initialState = {
    username: "",
    nationalId: "",
    biometricPhoto: null,
    isVerifiedWithCredentials: false,
    isVerifiedWithBiometrics: false,
    //add the others here
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.username = action.payload.username;
            state.nationalId = action.payload?.nationalId;
            state.biometricPhoto = action.payload?.biometricPhoto;
            state.isVerifiedWithCredentials = action.payload?.isVerifiedWithCredentials || false;
            state.isVerifiedWithBiometrics = action.payload?.isVerifiedWithBiometrics || false;
        },
        logOut: (state) => {
            state.username = "";
            state.nationalId = "";
            state.biometricPhoto = null;
            //add the others here
        },
        setBiometricPhoto: (state, action) => {
            state.biometricPhoto = action.payload?.biometricPhoto;
        },
        setNationalId: (state, action) => {
            state.nationalId = action.payload?.nationalId;
        }

    }
})


export const { setCredentials, logOut, setBiometricPhoto, setNationalId } = userSlice.actions;
export default userSlice.reducer;
