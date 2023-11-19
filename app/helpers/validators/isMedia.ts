export const getMediaType = (text: string) => {
  const base64Regex = /^data:(image|audio|video)\/(png|jpeg|jpg|gif|webp|mpeg|mp4|mp3|ogg|webm);base64,([^\s]+)$/;

  const match = text.match(base64Regex);

  if (match) {
    switch (match[1]) {
      case 'image':
        return 'image';
      case 'audio':
        return 'audio';
      case 'video':
        return 'video';
      default:
        return null;
    }
  }
}

export const isMedia = (text: string) => {
  const base64Regex = /^data:(image|audio|video)\/(png|jpeg|jpg|gif|webp|mpeg|mp4|mp3|ogg|webm);base64,([^\s]+)$/;

  return base64Regex.test(text);
}

export const isImage = (text: string) => {
  const base64Regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,([^\s]+)$/;

  return base64Regex.test(text);
}

export const isVideo = (text: string) => {
  const base64Regex = /^data:video\/(mpeg|mp4|ogg|webm);base64,([^\s]+)$/;

  return base64Regex.test(text);
}

export const isAudio = (text: string) => {
  const base64Regex = /^data:audio\/(mpeg|mp3|ogg|webm);base64,([^\s]+)$/;

  return base64Regex.test(text);
}
