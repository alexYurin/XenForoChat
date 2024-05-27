export const isImage = (file: File) => {
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png']

  return file && acceptedImageTypes.includes(file['type'])
}

export const getExt = (filename: string) => {
  const reExt = /(?:\.([^.]+))?$/

  const match = reExt.exec(filename)

  return match ? match[1] : null
}

export const filterByExt = (allowed: string[], files: File[]) => {
  return files.reduce(
    (result, file) => {
      const isInclude = allowed.includes(getExt(file.name) || '')

      return isInclude
        ? {
            ...result,
            allow: [...result.allow, file],
          }
        : {
            ...result,
            notAllow: [...result.notAllow, file],
          }
    },
    {
      allow: [] as File[],
      notAllow: [] as File[],
    },
  )
}

export const filterBySizeInMb = (maxMb: number, files: File[]) => {
  return files.reduce(
    (result, file) => {
      const isAllow = file.size / (1024 * 1024) <= maxMb

      return isAllow
        ? {
            ...result,
            allow: [...result.allow, file],
          }
        : {
            ...result,
            notAllow: [...result.notAllow, file],
          }
    },
    {
      allow: [] as File[],
      notAllow: [] as File[],
    },
  )
}
