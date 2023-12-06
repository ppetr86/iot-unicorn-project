import GlobalDataFetch from "../services/globalDataFetch";
import CreateTerrariumToken from "../components/modalWindows/createTerrariumToken";
import { useState, useContext } from "react";
import { Button } from "react-bootstrap";
import { LoginContext } from "../context/loginContext";

function UserPage() {
  const { data, isLoading, isError, error } = GlobalDataFetch();
  const [jwtTerrariumIsOpen, setJwtTerrariumIsOpen] = useState(false);
  const { accessToken } = useContext(LoginContext);

  const openJwtModal = () => {
    setJwtTerrariumIsOpen(true);
  };
  const closeJwtModal = () => {
    setJwtTerrariumIsOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred {`${error}`}</div>;
  }

  if (data) {
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
              <td>{data.data.firstName}</td>
              <td>{data.data.lastName}</td>
              <td>{data.data.email}</td>
            </tr>
          </tbody>
        </table>
        <Button variant="primary" onClick={openJwtModal}>
          Get token for your gateway
        </Button>
        {data && (
          <CreateTerrariumToken
            id="createTerrariumToken"
            isOpen={jwtTerrariumIsOpen}
            closeModal={closeJwtModal}
            accessToken={accessToken}
            // resetMutation={resetMutation}
          />
        )}
      </div>
    );
  }
}
export default UserPage;
