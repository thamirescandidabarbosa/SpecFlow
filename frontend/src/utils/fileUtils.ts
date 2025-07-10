/**
 * Retorna um ícone apropriado para o tipo de arquivo baseado em sua extensão
 * @param fileName Nome do arquivo para determinar o ícone
 * @returns Elemento de ícone ou caractere representativo
 */
export const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  // Mapeamento de extensões para ícones
  switch (extension) {
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    case 'xls':
    case 'xlsx':
      return '📊';
    case 'ppt':
    case 'pptx':
      return '📑';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return '🖼️';
    case 'zip':
    case 'rar':
    case '7z':
      return '📦';
    case 'js':
    case 'jsx':
      return '📜';
    case 'ts':
    case 'tsx':
      return '🔷';
    case 'html':
      return '🌐';
    case 'css':
    case 'scss':
    case 'sass':
      return '🎨';
    case 'json':
      return '🔠';
    default:
      return '📄';
  }
};

/**
 * Formata o tamanho do arquivo em bytes para uma representação legível
 * @param bytes Tamanho do arquivo em bytes
 * @param decimals Número de casas decimais (padrão: 2)
 * @returns String formatada do tamanho do arquivo (ex: "2.5 MB")
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
