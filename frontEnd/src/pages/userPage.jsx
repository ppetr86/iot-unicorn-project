import { LoginContext } from "../context/loginContext";
import { useContext } from "react";

function UserPage() {
  const { userData } = useContext(LoginContext);
  return (
    <div className="container">
      <h1>Logged user</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{userData.firstName}</td>
            <td>{userData.lastName}</td>
            <td>{userData.email}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default UserPage;
