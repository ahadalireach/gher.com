import { useState } from "react";
import { toast } from "react-toastify";
import emailjs from "emailjs-com";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // ********* Handle Form Changes ********* //
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // ********* Handle Form Submit ********* //
  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitLoading(true);

    const serviceID = "service_qycyx02";
    const templateID = "template_f3n33vo";
    const userID = "7fWtiqQrwNqT9pZCz";

    const { name, email, message } = formData;
    if (!name || !email || !message) {
      toast.error("Please fill out all fields.");
      setSubmitLoading(false);
      return;
    }

    emailjs
      .send(serviceID, templateID, formData, userID)
      .then(() => {
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
        toast.error(
          error.message ||
            "Failed to send your message. Please try again later."
        );
      });
  };

  return (
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
          type="email"
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
          disabled={submitLoading}
        >
          {submitLoading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
