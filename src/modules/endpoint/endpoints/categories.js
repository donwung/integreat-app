import EndpointBuilder from '../EndpointBuilder'

import CategoryModel from '../models/CategoryModel'
import CategoriesMapModel from '../models/CategoriesMapModel'

export default new EndpointBuilder('categories')
  .withUrl('https://cms.integreat-app.de/{location}/{language}/wp-json/extensions/v0/modified_content/pages?since=1970-01-01T00:00:00Z')
  .withStateMapper().fromArray(['location', 'language'], (state, paramName) => state.router.params[paramName])
  .withMapper((json, urlParams) => {
    const baseUrl = `/${urlParams.location}/${urlParams.language}`
    const categories = json.filter((category) => category.status === 'publish')
      .map((category) => {
        return new CategoryModel({
          id: category.id,
          url: baseUrl + '/' + decodeURI(category.permalink.url_page),
          title: category.title,
          parentId: category.parent,
          content: category.content,
          thumbnail: category.thumbnail,
          order: category.order,
          availableLanguages: category.available_languages
        })
      })

    categories.push(new CategoryModel({id: 0, url: baseUrl, title: urlParams.location}))

    categories.forEach(category => {
      if (category.id !== 0) {
        // every category except from the root category should have a parent, so we don't have to check if it exists
        const parentUrl = categories.find(_category => _category.id === category.parentId).url
        category.setParentUrl(parentUrl)
      }
    })

    return new CategoriesMapModel(categories)
  })
  .build()
