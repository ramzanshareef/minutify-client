import { UserButton, useUser } from "@clerk/chrome-extension"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ToDashBoardButton } from "~components/Buttons"
import { motion } from "framer-motion"

function SummaryPage() {
    const navigate = useNavigate();
    const { meetingID } = useParams();
    const [meetingDetails, setMeetingDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();

    useEffect(() => {
        const fetchMeeting = async () => {
            try {
                const res = await fetch(`${process.env.PLASMO_PUBLIC_BACKEND_URL}/api/meetings/getMeeting`, {
                    method: "POST",
                    body: JSON.stringify({
                        userEmail: user?.primaryEmailAddress?.emailAddress,
                        meetingID: meetingID,
                    }),
                })
                const data = await res.json()

                if (data.status !== 200) {
                    throw new Error(data.message || "Failed to fetch meeting")
                }

                setMeetingDetails(data.meeting)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (meetingID && user) fetchMeeting()
    }, [meetingID, user])

    const handleDelete = async () => {
        try {
            const res = await fetch(`${process.env.PLASMO_PUBLIC_BACKEND_URL}/api/meetings/deleteMeeting`, {
                method: "POST",
                body: JSON.stringify({
                    userEmail: user?.primaryEmailAddress?.emailAddress,
                    meetingID,
                }),
            })
            const data = await res.json()
            if (data.status === 200) {
                navigate("/dashboard")
            } else {
                alert("Failed to delete meeting: " + data.message)
            }
        } catch (error) {
            alert("An error occurred while deleting the meeting.")
        }
    }

    return (
        <div className="bg-transparent p-4 overflow-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
            >
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                        className="bg-transparent p-6 rounded-xl shadow-sm text-center text-gray-600 font-medium text-lg mt-4 animate-pulse"
                    >
                        Loading meeting details...
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white p-6 rounded-xl shadow-sm text-center text-red-600 font-medium text-lg mt-4"
                    >
                        Error: {error}
                    </motion.div>
                )}

                {!loading && !error && meetingDetails && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-xl border shadow-sm p-8 space-y-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <ToDashBoardButton />
                            <h1 className="text-2xl font-bold text-gray-800">Meeting Summary</h1>
                            <UserButton />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Meeting Date & Time</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {moment(meetingDetails?.createdAt).format("MMMM Do YYYY, h:mm A")}
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="md:col-span-2">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Summary</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {meetingDetails?.summary}
                                </p>
                            </div>

                            <div className="md:col-span-1">
                                <div className="bg-indigo-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-indigo-800 mb-4">Your Action Items</h3>
                                    <ul className="space-y-3">
                                        {meetingDetails?.actionItems?.map((item: string, index: number) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="flex items-start text-sm text-indigo-900"
                                            >
                                                <span className="mt-1 mr-2">•</span>
                                                {item}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-200 my-6" />

                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Transcript</h2>
                            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-line max-h-[400px] overflow-y-auto">
                                {meetingDetails?.transcript}
                            </div>
                        </div>

                        <div className="text-right pt-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDelete}
                                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all duration-200"
                            >
                                Delete Meeting
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}

export default SummaryPage;