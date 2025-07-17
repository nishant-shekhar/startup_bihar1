export const getCroppedImg = (imageSrc, croppedAreaPixels, maxSize = 720) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const scale = Math.min(
        maxSize / croppedAreaPixels.width,
        maxSize / croppedAreaPixels.height,
        1 // don’t upscale
      );

      const targetWidth = croppedAreaPixels.width * scale;
      const targetHeight = croppedAreaPixels.height * scale;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        targetWidth,
        targetHeight
      );

      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.8 // compression quality (adjust as needed)
      );
    };
    image.onerror = reject;
  });
};
export const compressImage = (imageSrc, maxSize = 720) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const scale = Math.min(
        maxSize / img.width,
        maxSize / img.height,
        1 // avoid upscaling
      );

      const newWidth = Math.round(img.width * scale);
      const newHeight = Math.round(img.height * scale);

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        0.8
      );
    };
    img.onerror = reject;
  });
};
