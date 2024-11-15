/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { toast } from "react-toastify";
import emailjs from "emailjs-com";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const serviceID = "service_qycyx02";
    const templateID = "template_f3n33vo";
    const userID = "7fWtiqQrwNqT9pZCz";

    const { name, email, message } = formData;
    if (!name || !email || !message) {
      toast.error("Please fill out all fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    emailjs
      .send(serviceID, templateID, formData, userID)
      .then((response) => {
        setSubmitLoading(false);
        toast.success(
          "Your message has been sent successfully! We'll get in touch with you asap."
        );
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      })
      .catch((error) => {
        setSubmitLoading(false);
        toast.error("Failed to send your message. Please try again later.");
      });
  };

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl text-center font-bold text-green-700 mb-8">
        Get in Touch
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Contact Information
          </h2>
          <p className="mb-6 text-gray-700">
            We're here to assist you with any questions or concerns. Reach out
            to us using the contact details below or send us a message using the
            form.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700">Phone</h3>
              <a
                href="tel:+923241441444"
                className="text-green-700 hover:text-green-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                +923241441444
              </a>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">Email</h3>
              <a
                href="mailto:gher.com.connect@gmail.com"
                className="text-green-700 hover:text-green-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                gher.com.connect@gmail.com
              </a>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">Address</h3>
              <p className="text-green-700 hover:text-green-800">
                Lahore, Punjab, Pakistan
              </p>
            </div>
            <p className="text-gray-700">
              We look forward to assisting you with your real estate needs!
            </p>
          </div>
        </div>
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="border rounded-lg p-4 w-full border-gray-300 outline-none focus:border-green-700 transition duration-300"
            />
            <input
              type="text"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="border rounded-lg p-4 w-full border-gray-300 outline-none focus:border-green-700 transition duration-300"
            />
            <textarea
              id="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="border rounded-lg p-4 w-full border-gray-300 outline-none focus:border-green-700 transition duration-300"
              rows={4}
            />
            <button
              type="submit"
              className="py-3 px-6 bg-green-700 text-white rounded-lg hover:bg-green-800 transition duration-300 font-semibold"
            >
              {submitLoading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
