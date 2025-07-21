"use client";
import Link from "next/link";
import { FaTasks, FaArrowRight } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-8">
      <div className="text-center max-w-2xl">
        <FaTasks className="mx-auto text-primary text-6xl mb-6" />
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Welcome to ToDoWoodoo
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          The all-in-one solution for managing tasks, tracking focus with a Pomodoro timer, and jotting down quick thoughts with sticky notes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/Signup"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-8 rounded-lg font-semibold hover:bg-primary/90 transition-transform transform hover:scale-105"
          >
            Get Started <FaArrowRight />
          </Link>
          <Link
            href="/Login"
            className="w-full sm:w-auto text-muted-foreground font-medium hover:text-foreground transition-colors"
          >
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
