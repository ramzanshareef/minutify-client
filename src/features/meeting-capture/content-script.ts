// Listen for meeting platform specific elements
const detectMeetingPlatform = () => {
    if (window.location.hostname.includes('meet.google.com')) {
        return 'google-meet';
    }
    if (window.location.hostname.includes('zoom.us')) {
        return 'zoom';
    }
    return null;
};

// Main capture logic
const initializeMeetingCapture = async () => {
    const platform = detectMeetingPlatform();

    if (platform === 'google-meet') {
        // Capture Google Meet captions
        const captionObserver = new MutationObserver((mutations) => {
            const captions = Array.from(document.querySelectorAll('[role="log"] div'))
                .map(div => div.textContent)
                .filter(Boolean);

            chrome.runtime.sendMessage({
                type: 'CAPTIONS_UPDATE',
                payload: captions
            });
        });

        captionObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (platform === 'zoom') {
        // Zoom requires different handling
        setInterval(() => {
            const zoomCaptions = Array.from(document.querySelectorAll('.chat-message__body'))
                .map(el => el.textContent)
                .filter(Boolean);

            chrome.runtime.sendMessage({
                type: 'CAPTIONS_UPDATE',
                payload: zoomCaptions
            });
        }, 5000);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'complete') {
    initializeMeetingCapture();
} else {
    window.addEventListener('load', initializeMeetingCapture);
}