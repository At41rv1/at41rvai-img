
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  const imageUrl = event.queryStringParameters?.imageUrl;

  if (!imageUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing imageUrl parameter" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  try {
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      return {
        statusCode: imageResponse.status,
        body: JSON.stringify({
          error: `Failed to fetch image from source: ${imageResponse.statusText}`,
        }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": imageResponse.headers.get("content-type") || "image/png",
      },
      body: Buffer.from(imageBuffer).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error: any) {
    console.error("Download proxy error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to process image download.",
        details: error.message,
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
