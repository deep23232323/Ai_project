import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name:"message",
    initialState: {
        messages:[],
        artifacts:[],
        isLoading:false
        
    },
    reducers:{
        setMessages: (state, action) => {
            state.messages = action.payload
        },
        addMessages: (state, action) => {
            state.messages.push(action.payload)
        },
        setArtifacts: (state, action) => {
            state.artifacts=action.payload
        },
        setIsloading: (state, action) => {
            state.isLoading=action.payload
        }

        
    }
})

export const {setMessages,setIsloading, addMessages, setArtifacts} = messageSlice.actions

export default messageSlice.reducer