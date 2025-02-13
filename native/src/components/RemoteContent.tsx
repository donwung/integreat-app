import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { Text } from 'react-native'
import WebView, { WebViewMessageEvent } from 'react-native-webview'
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes'
import { useTheme } from 'styled-components/native'

import { ErrorCode } from 'api-client'

import { userAgent } from '../constants/endpoint'
import { HEIGHT_MESSAGE_TYPE, WARNING_MESSAGE_TYPE } from '../constants/webview'
import renderHtml from '../utils/renderHtml'
import { log, reportError } from '../utils/sentry'
import Failure from './Failure'
import { ParsedCacheDictionaryType } from './Page'

export const renderWebviewError = (
  errorDomain: string | null | undefined,
  errorCode: number,
  errorDesc: string
): React.ReactElement => (
  <Text>
    ${errorDomain} ${errorCode} ${errorDesc}
  </Text>
)

type RemoteContentProps = {
  content: string
  cacheDictionary: ParsedCacheDictionaryType
  language: string
  resourceCacheUrl: string
  onLinkPress: (url: string) => void
  onLoad: () => void
  webViewWidth: number
}

// If the app crashes without an error message while using RemoteContent, consider wrapping it in a ScrollView or setting a manual height
const RemoteContent = (props: RemoteContentProps): ReactElement | null => {
  const { onLoad, content, cacheDictionary, resourceCacheUrl, language, onLinkPress, webViewWidth } = props
  const [error, setError] = useState<string | null>(null)
  const [pressedUrl, setPressedUrl] = useState<string | null>(null)
  // https://github.com/react-native-webview/react-native-webview/issues/1069#issuecomment-651699461
  const defaultWebviewHeight = 1
  const [webViewHeight, setWebViewHeight] = useState<number>(defaultWebviewHeight)
  const theme = useTheme()

  useEffect(() => {
    // If it takes too long returning false in onShouldStartLoadWithRequest the webview loads the pressed url anyway on android.
    // Therefore only set it to state and execute onLinkPress in useEffect.
    if (pressedUrl) {
      onLinkPress(pressedUrl)
      setPressedUrl(null)
    }
  }, [onLinkPress, pressedUrl])

  useEffect(() => {
    if (webViewHeight !== defaultWebviewHeight || content.length === 0) {
      onLoad()
    }
  }, [onLoad, webViewHeight, content])

  // messages are triggered in renderHtml.ts
  const onMessage = useCallback((event: WebViewMessageEvent) => {
    const message = JSON.parse(event.nativeEvent.data)
    if (message.type === HEIGHT_MESSAGE_TYPE && typeof message.height === 'number') {
      setWebViewHeight(message.height)
      return
    }

    if (message.type === WARNING_MESSAGE_TYPE) {
      log(message.message, 'warning')
    } else {
      const error = new Error(message.message ?? 'Unknown message received from webview')
      reportError(error)
      setError(error.message)
    }
  }, [])

  const onShouldStartLoadWithRequest = useCallback(
    (event: WebViewNavigation): boolean => {
      if (event.url === new URL(resourceCacheUrl).href) {
        // Needed on iOS for the initial load
        return true
      }
      // If it takes too long returning false the webview loads the pressed url anyway on android.
      // Therefore only set it to state and execute onLinkPress in useEffect.
      setPressedUrl(event.url)
      return false
    },
    [resourceCacheUrl]
  )

  if (content.length === 0) {
    return null
  }
  if (error) {
    return <Failure code={ErrorCode.UnknownError} />
  }

  return (
    <WebView
      source={{
        baseUrl: resourceCacheUrl,
        html: renderHtml(content, cacheDictionary, theme, language),
      }}
      originWhitelist={['*']} // Needed by iOS to load the initial html
      javaScriptEnabled
      dataDetectorTypes='none'
      userAgent={userAgent}
      domStorageEnabled={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false} // To disable scrolling in iOS
      onMessage={onMessage}
      renderError={renderWebviewError}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      // To allow custom handling of link clicks in android
      // https://github.com/react-native-webview/react-native-webview/issues/1869
      setSupportMultipleWindows={false}
      style={{
        height: webViewHeight,
        width: webViewWidth,
        opacity: 0.99, // fixes crashing in Android https://github.com/react-native-webview/react-native-webview/issues/811
        overflow: 'hidden',
      }}
    />
  )
}

export default RemoteContent
