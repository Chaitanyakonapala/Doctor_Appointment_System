

import { configureStore } from "@reduxjs/toolkit";
import { alertSlice } from "./features/alertSlice.js";
import { userSlice } from "./features/UserSlice.js";

export default configureStore({
    reducer:{
        alerts : alertSlice.reducer,
        user : userSlice.reducer,
    }
})

