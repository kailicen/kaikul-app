import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type Props = {};

const sendContactForm = async (data: any) =>
  fetch("/api/contact", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to send message");
    return res.json();
  });

function Contact({}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    if (isChecked) {
      setIsSubmitting(true);
      try {
        await sendContactForm(formData);
        setIsSuccess(true);
        reset(); // reset the form data
      } catch (error) {
        console.log(error);
      }
      setIsSubmitting(false);
    } else {
      // show an error message or alert the user to check the checkbox
      alert("Please check the captcha checkbox before submitting the form.");
    }

    // window.location.href = `mailto:kailicen226@gmail?subject={formData.subject
    //   &body=Hi, my name is ${formData.name}. ${formData.message} (${formData.email})}`;
  };

  return (
    <div
      className="h-screen w-screen md:w-auto flex flex-col text-center
    max-w-7xl px-10 mx-auto items-center justify-center"
    >
      <h3 className="mb-20 uppercase tracking-[20px] text-2xl">Contact</h3>
      <div className="flex flex-col space-y-10 px-2 w-full md:w-[500px] items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2 w-full mx-auto"
        >
          <input
            {...register("name", { required: true })}
            placeholder="Name"
            className="contactInput"
            type="text"
          />
          {errors.name && (
            <span className="text-red-500">This field is required</span>
          )}
          <input
            {...register("email", { required: true })}
            placeholder="Email"
            className="contactInput"
            type="email"
          />
          {errors.email && (
            <span className="text-red-500">This field is required</span>
          )}
          <input
            {...register("subject", { required: true })}
            placeholder="Subject"
            className="contactInput"
            type="text"
          />
          {errors.subject && (
            <span className="text-red-500">This field is required</span>
          )}
          <textarea
            {...register("message", { required: true })}
            placeholder="Message"
            className="contactInput"
          ></textarea>
          {errors.message && (
            <span className="text-red-500">This field is required</span>
          )}

          {/* captcha */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="captcha"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="captcha">I am not a robot</label>
          </div>

          <button
            type="submit"
            className={`buttonMobile md:button ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? <div className="spinner"></div> : "Submit"}
          </button>
        </form>
        {isSuccess && (
          <p className="mt-3 text-green-500 text-sm">
            Your message has been sent!
          </p>
        )}
      </div>
    </div>
  );
}

export default Contact;
