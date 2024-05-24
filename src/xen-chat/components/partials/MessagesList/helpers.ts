export const createNode = (htmlStr: string) => {
  const doc = new DOMParser().parseFromString(htmlStr, 'text/html')
  const element = doc.body.children[0]

  return element
}
