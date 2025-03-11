'use client';

import { Button } from "@nextui-org/react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-blue-900 to-black p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold text-white md:text-6xl">
          Random Video Chat
        </h1>
        <p className="max-w-md text-lg text-gray-300">
          Meet new people through random video chat. Connect instantly with
          strangers from around the world.
        </p>
      </div>

      {session ? (
        <Link href="/chat">
          <Button
            size="lg"
            color="primary"
            variant="shadow"
            className="text-lg"
          >
            Start Video Chat
          </Button>
        </Link>
      ) : (
        <Button
          size="lg"
          color="primary"
          variant="shadow"
          className="text-lg"
          onClick={() => signIn("google")}
        >
          Sign in with Google
        </Button>
      )}

      <div className="mt-8 text-center text-sm text-gray-400">
        <p>By using this service, you agree to our Terms of Service & Privacy Policy.</p>
      </div>
    </div>
  );
} 