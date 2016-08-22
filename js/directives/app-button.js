'use strict'

module.exports = {
  restrict: 'E',
  scope: {
    click: '=click',
    progress: '=progress',
    label: '@label',
    icon: '@icon'
  },
  templateUrl: '/directive/app-button.html'
}
