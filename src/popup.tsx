import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
} from "@clerk/chrome-extension"
import React, { useEffect } from "react"
import { MemoryRouter, Route, Routes } from "react-router-dom"

import "~style.css"
import Dashboard from "~dashboard"
import SummaryPage from "~summary"
import NewMeetingPage from "~NewMeetingPage"
import { PersistentRouter } from "~components/PersistentRouter"

const PUBLISHABLE_KEY = process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY
const EXTENSION_URL = chrome.runtime.getURL(".")

if (!PUBLISHABLE_KEY) {
    throw new Error('Please add the PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env.development file')
}

function IndexPopup() {

    useEffect(() => {
        const port = chrome.runtime.connect({ name: 'keep-alive' });
        return () => port.disconnect();
    }, [])
    return (
        <ClerkProvider
            publishableKey={PUBLISHABLE_KEY}
            afterSignOutUrl={`${EXTENSION_URL}/popup.html`}
            signInFallbackRedirectUrl={`${EXTENSION_URL}/popup.html`}
            signUpFallbackRedirectUrl={`${EXTENSION_URL}/popup.html`}
        >
            <MemoryRouter>
                <div className="flex items-center justify-center h-[600px] w-[800px] flex-col">
                    <header className="w-full">
                        <SignedOut>
                            <div className="flex flex-col items-center justify-center">
                                <SignInButton mode="modal" />
                                <span className="text-indigo-700">You need to sign in to use the extension</span>
                            </div>
                        </SignedOut>
                        <SignedIn>
                            <PersistentRouter>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/summary/:meetingId" element={<SummaryPage />} />
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