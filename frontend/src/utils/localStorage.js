export const loadState = ()=>{
    try{
        const data = localStorage.getItem("gameState");
        if(!data) return undefined;
        return JSON.parse(data)
    }catch(error){
        console.error("localstorage get error", error)
        return undefined;
    }
};

export const saveState = (state)=>{
    try{
        const data = JSON.stringify(state);
        localStorage.setItem("gameState",data);
    }catch(error){
        console.error("localstorage set error", error);
    }
}