const ContactInfo = () => {
  return (
    <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">
        Contact Information
      </h2>
      <p className="mb-6 text-gray-700">
        We&apos;re here to help with any questions. You can reach us through the
        details below or send a message using the form. We are excited to assist
        you with all your real estate requirements and ensure a smooth
        experience every step of the way!
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
      </div>
    </div>
  );
};

export default ContactInfo;
