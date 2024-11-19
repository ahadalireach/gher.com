import { ContactInfo, ContactForm } from "../components";

const ContactPage = () => {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl text-center font-bold text-green-700 mb-8">
        Get in Touch
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        <ContactInfo />
        <ContactForm />
      </div>
    </main>
  );
};

export default ContactPage;
