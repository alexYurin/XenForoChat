export default function stripTagsFromHTML(htmlStr: string) {
  let div = document.createElement('div')

  div.innerHTML = htmlStr

  return div.textContent || div.innerText || ''
}
