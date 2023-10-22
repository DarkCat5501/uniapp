const dbURL = "http://localhost:8090/";
const dbConfig = {
  ns: "test",
  db: "test",
  sc: "allusers",
};
/**
 * send a getRequest to the database
 * */
export async function ApiPost(endpoint, data) {
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

//TODO: create a post method
