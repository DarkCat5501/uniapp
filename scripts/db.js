const dbURL = `http://${location.host.split(":")[0]}:8090/`;
const dbConfig = {
  ns: "test",
  db: "test",
  sc: "allusers",
};

function handleOffline(endpoint, data) {
  if (location.host.includes("127.0.0.1")) {
    return null;
  }

  switch (endpoint) {
    case "signin":
      return {
        token: "NOTAREALTOKEN",
      };
    default:
      return null;
  }
}

/**
 * send a getRequest to the database
 * */
export async function ApiPost(endpoint, data) {
  let offdata = handleOffline(endpoint, data);

  if (offdata !== null) {
    return offdata;
  }

  const url = new URL(endpoint, dbURL);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "*/*",
    },
    body: JSON.stringify({
      ...data,
      ...dbConfig,
    }),
  });

  return response.json();
}
