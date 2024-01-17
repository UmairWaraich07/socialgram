import { useUserContext } from "@/contexts/userContext";

const Home = () => {
  const { isAuthenticated, userData } = useUserContext();
  console.log(isAuthenticated);
  console.log({ userData });
  return <div>Home</div>;
};

export default Home;
