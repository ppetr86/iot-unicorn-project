import { useQuery } from "react-query";
import { ApiService } from "../services/apiService";

function CreateTerrarium() {
  const { data, isLoading, isError } = useQuery("animalData", async () => {
    const response = await ApiService.getAllAnimalKinds();
    return response.data;
  });

  return (
    <>
      {isError && <div>Error fetching data</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>Animal kind data: {JSON.stringify(data)}</div>
      )}
    </>
  );
}

export default CreateTerrarium;
