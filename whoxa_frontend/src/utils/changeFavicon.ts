// @ts-nocheck
const changeFavicon = (url) => {
  const link =
    document.querySelector("link[rel*='icon']") ||
    document.createElement("link");
  link.type = "image/png"; // or "image/jpeg" for .jpg
  link.rel = "icon";
  link.href = url;
  document.getElementsByTagName("head")[0].appendChild(link);
};

export default changeFavicon;
