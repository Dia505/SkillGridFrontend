import { createContext, useState } from "react";

export const InfoContext=createContext();


export const InfoProvider=({children})=>{
    const [name,setName]=useState("User")
    return <InfoContext.Provider value={{name,setName}}>
        {children}
    </InfoContext.Provider>
}