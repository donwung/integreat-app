import React from 'react'
import { I18nManager } from 'react-native'

import render from '../../testing/render'
import PageDetail from '../PageDetail'

describe('PageDetail', () => {
  it('should display the given identifier followed by a colon', () => {
    const { queryAllByText, queryByText } = render(
      <PageDetail identifier='Test Identifier' information='Some important information' language='de' />
    )
    expect(queryAllByText(/Test Identifier/)).toBeTruthy()
    expect(queryByText(/Some important information/)).toBeTruthy()
  })
  describe('should manually reverse if content language doesnt have the same direction as system language', () => {
    it('if system language is not rtl', () => {
      I18nManager.forceRTL(false)
      const { queryAllByText } = render(
        <PageDetail identifier='Test Identifier' information='Some important information' language='de' />
      )
      queryAllByText(/Some important information/).forEach(element => {
        expect(element).toHaveStyle({
          flexDirection: 'row',
        })
      })
      const { queryAllByText: queryAllByTextReverse } = render(
        <PageDetail identifier='Test Identifier' information='Some important information' language='ar' />
      )
      queryAllByTextReverse(/Some important information/).forEach(element => {
        expect(element).toHaveStyle({
          flexDirection: 'row-reverse',
        })
      })
    })
    it('if system language is rtl', () => {
      I18nManager.forceRTL(true)
      const { queryAllByText: queryAllByTextReverse } = render(
        <PageDetail identifier='Test Identifier' information='Some important information' language='de' />
      )
      queryAllByTextReverse(/Some important information/).forEach(element => {
        expect(element).toHaveStyle({
          flexDirection: 'row-reverse',
        })
      })
      const { queryAllByText } = render(
        <PageDetail identifier='Test Identifier' information='Some important information' language='ar' />
      )
      queryAllByText(/Some important information/).forEach(element => {
        expect(element).toHaveStyle({
          flexDirection: 'row',
        })
      })
    })
  })
})
