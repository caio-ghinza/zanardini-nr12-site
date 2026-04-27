/**
 * Comprime uma imagem usando a Canvas API para garantir que arquivos de alta resolução
 * capturados em campo fiquem abaixo de 1MB antes do upload.
 */
export const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Resolução máxima de 1600px para manter performance no dashboard
        if (width > 1600) {
          height *= 1600 / width;
          width = 1600;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Comprime para 0.7 de qualidade (JPEG)
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.7);
      };
    };
  });
};
