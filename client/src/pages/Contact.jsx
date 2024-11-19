import { ContactForm } from "../components";

const ContactPage = () => {
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
            We&apos;re here to assist you with any questions or concerns. Reach
            out to us using the contact details below or send us a message using
            the form.
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
          <ContactForm />
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
