import axios from "axios";

export async function fetchMetadata(url: string) {
  const localStorageKey = `metadata_${encodeURIComponent(url)}`;

  try {
    const cachedData = localStorage.getItem(localStorageKey);
    if (cachedData) {
      // console.log("Loaded from localStorage:", JSON.parse(cachedData));
      return JSON.parse(cachedData);
    }

    const response = await axios.get(`https://api.microlink.io`, {
      params: { url },
    });

    const data = response.data.data;

    const metadata = {
      title: data.title || "",
      description: data.description || "",
      image: data.image?.url || data.logo?.url || "",
    };

    localStorage.setItem(localStorageKey, JSON.stringify(metadata));

    console.log("Fetched from API:", metadata);
    return metadata;
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return { title: "", description: "", image: "" };
  }
}
