import { useContext } from "react";
import { LoginContext } from "../../context/loginContext";
import NavBar from "./navBar";
import NavBarLoggedOut from "./navBarLoggedOut";

function NavBarSwitch() {
  const { isLoggedIn } = useContext(LoginContext);

  return <>{isLoggedIn ? <NavBar /> : <NavBarLoggedOut />}</>;
}
export default NavBarSwitch;
