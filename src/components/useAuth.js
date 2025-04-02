import { useAuth } from "/AuthContext"; // ✅ Correct Import Path

const Home = () => {
  const authContext = useAuth(); // ✅ Ensure useAuth is returning an object

  if (!authContext) {
    return <h2>Error: AuthContext is undefined. Ensure AuthProvider is wrapping App.</h2>;
  }

  const { user } = authContext;

  if (!user) {
    return <h2>Please log in to continue.</h2>;
  }

  return <h1>Welcome, {user.email}</h1>;
};

export default Home;
