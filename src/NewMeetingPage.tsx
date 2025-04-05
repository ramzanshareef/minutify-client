import React, { useEffect, useState, useRef } from "react"
import { useUser, UserButton } from "@clerk/chrome-extension"
import { useNavigate } from "react-router-dom"
import { ToDashBoardButton } from "~components/Buttons"
import { motion, AnimatePresence } from "framer-motion"

const MAX_FILE_SIZE_MB = 25

function NewMeetingPage() {
    const { user } = useUser()
    const navigate = useNavigate()
    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState<"idle" | "processing" | "completed" | "cancelled" | "error">("idle")
    const [percentageUploaded, setPercentageUploaded] = useState(0)
    const [errorMessage, setErrorMessage] = useState("")
    const progressInterval = useRef<NodeJS.Timeout | null>(null)
    const dropRef = useRef<HTMLLabelElement | null>(null)

    const resetProgress = () => {
        if (progressInterval.current) clearInterval(progressInterval.current)
        progressInterval.current = null
        setPercentageUploaded(0)
    }

    const resetAll = () => {
        resetProgress()
        setFile(null)
        setStatus("idle")
        setErrorMessage("")
    }

    useEffect(() => {
        if (status === "processing") {
            progressInterval.current = setInterval(() => {
                setPercentageUploaded(prev => (prev >= 99 ? 99 : prev + 1))
            }, 60)
        } else {
            resetProgress()
        }
    }, [status])

    const validateFile = (file: File) => {
        const sizeMB = file.size / (1024 * 1024)
        return sizeMB > MAX_FILE_SIZE_MB ? `File exceeds ${MAX_FILE_SIZE_MB}MB limit.` : null
    }

    const handleFileSelection = (incomingFile: File) => {
        const error = validateFile(incomingFile)
        if (error) {
            setErrorMessage(error)
            return
        }
        setFile(incomingFile)
        setErrorMessage("")
    }

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault()
        if (status !== "processing" && e.dataTransfer.files?.[0]) {
            handleFileSelection(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (status !== "processing" && e.target.files?.[0]) {
            handleFileSelection(e.target.files[0])
        }
    }

    const processFile = async () => {
        if (!file || !user) {
            setErrorMessage(file ? "User not authenticated." : "Please upload an audio file first.")
            return
        }

        setStatus("processing")
        const formData = new FormData()
        formData.append("audio", file)
        formData.append("userEmail", user.emailAddresses[0].emailAddress)

        try {
            const res = await fetch("http://localhost:3000/api/summarize", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()

            if (res.ok && data.transcript && data.meetingId) {
                setStatus("completed")
                setTimeout(() => navigate(`/meeting/${data.meetingId}`), 500)
            } else {
                throw new Error(data.message || "Something went wrong.")
            }
        } catch (err: any) {
            console.error("Upload error:", err)
            setErrorMessage(err.message || "Server error.")
            setStatus("error")
            resetAll()
        } finally {
            resetProgress()
        }
    }

    const handleCancel = () => {
        setStatus("cancelled")
        resetProgress()
        setTimeout(() => setStatus("idle"), 300)
    }

    const dismissError = () => setErrorMessage("")

    return (
        <motion.div
            className="p-4 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="max-w-3xl mx-auto">
                <motion.div
                    className="bg-white rounded-md shadow-lg p-10"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <ToDashBoardButton />
                        <UserButton />
                    </div>

                    <h1 className="text-4xl font-semibold text-gray-900 mb-3">Upload Meeting Recording</h1>
                    <motion.p
                        className="text-sm text-red-500 mb-4"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Don't close this popup while processing. You'll be redirected automatically.
                    </motion.p>

                    <motion.label
                        ref={dropRef}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className={`block mb-6 border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200 ${status === "processing"
                            ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                            : "border-indigo-300 hover:border-indigo-500 bg-indigo-50 hover:bg-indigo-100 cursor-pointer"
                            }`}
                        whileHover={{ scale: status !== "processing" ? 1.02 : 1 }}
                    >
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={handleChange}
                            disabled={status === "processing"}
                            className="hidden"
                        />
                        {status === "processing" ? (
                            <p className="text-gray-400">Processing in progress. File upload disabled.</p>
                        ) : (
                            <>
                                <p className="text-base text-indigo-700 font-medium">Click to upload or drag and drop an audio file</p>
                                <p className="text-xs text-gray-500 mt-1">Max size: {MAX_FILE_SIZE_MB}MB</p>
                            </>
                        )}
                    </motion.label>

                    {file && (
                        <motion.div className="mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">Selected File:</p>
                                    <p className="text-lg font-semibold text-gray-800 truncate">{file.name}</p>
                                </div>
                                <button onClick={resetAll} className="text-red-500 hover:text-red-700 text-sm underline ml-4">
                                    Remove
                                </button>
                            </div>
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {errorMessage && (
                            <motion.div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                                role="alert"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <strong className="font-bold">Error:</strong>
                                <span className="block sm:inline ml-1">{errorMessage}</span>
                                <button
                                    onClick={dismissError}
                                    className="absolute top-0 bottom-0 right-0 px-4 py-3 text-xl leading-none"
                                >
                                    &times;
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex gap-4">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={processFile}
                            disabled={!file || status === "processing"}
                            className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${status === "processing" ? "animate-pulse" : ""}`}
                        >
                            {status === "processing" ? (
                                <span className="flex items-center">
                                    <span className="mr-2">Processing</span>
                                    <motion.span
                                        className="inline-block animate-spin"
                                        initial={{ rotate: 0 }}
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    >⏳</motion.span>
                                </span>
                            ) : (
                                "Upload and Transcribe"
                            )}
                        </motion.button>

                        {status === "processing" && (
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCancel}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition duration-300"
                            >
                                Cancel
                            </motion.button>
                        )}
                    </div>

                    {status === "processing" && (
                        <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Uploading...</span>
                                <span>{percentageUploaded}%</span>
                            </div>
                            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: `${percentageUploaded}%` }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentageUploaded}%` }}
                                    transition={{ ease: "easeOut", duration: 0.5 }}
                                ></motion.div>
                            </div>
                        </motion.div>
                    )}

                    {status === "cancelled" && (
                        <motion.div
                            className="mt-6 text-yellow-600 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            Processing was cancelled.
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    )
}

export default NewMeetingPage;