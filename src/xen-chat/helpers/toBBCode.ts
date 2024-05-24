import html2bbcode from 'html2bbcode'

const converterBBCode = new html2bbcode.HTML2BBCode()

function normalizeHtml(str: string) {
  return (
    str && str.replace(/&nbsp;|\u202F|\u00A0/g, ' ').replace(/<br \/>/g, '<br>')
  )
}

function toBBCode(rHTML: string) {
  return converterBBCode.feed(normalizeHtml(rHTML.trim())).toString()
}

export default toBBCode
