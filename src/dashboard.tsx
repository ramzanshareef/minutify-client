import { UserButton, useUser } from "@clerk/chrome-extension"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import moment from "moment"
import { PlusCircle } from "lucide-react"
import React from "react"

function Dashboard() {
    const navigate = useNavigate()
    const { user } = useUser()
    const [pastMeetings, setPastMeetings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const handleWindowFocus = () => {
            chrome.storage.local.get(["recordingState"], (result) => {
                if (result.recordingState?.status === "recording") {
                    navigate("/new")
                }
            })
        }
        window.addEventListener("focus", handleWindowFocus)
        return () => window.removeEventListener("focus", handleWindowFocus)
    }, [])

    useEffect(() => {
        const fetchMeetings = async () => {
            if (!user?.primaryEmailAddress?.emailAddress) return
            setLoading(true)
            try {
                console.log(process.env);
                const res = await fetch("https://minutify-backend.vercel.app/api/meetings", {
                    method: "POST",
                    body: JSON.stringify({
                        userEmail: user.primaryEmailAddress.emailAddress,
                    }),
                })
                const data = await res.json()
                if (data.status === 200) {
                    setPastMeetings(data.meetings)
                } else {
                    console.error(data.message)
                }
            } catch (err) {
                console.error("Failed to fetch meetings:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchMeetings()
    }, [])

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-white p-4 overflow-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-6xl mx-auto"
            >
                <div className="flex justify-between items-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl font-extrabold text-indigo-800">📋 Meeting Summaries</h1>
                        <p className="text-gray-500 mt-1 text-sm">Review and revisit your AI-powered meeting transcripts.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-4"
                    >
                        <motion.button
                            initial={{ opacity: 0.95 }}
                            whileHover={{ opacity: 1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/new")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2 border shadow-sm transition"
                        >
                            <PlusCircle size={18} /> New Summary
                        </motion.button>
                        <UserButton />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-md border shadow-sm border-indigo-100 overflow-hidden"
                >
                    <table className="w-full text-sm rounded-md border shadow-sm">
                        <thead className="bg-indigo-100 text-indigo-700 text-xs font-bold uppercase">
                            <tr>
                                <th className="px-6 py-3 text-left">S.No</th>
                                <th className="px-6 py-3 text-left">Meeting ID</th>
                                <th className="px-6 py-3 text-left">Summary</th>
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-gray-700">
                            {pastMeetings?.map((meeting, index) => (
                                <motion.tr
                                    key={index}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="hover:bg-indigo-50 transition-all"
                                >
                                    <td className="px-6 py-4 font-semibold text-indigo-600 w-fit">{index + 1}</td>
                                    <td className="px-6 py-4 font-mono text-indigo-700">{meeting._id.toString().slice(0, 5)}...</td>
                                    <td className="px-6 py-4">{meeting.summary ? meeting.summary.slice(0, 30) + "..." : "No summary yet"}</td>
                                    <td className="px-6 py-4">{moment(meeting.createdAt).format("DD/MM/YY HH:mm A")}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => navigate(`/meeting/${meeting._id.toString()}`)}
                                            className="text-indigo-600 hover:text-indigo-800 font-medium group transition"
                                        >
                                            View Details <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>

                    {!loading && pastMeetings.length === 0 && (
                        <div className="text-center py-12 bg-indigo-50 text-gray-600">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg"
                            >
                                🚫 No past meetings found.
                                <br />
                                <span className="text-sm">Click “New Summary” above to get started.</span>
                            </motion.div>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-12 bg-indigo-50">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                                className="text-indigo-500 text-sm animate-pulse"
                            >
                                Loading your meetings...
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Dashboard;