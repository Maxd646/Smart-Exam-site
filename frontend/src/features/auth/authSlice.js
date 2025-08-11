import { createSlice } from "@reduxjs/toolkit";

<<<<<<< HEAD
 const initialState = {
=======
initialState = {
>>>>>>> 4446e73b0118fb75befe699b53f4db1b3adc2b38
    username: "",
    nationalId: "",
    biometricPhoto: null,
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
            //add the others here
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
