import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToDashBoardButton } from "~components/Buttons";

interface MeetingDetails {
    meetingId: string;
    date: string;
    summary: string;
    actionItems: string[];
}

function SummaryPage() {
    const navigate = useNavigate();
    const { meetingId } = useParams();

    // Mock data - replace with actual data fetching
    const meetingDetails: MeetingDetails = {
        meetingId: meetingId || '',
        date: '2024-01-15 14:30 PM',
        summary: 'The Q4 planning session focused on aligning team objectives with company goals. Key decisions included budget allocations for marketing initiatives and timeline adjustments for product launches. Engineering team committed to delivering Phase 1 by March end.',
        actionItems: [
            'Prepare sales report by Jan 25th',
            'Update project timeline document',
            'Schedule follow-up meeting with stakeholders',
            'Review and approve budget allocations'
        ]
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <ToDashBoardButton />
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <div className="mb-8">
                        <p className="text-sm text-gray-500 mb-2">Meeting Date & Time</p>
                        <p className="text-lg font-semibold text-gray-800">
                            {meetingDetails.date}
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Meeting Summary</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {meetingDetails.summary}
                            </p>
                        </div>

                        <div className="md:col-span-1">
                            <div className="bg-indigo-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-indigo-800 mb-4">Your Action Items</h3>
                                <ul className="space-y-3">
                                    {meetingDetails.actionItems.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start text-sm text-indigo-900"
                                        >
                                            <span className="mt-1 mr-2">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SummaryPage;