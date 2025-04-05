import { useNavigate } from "react-router-dom";
import React from "react";

export const ToDashBoardButton = () => {
    const navigate = useNavigate();
    return <button
        onClick={() => navigate("/dashboard")}
        className="text-white flex items-center bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md transition-transform group"
    >
        <span
            className="mr-2 text-white group-hover:-translate-x-1 transition-transform"
        >←</span>
        Dashboard
    </button>
}