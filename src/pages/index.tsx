import Head from "next/head";
import { ChangeEvent, FormEvent, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Submit email to server
    console.log(`Join waitlist: ${email}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>Startup Name</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="sticky w-full p-5 flex justify-between items-center max-w-6xl">
        <div>Logo</div>
        <button className="button">Contact Us</button>
      </header>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-3 md:px-20 lg:px-40 text-center">
        <h1 className="text-4xl md:text-6xl md:leading-[65px] font-bold">
          Find and build{" "}
          <span className="underline decoration-blue-500">
            meaningful friendship
          </span>{" "}
          with your self-improvement buddies.
        </h1>
        <h2 className="mt-6 text-lg md:text-xl px-0 md:px-32">
          Embarking on a solo personal development journey can be isolating,
          demotivating, and overwhelming. We help you stay on track in your
          hero&apos;s journey with a supportive community, personalized
          resources, and weekly updates.
        </h2>
        <form className="mt-8 w-full md:w-[500px]" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-3 md:flex-row md:space-x-3 items-center md:items-end">
            <input
              type="email"
              className="border rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              required
            />
            <button
              type="submit"
              className="button w-48 bg-black hover:bg-gray-800"
            >
              Join Waitlist
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
