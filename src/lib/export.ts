import { jsPDF } from 'jspdf'
import { convert } from 'html-to-text'
import type { Document } from '@/types'

export async function exportToTxt(document: Document): Promise<void> {
  const text = extractPlainText(document.content)
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${document.title || 'untitled'}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

export async function exportToMarkdown(document: Document): Promise<void> {
  const markdown = convertTiptapToMarkdown(document.content)
  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${document.title || 'untitled'}.md`
  a.click()
  URL.revokeObjectURL(url)
}

export async function exportToPdf(document: Document): Promise<void> {
  const pdf = new jsPDF()
  const text = extractPlainText(document.content)
  const lines = pdf.splitTextToSize(text, 180)
  pdf.text(lines, 10, 10)
  pdf.save(`${document.title || 'untitled'}.pdf`)
}

export async function exportToOdf(document: Document): Promise<void> {
  // ODF export is complex - for MVP, we'll export as HTML which can be opened in LibreOffice
  const html = convertTiptapToHTML(document.content)
  const blob = new Blob([html], { type: 'application/vnd.oasis.opendocument.text' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${document.title || 'untitled'}.odt`
  a.click()
  URL.revokeObjectURL(url)
}

function extractPlainText(content: any): string {
  if (!content) return ''
  
  if (typeof content === 'string') return content
  
  if (content.type === 'text') {
    return content.text || ''
  }
  
  if (content.content && Array.isArray(content.content)) {
    return content.content.map((node: any) => extractPlainText(node)).join('')
  }
  
  if (content.text) {
    return content.text
  }
  
  return ''
}

function convertTiptapToMarkdown(content: any): string {
  if (!content || !content.content) return ''
  
  let markdown = ''
  
  for (const node of content.content) {
    switch (node.type) {
      case 'heading':
        const level = node.attrs?.level || 1
        const headingText = extractTextFromNode(node)
        markdown += `${'#'.repeat(level)} ${headingText}\n\n`
        break
      case 'paragraph':
        const paraText = extractTextFromNode(node)
        if (paraText.trim()) {
          markdown += `${paraText}\n\n`
        }
        break
      case 'bulletList':
        markdown += convertListToMarkdown(node, false)
        break
      case 'orderedList':
        markdown += convertListToMarkdown(node, true)
        break
      case 'blockquote':
        const quoteText = extractTextFromNode(node)
        markdown += `> ${quoteText}\n\n`
        break
      default:
        const text = extractTextFromNode(node)
        if (text) markdown += text
    }
  }
  
  return markdown.trim()
}

function convertListToMarkdown(node: any, ordered: boolean): string {
  let markdown = ''
  if (node.content) {
    node.content.forEach((item: any, index: number) => {
      if (item.type === 'listItem' && item.content) {
        const prefix = ordered ? `${index + 1}. ` : '- '
        const text = extractTextFromNode(item)
        markdown += `${prefix}${text}\n`
      }
    })
  }
  return markdown + '\n'
}

function extractTextFromNode(node: any): string {
  if (!node) return ''
  if (node.type === 'text') return node.text || ''
  if (node.text) return node.text
  if (node.content && Array.isArray(node.content)) {
    return node.content.map((n: any) => extractTextFromNode(n)).join('')
  }
  return ''
}

function convertTiptapToHTML(content: any): string {
  // Simple HTML conversion for ODF compatibility
  if (!content || !content.content) return '<html><body></body></html>'
  
  let html = '<html><head><meta charset="UTF-8"></head><body>'
  
  for (const node of content.content) {
    switch (node.type) {
      case 'heading':
        const level = node.attrs?.level || 1
        const headingText = extractTextFromNode(node)
        html += `<h${level}>${escapeHtml(headingText)}</h${level}>`
        break
      case 'paragraph':
        const paraText = extractTextFromNode(node)
        html += `<p>${escapeHtml(paraText)}</p>`
        break
      case 'bulletList':
        html += '<ul>'
        if (node.content) {
          node.content.forEach((item: any) => {
            if (item.type === 'listItem') {
              const text = extractTextFromNode(item)
              html += `<li>${escapeHtml(text)}</li>`
            }
          })
        }
        html += '</ul>'
        break
      case 'orderedList':
        html += '<ol>'
        if (node.content) {
          node.content.forEach((item: any) => {
            if (item.type === 'listItem') {
              const text = extractTextFromNode(item)
              html += `<li>${escapeHtml(text)}</li>`
            }
          })
        }
        html += '</ol>'
        break
      default:
        const text = extractTextFromNode(node)
        if (text) html += escapeHtml(text)
    }
  }
  
  html += '</body></html>'
  return html
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

