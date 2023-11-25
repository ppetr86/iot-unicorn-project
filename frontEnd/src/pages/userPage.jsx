import GlobalDataFetch from "../services/globalDataFetch";

function UserPage() {
  const { data, isLoading, isError, error } = GlobalDataFetch();

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
      </div>
    );
  }
}
export default UserPage;
