import * as monaco from 'monaco-editor'

export class CodeEditor {
  /**
   * Создает экземпляр едитора
   * @param {HTMLElement} el
   * @param {string} val
   * @param {string} lang
   */
  constructor(el, val, lang) {
    this.editor = monaco.editor.create(el, {
      value: val,
      language: lang,
    })
  }

  /**
   * Получает код едитора строку
   * @returns {string}
   */
  getValue() {
    return this.editor.getValue()
  }

  /**
   * Устанавливает значение едитора
   * @param {string} val
   */
  setValue(val) {
    this.editor.setValue(val)
  }
}
