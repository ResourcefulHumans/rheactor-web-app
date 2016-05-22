'use strict'

const showdown = require('showdown')
const converter = new showdown.Converter({
  simplifiedAutoLink: true,
  strikethrough: true,
  tables: true,
  tasklists: true
})
const $ = require('jquery')

module.exports = ($location, $sanitize, $sce) => {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.$watch('model', function (newValue) {
        var showdownHTML
        if (typeof newValue === 'string') {
          showdownHTML = $('<div>' + converter.makeHtml(newValue) + '</div>')
          showdownHTML.find('table').addClass('table')
          // Open external links in new windows
          let links = showdownHTML.find('a[href^=http]')
          for (let i = 0; i < links.length; i++) {
            let l = $(links[i])
            if (l.attr('href').search($location.host()) === -1) {
              l.prop('target', '_blank')
            }
          }
          let html = showdownHTML.html()
          scope.trustedHtml = (showdown.getOption('sanitize')) ? $sanitize(html) : $sce.trustAsHtml(html)
        } else {
          scope.trustedHtml = typeof newValue
        }
      })
    },
    scope: {
      model: '=markdownToHtml'
    },
    template: '<div ng-bind-html="trustedHtml"></div>'
  }
}
