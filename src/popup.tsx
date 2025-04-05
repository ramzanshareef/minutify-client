import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
} from "@clerk/chrome-extension"
import React, { useEffect } from "react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { motion } from "framer-motion"
import { LogIn } from "lucide-react"

import "~style.css"
import Dashboard from "~dashboard"
import SummaryPage from "~summary"
import NewMeetingPage from "~NewMeetingPage"
import { PersistentRouter } from "~components/PersistentRouter"

const PUBLISHABLE_KEY = process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY
const EXTENSION_URL = chrome.runtime.getURL(".")

if (!PUBLISHABLE_KEY) {
    throw new Error(
        "Please add the PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env.development file"
    )
}

function IndexPopup() {
    useEffect(() => {
        const port = chrome.runtime.connect({ name: "keep-alive" })
        return () => port.disconnect()
    }, [])

    return (
        <ClerkProvider
            publishableKey={PUBLISHABLE_KEY}
            afterSignOutUrl={`${EXTENSION_URL}/popup.html`}
            signInFallbackRedirectUrl={`${EXTENSION_URL}/popup.html`}
            signUpFallbackRedirectUrl={`${EXTENSION_URL}/popup.html`}
        >
            <MemoryRouter>
                <div className="h-[800px] w-[800px] bg-gradient-to-tr from-indigo-50 to-white rounded-xl shadow-lg p-2 overflow-auto">
                    <header className="w-full">
                        <SignedOut>
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col items-center justify-center text-center space-y-6 mt-20"
                            >
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                    className="bg-indigo-300 p-4 rounded-full shadow-md"
                                >
                                    <LogIn size={36} className="text-indigo-600" />
                                </motion.div>
                                <h1 className="text-3xl font-semibold text-indigo-800">
                                    Welcome to <i>Minutify</i>
                                </h1>
                                <p className="text-gray-600 text-lg max-w-md">
                                    Your personal AI meeting assistant. Sign in to transcribe, summarize, and manage your meetings effortlessly.
                                </p>
                                <SignInButton mode="modal">
                                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-md text-lg shadow hover:bg-indigo-700 transition">
                                        Get Started
                                    </button>
                                </SignInButton>
                            </motion.div>
                        </SignedOut>

                        <SignedIn>
                            <PersistentRouter>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/meeting/:meetingID" element={<SummaryPage />} />
                                    <Route path="/new" element={<NewMeetingPage />} />
                                </Routes>
                            </PersistentRouter>
                        </SignedIn>
                    </header>
                </div>
            </MemoryRouter>
        </ClerkProvider>
    )
}

export default IndexPopup;