import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/donate",
        apiPath: "/api/actions/donate",
      },
    ],
  };

  const response = Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });

  console.log("GET response", response);

  return response;
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;
