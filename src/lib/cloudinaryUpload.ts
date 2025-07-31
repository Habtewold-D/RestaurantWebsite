// Client-side upload using our server-side API
export const uploadImageToCloudinary = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log("Starting server-side upload...");

    // Create a FormData object
    const formData = new FormData();
    formData.append('file', file);

    // Upload to our server-side API
    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      console.log("Upload response status:", response.status);
      return response.json();
    })
    .then(data => {
      console.log("Upload response data:", data);
      if (data.success && data.url) {
        resolve(data.url);
      } else {
        reject(new Error(data.error || 'Upload failed'));
      }
    })
    .catch(error => {
      console.error('Upload error:', error);
      reject(error);
    });
  });
};

// Alternative: Direct upload using base64 (for smaller files)
export const uploadImageAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}; 