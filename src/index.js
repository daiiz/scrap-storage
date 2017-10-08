import request from 'superagent'

export default class ScrapStorage {
  constructor (projectName=null) {
    this.projectName = projectName
    this.scrapboxUrl = 'https://scrapbox.io'

    this.lines = {
      put: args => this.putLine(args),
      get: args => this.getLines(args),
      getMeta: args => this.getLinesMeta(args)
    }
  }

  _getProjectUrl () {
    if (!this.projectName) return null
    return `${this.scrapboxUrl}/${this.projectName}`
  }

  _getPageAPIEndpoint (pageName) {
    if (!this.projectName || !pageName) return null
    return `${this.scrapboxUrl}/api/pages/${this.projectName}/${pageName}`
  }

  async _fetchRawLines (pageTitle) {
    if (!pageTitle) return []
    const apiEndpoint = this._getPageAPIEndpoint(pageTitle)
    if (!apiEndpoint) return []
    const res = await request.get(apiEndpoint)
    if (!res.body || !res.body.lines || res.body.lines <= 0) return []
    // title行を除外
    const lines = res.body.lines.slice(1)
    return lines
  } 

  putLine ({ key, lines, metas }) {
    const projectUrl = this._getProjectUrl()
    const pageTitle = key
    if (!projectUrl) return []
    let body = lines.join('\n')
    if (metas && metas.length > 0) body += `[hr.icon]\n${metas.join('\n')}`
    body = window.encodeURIComponent(body)
    const scrapboxPageUrl = `${projectUrl}/${pageTitle}?body=${body}`
    window.open(scrapboxPageUrl)
  }

  async getLines ({ key }) {
    const lines = await this._fetchRawLines(key)
    const lineTexts = []
    for (let line of lines) {
      const text = line.text
      // [hr.icon] に達したら終了
      if (text.trim() === '[hr.icon]') break
      if (text.length === 0) continue
      lineTexts.push(text)
    }
    return lineTexts
  }

  async getLinesMeta ({ key }) {
    const lines = await this._fetchRawLines(key)
    const metaTexts = []
    let isMetaLine = false
    for (let line of lines) {
      const text = line.text
      if (text.trim() === '[hr.icon]') {
        isMetaLine = true
        continue
      }
      if (text.length === 0) continue
      if (!isMetaLine) continue
      lineTexts.push(text)
    }
    return lineTexts
  }
}
