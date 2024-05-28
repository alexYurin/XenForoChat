import ReactDOM from 'react-dom/client'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { useXenForoApiStore } from './store'
import { XenChatMode } from './enums'

/* @tag
  CUSTOM_ELEMENT_TAG - Название кастомного тега
*/

/* @selectors
  SELECTORS.trigger - Класс для открытия/закрытия приложения в popup режиме
*/

/* @attributes
  DATA_SET['data-api-url'] - Атрибут для адреса api в popup режиме
  DATA_SET['data-id'] - Атрибут кнопки тригера для id dom-элемента приложения в popup режиме
  DATA_SET['data-token'] - Атрибут кнопки тригера для передачи  токена в приложения в popup режиме
  DATA_SET['data-visible'] - Атрибут кнопки тригера, отражаущий состояние активности приложения в popup режиме
*/

/* @props
  Все пропсы передаются в кастомный тег элемента (CUSTOM_ELEMENT_TAG) в виде атрибутов
  с соответсвующим названием (без приставки 'data-')

  api-url: string - url для api
  token: string - Ключ авторизации в xenForo. Передается в заголовок XF-Api-Key при запросах к апи
  mode?: 'basic' | 'popup' - Параметр переключающий режимы окна чата.
*/

const CUSTOM_ELEMENT_TAG = 'xen-chat'

const SELECTORS = {
  app: `.${CUSTOM_ELEMENT_TAG}`,
  trigger: '.xf-open-trigger',
}

const CLASSNAMES = {
  app: CUSTOM_ELEMENT_TAG,
  minimize: 'minimize',
}

const DATA_SET = {
  id: 'data-id',
  apiUrl: 'data-api-url',
  token: 'data-token',
  visible: 'data-visible',
}

export default class XenChatElement extends HTMLElement {
  root: ReactDOM.Root | null = null
  mode: XenChatMode = XenChatMode.BASIC

  modes = [XenChatMode.BASIC, XenChatMode.POPUP]

  static get observedAttributes() {
    return ['api-url', 'token', 'mode']
  }

  async render() {
    const module = import('./XenChatApp')

    const XenChatApp = (await module).default

    const shadowRoot = this.attachShadow({ mode: 'open' })

    const cache = createCache({
      key: 'css',
      prepend: true,
      container: shadowRoot,
    })

    this.root = ReactDOM.createRoot(shadowRoot)

    this.root.render(
      <CacheProvider value={cache}>
        <XenChatApp
          root={this}
          mode={this.mode}
          closeApp={this.closePopup.bind(this)}
        />
      </CacheProvider>,
    )
  }

  connectedCallback() {
    const mode = this.getAttribute('mode') || ''

    if (this.isMode(mode)) {
      this.mode = mode
    }

    this.render()
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue == newValue) {
      return
    }

    switch (name) {
      case 'token':
        useXenForoApiStore.getState().updateToken(newValue)

        break

      case 'api-url': {
        useXenForoApiStore.getState().updateApiUrl(newValue)
      }

      case 'mode': {
        if (this.isMode(newValue)) {
          this.mode = newValue
        }

        break
      }
    }
  }

  closePopup() {
    const trigger = document.querySelector(
      `[${DATA_SET.id}=${this.getAttribute('id')}]`,
    )

    if (trigger) {
      trigger.removeAttribute(DATA_SET.visible)

      this.unmount()
    }
  }

  unmount() {
    this.root?.unmount()
    this.remove()
  }

  createTagLink(url: string) {
    const linkTag = document.createElement('link')

    linkTag.setAttribute('rel', 'stylesheet')
    linkTag.setAttribute('href', url)

    return linkTag
  }

  createTagScript(src: string, type = 'module') {
    const scriptTag = document.createElement('script')

    scriptTag.setAttribute('type', type)
    scriptTag.setAttribute('src', src)

    return scriptTag
  }

  isMode(mode: string): mode is XenChatMode {
    return this.modes.includes(mode as XenChatMode)
  }
}

const isDefineCustomElement = () => customElements.get(CUSTOM_ELEMENT_TAG)

const defineCustomElement = () =>
  customElements.define(CUSTOM_ELEMENT_TAG, XenChatElement)

const isExistCustomElement = (token: string) => {
  const elements = document.body.getElementsByTagName(CUSTOM_ELEMENT_TAG)

  return Array.from(elements).reduce((isExist, current) => {
    const currentToken = current.getAttribute('token')

    if (token === currentToken) {
      isExist = true
    }

    return isExist
  }, false)
}

const connectTriggers = (event: Event) => {
  event.preventDefault()

  const target = event.target as HTMLElement
  const trigger = target.closest(SELECTORS.trigger)
  const id = trigger?.getAttribute(DATA_SET.id)
  const apiUrl = trigger?.getAttribute(DATA_SET.apiUrl)
  const token = trigger?.getAttribute(DATA_SET.token)
  const isVisible = trigger?.hasAttribute(DATA_SET.visible)

  if (!apiUrl) {
    throw Error('Attribute "data-api-url" must provided')
  }

  if (!token) {
    throw Error('Attribute "data-token" must provided')
  }

  if (!id) {
    throw Error('Attribute "data-id" must provided')
  }

  if (!isDefineCustomElement()) {
    defineCustomElement()
  }

  if (isVisible) {
    const customElement = document.getElementById(id) as XenChatElement

    customElement.unmount()

    trigger?.removeAttribute(DATA_SET.visible)
  } else if (isExistCustomElement(token)) {
    console.log('XenChat is already exist app with same token')

    return
  } else {
    const customElement = document.createElement(CUSTOM_ELEMENT_TAG)

    customElement.setAttribute('api-url', apiUrl)
    customElement.setAttribute('token', token)
    customElement.setAttribute('mode', 'popup')
    customElement.setAttribute('id', id)

    customElement.classList.add(CLASSNAMES.app)
    customElement.classList.add(CLASSNAMES.minimize)

    document.body.appendChild(customElement)

    trigger?.setAttribute(DATA_SET.visible, '')
  }
}

const init = () => {
  const elements = document.body.getElementsByTagName(CUSTOM_ELEMENT_TAG)
  const triggers = document.querySelectorAll(SELECTORS.trigger)

  const isDefineElements = elements.length && !isDefineCustomElement()
  const isDefineTriggers = triggers.length > 0

  if (isDefineElements) {
    defineCustomElement()
  }

  if (isDefineTriggers) {
    triggers.forEach(trigger =>
      trigger.addEventListener('click', connectTriggers),
    )
  }
}

document.addEventListener('DOMContentLoaded', init)
