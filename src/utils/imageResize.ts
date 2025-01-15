// utils/imageResize.ts
export const resizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      // Kiểm tra nếu file không phải là ảnh
      if (!file.type.startsWith('image/')) {
        reject(new Error('File không phải là ảnh'));
        return;
      }
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
  
          // Tính toán kích thước mới để giữ tỷ lệ
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
  
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
  
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
  
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Kiểm tra kích thước sau khi resize
                if (blob.size > 2 * 1024 * 1024) {  // > 2MB
                  // Thử resize lại với chất lượng thấp hơn
                  canvas.toBlob(
                    (lowerQualityBlob) => {
                      if (lowerQualityBlob) {
                        resolve(new File([lowerQualityBlob], file.name, {
                          type: file.type,
                          lastModified: Date.now(),
                        }));
                      }
                    },
                    file.type,
                    0.2  // Giảm chất lượng xuống 50%
                  );
                } else {
                  resolve(new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                  }));
                }
              }
            },
            file.type,
            0.3
          );
        };
      };
  
      reader.onerror = (error) => reject(error);
    });
  };