import { UserButton } from "@clerk/chrome-extension";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface MeetingSummary {
    sno: number;
    meetingId: string;
    summary: string;
    date: string;
    actionItems: string[];
}

function Dashboard() {
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        const handleWindowFocus = () => {
            setIsPopupOpen(true);
            chrome.storage.local.get(["recordingState"], (result) => {
                if (result.recordingState?.status === "recording") {
                    navigate("/new");
                }
            });
        };

        window.addEventListener("focus", handleWindowFocus);
        return () => window.removeEventListener("focus", handleWindowFocus);
    }, []);
    const [pastMeetings, setPastMeetings] = useState<MeetingSummary[]>([
        {
            sno: 1,
            meetingId: '65a8f1c887a8c76a8f1c887a',
            summary: 'Q4 Planning Session',
            date: '2024-01-15',
            actionItems: ['Prepare sales report', 'Update project timeline']
        },
        {
            sno: 2,
            meetingId: '65a8f1c887a8c76a8f1c887b',
            summary: 'Product Roadmap',
            date: '2024-01-18',
            actionItems: ['Review feature specs', 'Contact UX team']
        }
    ]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Meeting Summaries</h1>
                    <button
                        onClick={() => navigate("/new")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        New Meeting Summary
                    </button>

                    <UserButton />
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Meeting ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Summary</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {pastMeetings.map((meeting) => (
                                <tr key={meeting.meetingId}>
                                    <td className="px-6 py-4 text-sm text-gray-600">{meeting.sno}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                                        {meeting.meetingId.slice(-8)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{meeting.summary}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{meeting.date}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() => navigate(`/summary/${meeting.meetingId}`)}
                                            className="text-indigo-600 hover:text-indigo-800 font-medium group"
                                        >
                                            View Details <span
                                                className="inline-block transition-transform transform group-hover:translate-x-1 ml-1"
                                            >→</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {pastMeetings.length === 0 && (
                        <div className="text-center py-8 bg-gray-50">
                            <p className="text-gray-500">No past meetings found. Start a new meeting summary!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;