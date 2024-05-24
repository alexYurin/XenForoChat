export default function fromHTML(html: string, trim = true) {
  html = trim ? html.trim() : html

  if (!html) return null

  const template = document.createElement('template')

  template.innerHTML = html

  const result = template.content.children[0]

  return result
}
