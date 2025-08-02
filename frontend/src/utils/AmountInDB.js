export const updateAmountInDB = async(newAmount)=>{
    try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/amount", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ amount: newAmount }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
    } catch (err) {
        console.error("Amount update failed:", err.message);
    }
}


export const updateExpInDB = async (newExp,type) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/exp", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ exp:newExp , type }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
    } catch (err) {
        console.error("Amount update failed:", err.message);
    }
}