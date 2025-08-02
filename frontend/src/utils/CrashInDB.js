export const updateCrashInDB = async (bet, crash, cashout) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/betHistory", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ bet, crash, cashout }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
    } catch (err) {
        console.error("Amount update failed:", err.message);
    }
}