import { useState } from "react";

type WaitlistProps = {
  email: string;
};

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // new state to track loading state

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true); // set loading state to true before making the API call
    const waitlistData: WaitlistProps = { email };
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        body: JSON.stringify(waitlistData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      setIsSuccess(true);
      setEmail("");
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false); // set loading state to false after the API call is completed
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 w-full md:w-[500px]">
      <div className="flex flex-col space-y-3 md:flex-row md:space-x-3 items-center md:items-end">
        <input
          type="email"
          className="border rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="you@example.com"
          value={email}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="button w-48 bg-gray-800 hover:bg-teal-500"
          disabled={isLoading} // disable the button when loading
        >
          {isLoading ? "Joining..." : "Join Waitlist"}{" "}
          {/* display a spinner when loading */}
        </button>
      </div>
      {isSuccess && (
        <p className="mt-3 text-green-500 text-sm">Email added to waitlist!</p>
      )}
    </form>
  );
};

export default Waitlist;
