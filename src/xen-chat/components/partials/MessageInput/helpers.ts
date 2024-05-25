export const isImage = (file: File) => {
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png']

  return file && acceptedImageTypes.includes(file['type'])
}
