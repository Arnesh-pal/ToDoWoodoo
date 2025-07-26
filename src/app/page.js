"use client";

import Link from "next/link";
import { FaTasks, FaArrowRight } from "react-icons/fa";
import Lottie from "lottie-react";
import taskAnimation from "./animations/task-animation.json";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100 text-foreground p-8 overflow-hidden">

      {/* Optional Blurred Blob Background */}
      <div className="absolute -top-10 -left-10 w-96 h-96 bg-indigo-300 rounded-full opacity-30 blur-3xl animate-pulse z-0"></div>

      {/* Lottie or Icon + Text */}
      <div className="z-10 text-center max-w-2xl">
        <div className="w-56 mx-auto mb-4">
          <Lottie animationData={taskAnimation} loop={true} />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-800">
          Welcome to <span className="text-indigo-600">ToDoWoodoo</span>
        </h1>

        <p className="text-lg text-muted-foreground mb-10">
          Organize tasks, boost focus with Pomodoro, and capture ideas with sticky notes — all in one magical workspace.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/Signup"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg"
          >
            Get Started <FaArrowRight />
          </Link>

          <Link
            href="/Login"
            className="w-full sm:w-auto text-indigo-700 font-medium hover:underline transition-colors"
          >
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
