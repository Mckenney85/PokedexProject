// Main generic graphQL request
async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    "https://blue-surf-1310226.us-east-1.aws.cloud.dgraph.io/graphql",
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        query: operationsDoc,
        operationName,
        variables,
      }),
    }
  );

  return await result.json();
}

// Fetch all Pokemon
const fetchAllPokemonOperationsDoc = `
    query fetchAllPokemon {
        queryPokemon {
            id
            name
            captured
            imgUrl
            pokemonTypes
        }
    }
`;

function fetchAllPokemon() {
  return fetchGraphQL(fetchAllPokemonOperationsDoc, "fetchAllPokemon", {});
}

// Fetch Pokemon by type
const fetchPokemonOfCertainTypeOperationsDoc = (pokemonType) => `
    query fetchPokemonOfCertainType {
        queryPokemon(filter: { pokemonTypes: { eq: ${pokemonType} } }) {
            id
            name
            captured
            imgUrl
            pokemonTypes
        }
    }
`;

function fetchPokemonOfCertainType(pokemonType) {
  return fetchGraphQL(
    fetchPokemonOfCertainTypeOperationsDoc(pokemonType),
    "fetchPokemonOfCertainType",
    {}
  );
}

// Fecth Pokemon by captured status
const fetchPokemonByCapturedStatusOperationsDoc = (isCaptured) => `
    query fetchPokemonByCapturedStatus {
        queryPokemon(filter: {captured: ${isCaptured}}) {
            id
            name
            captured
            imgUrl
            pokemonTypes
        }
    }
`;

function fetchPokemonByCapturedStatus(isCaptured) {
  return fetchGraphQL(
    fetchPokemonByCapturedStatusOperationsDoc(isCaptured),
    "fetchPokemonByCapturedStatus",
    {}
  );
}

// Fetch Pokemon by Type and by Captured Status
const fetchPokemonOfCertainTypeAndByCapturedStatusOperationsDoc = ({
  pokemonType,
  isCaptured,
}) => `
    query fetchPokemonOfCertainTypeAndByCapturedStatus {
      queryPokemon(filter: { captured: ${isCaptured}, pokemonTypes: { eq: [${pokemonType}] } }) {
        id
        name
        captured
        imgUrl
        pokemonTypes
      }
    }
  `;

function fetchPokemonOfCertainTypeAndByCapturedStatus({
  pokemonType,
  isCaptured,
}) {
  return fetchGraphQL(
    fetchPokemonOfCertainTypeAndByCapturedStatusOperationsDoc({
      pokemonType,
      isCaptured,
    }),
    "fetchPokemonOfCertainTypeAndByCapturedStatus",
    {}
  );
}

// Fetch Pokemon
// Combines all the cases into a single function
export function fetchPokemon({ pokemonType, isCaptured }) {
  if (pokemonType !== "Any" && isCaptured !== "Any") {
    return fetchPokemonOfCertainTypeAndByCapturedStatus({
      pokemonType,
      isCaptured: isCaptured === "Captured",
    });
  } else if (pokemonType !== "Any") {
    return fetchPokemonOfCertainType(pokemonType);
  } else if (isCaptured !== "Any") {
    return fetchPokemonByCapturedStatus(isCaptured === "Captured");
  }

  return fetchAllPokemon();
}

// Updates the Pokemon Captured Status
const updatePokemonCapturedStatusOperationsDoc = (
  pokemonId,
  newIsCapturedValue
) => `
    mutation updatePokemonCapturedStatus {
        updatePokemon(input: {filter: {id: {eq: ${pokemonId}}}, set: {captured: ${newIsCapturedValue}}}) {
            pokemon {
                id
                name
                captured
                imgUrl
                pokemonTypes
            }
        }
    }
`;

export function updatePokemonCapturedStatus(pokemonId, newIsCapturedValue) {
  return fetchGraphQL(
    updatePokemonCapturedStatusOperationsDoc(pokemonId, newIsCapturedValue),
    "updatePokemonCapturedStatus",
    {}
  );
}
