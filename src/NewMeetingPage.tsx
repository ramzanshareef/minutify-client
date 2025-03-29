import React, { useEffect, useState } from "react";
import { ToDashBoardButton } from "~components/Buttons";
import { useNavigate } from "react-router-dom";

function NewMeetingPage() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<"idle" | "recording" | "processing">("idle");
    const [transcript, setTranscript] = useState("");
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [showPlayer, setShowPlayer] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);
    const [processingInterval, setProcessingInterval] = useState<NodeJS.Timeout>();

    const startRecording = async () => {
    };

    const stopRecording = async () => {
    };

    const cancelRecording = async () => {
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <ToDashBoardButton />
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Meeting Recorder</h1>

                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-3 h-3 rounded-full ${status === "recording" ? "bg-red-500 animate-pulse" :
                                status === "processing" ? "bg-yellow-500" : "bg-gray-400"
                                }`} />
                            <span className="text-sm font-medium text-gray-600">
                                {status === "recording" ? "Recording..." :
                                    status === "processing" ? "Processing..." : "Ready to record"}
                            </span>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={status === "recording" ? stopRecording : startRecording}
                                disabled={status === "processing"}
                                className={`${status === "recording" ? "bg-red-600 hover:bg-red-700" :
                                    "bg-green-600 hover:bg-green-700"
                                    } text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1`}
                            >
                                {status === "recording" ? "Stop & Save" : "Start Recording"}
                            </button>

                            {status === "recording" && (
                                <button
                                    onClick={cancelRecording}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    {status === 'processing' && (
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">
                                    Processing audio...
                                </span>
                                <span className="text-sm text-gray-500">
                                    {processingProgress}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${processingProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {showPlayer && audioUrl && (
                        <div className="mt-6 space-y-4 animate-fade-in">
                            <h2 className="text-lg font-semibold text-gray-800">Recording</h2>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <audio controls className="w-full">
                                    <source src={audioUrl} type="audio/webm" />
                                    Your browser does not support audio playback
                                </audio>
                                <div className="mt-4 flex gap-4">
                                    <button
                                        onClick={() => {
                                            const a = document.createElement('a');
                                            a.href = audioUrl;
                                            a.download = `meeting-${new Date().toISOString()}.webm`;
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                                    >
                                        Download Audio
                                    </button>
                                    <button
                                        onClick={() => {
                                            URL.revokeObjectURL(audioUrl);
                                            setAudioUrl(null);
                                            setShowPlayer(false);
                                            chrome.storage.local.remove(['currentRecording']);
                                        }}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Delete Recording
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {transcript && (
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Transcript</h2>
                            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                                <p className="text-gray-700 whitespace-pre-wrap text-sm">{transcript}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NewMeetingPage;