import { useState } from "react";

type WaitlistProps = {
  email: string;
};

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // call your API to store the email in your database or CRM
    const waitlistData: WaitlistProps = { email };
    fetch("/api/waitlist", {
      method: "POST",
      body: JSON.stringify(waitlistData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIsSuccess(true); // set the state to true if the response is successful
      })
      .catch((error) => console.error(error));

    setEmail(""); // clear the email input after submitting
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 w-full md:w-[500px]">
      <div className="flex flex-col space-y-3 md:flex-row md:space-x-3 items-center md:items-end">
        <input
          type="email"
          className="border rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-1 focus:ring-cyan-500"
          placeholder="you@example.com"
          value={email}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="button w-48 bg-gray-800 hover:bg-cyan-500"
        >
          Join Waitlist
        </button>
      </div>
      {isSuccess && (
        <p className="mt-3 text-green-500 text-sm">Email added to waitlist!</p>
      )}
    </form>
  );
};

export default Waitlist;
