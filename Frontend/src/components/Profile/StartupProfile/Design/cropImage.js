// cropImage.js
export default function getCroppedImg(imageSrc, pixelCrop) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        // Set canvas size to the cropped square
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
  
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
  
        // Convert canvas to Data URL
        canvas.toBlob((blob) => {
          if (!blob) {
            //reject(new Error('Canvas is empty'));
            console.error('Canvas is empty');
            return;
          }
          blob.name = 'cropped.jpeg';
          window.URL.revokeObjectURL(imageSrc);
          const croppedImageUrl = window.URL.createObjectURL(blob);
          resolve(croppedImageUrl);
        }, 'image/jpeg');
      };
      image.onerror = (error) => {
        reject(error);
      };
    });
  }
  