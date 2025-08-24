import { useEffect, useState } from "react"

export const BetHistory = ({ open }) => {

    const [bets, setBets] = useState([]);

    const fetchBets = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch('http://localhost:8080/api/myBets', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            setBets(data.data);
        } catch (error) {
            console.error("bet fetching error", error);
        }
    }

    useEffect(() => {
        fetchBets();
    }, [])

    return (
        <>
            <div className="h-screen w-[100%] z-20 inset-0 absolute flex justify-center items-center bg-black/70">
                <div className="w-[90%] max-w-[500px] bg-neutral-900 py-4 bet-history rounded-xl">
                    <div className="text-center text-2xl font-bold">MY BETS</div>
                    <div className="flex justify-between mt-6 px-20"><p>Bet</p><p>X</p><p>Cashout</p></div>
                    <div className="w-full h-[50vh] overflow-y-scroll">
                        {bets && bets.map(e => {
                            return (
                                <div className="px-10">
                                    <div className={`w-full flex justify-between px-10 gap-5 border ${e.crash > 2 && e.cashout != 0 ? "border-blue-400" : e.crash > 5 && e.cashout != 0 ? "border-yellow-400" : e.cashout == 0 ? "border-red-400" : "border-green-500"} rounded-md px-4 py-1 mt-4`}>
                                        <p>{e.bet}</p>
                                        <p>{e.crash.toFixed(2)}</p>
                                        <p>{e.cashout.toFixed(2)}</p>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>
                    <div className="flex justify-center w-full mt-4">
                        <button onClick={() => open(false)} className="px-4 py-1 border cursor-pointer rounded-md">Close</button>
                    </div>
                </div>
            </div>
        </>
    )
}