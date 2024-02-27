export const toImage = (image: string | { data: number[]; type: string }) => {
  if (!image) return undefined;
  if (typeof image === "string") return image;

  const arrayBufferView = new Uint8Array(image.data);
  const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
  const urlCreator = window.URL || window.webkitURL;
  return urlCreator.createObjectURL(blob);
};
