import { AboutUs, ServicesOverview } from "../components";

const About = () => {
  return (
    <div className="max-w-6xl mx-auto p-3 flex flex-col gap-0 my-10">
      <AboutUs />
      <ServicesOverview />
    </div>
  );
};
export default About;
