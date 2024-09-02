import axios from "axios";
import * as React from "react";
import { useToast } from "./toastContext";

type TypeProps = {
  name: string;
  image: string;
};

type TypeResponse = {
  name: string;
  url: string;
};

interface PokemonContextData {
  types: Array<TypeProps>;
}

const PokemonContext = React.createContext<PokemonContextData>(
  {} as PokemonContextData
);

const PokemonTypeProvider = ({ children }: any) => {
  const [types, setTypes] = React.useState<TypeProps[]>([]);

  const { showToast } = useToast();

  const handleTypeImage = React.useCallback(async (url: string) => {
    try {
      const response = await axios.get(url);

      return response.data.sprites["generation-viii"]["sword-shield"]
        .name_icon as string;
    } catch (error) {
      showToast("Error to fetch data");
    }
  }, []);

  const handleTypes = React.useCallback(async () => {
    try {
      const typeResponse = await axios.get("https://pokeapi.co/api/v2/type");

      const response = await Promise.all(
        typeResponse.data.results.map(async (type: TypeResponse) => {
          const image = await handleTypeImage(type.url);
          return {
            name: type.name,
            image,
          };
        })
      );

      setTypes(response);
    } catch (error) {
      showToast("Error to fetch data");
    }
  }, []);

  React.useEffect(() => {
    handleTypes();
  }, []);

  return (
    <PokemonContext.Provider value={{ types }}>
      {children}
    </PokemonContext.Provider>
  );
};

function usePokemonType(): PokemonContextData {
  const context = React.useContext(PokemonContext);

  if (!context)
    throw new Error(
      "usePokemonType must be used within an PokemonTypeProvider"
    );

  return context;
}

export { PokemonTypeProvider, usePokemonType };
