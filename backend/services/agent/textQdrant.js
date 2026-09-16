import dotenv from "dotenv";
dotenv.config();

const url = `${process.env.QDRANT_URL}/collections`;

try {
  console.log("Testing:", url);

  const response = await fetch(url, {
    headers: {
      "api-key": process.env.QDRANT_API_KEY,
    },
  });

  console.log("STATUS:", response.status);
  console.log("BODY:", await response.text());

} catch (error) {
  console.error("FETCH FAILED");
  console.error(error);
  console.error("CAUSE:", error.cause);
}