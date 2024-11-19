import { SomethingWrong } from "../components";

const NotFound = () => {
  return (
    <SomethingWrong
      title={"404"}
      subtitle={"Page Not Found"}
      description={"Sorry, the page you're looking for doesn&apos;t exist."}
    />
  );
};
export default NotFound;
