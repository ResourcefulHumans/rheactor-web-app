'use strict'

let Promise = require('bluebird')

/**
 * Wait for the given properties to appear on the parent of the given scope
 *
 * We use this because for performance reason parent states will not use the ui routers resolve functionality to
 * provide dependencies that require API requests to resolve
 *
 * @param {Object} $scope
 * @param {String} property
 * @return Promise
 */
module.exports = ($scope, property) => {
  return new Promise((resolve, reject) => {
    if ($scope.$parent[property]) {
      $scope.$emit(property, $scope.$parent[property]) // pass down to child scopes
      resolve($scope.$parent[property])
    } else {
      $scope.$parent.$once(property, (event, resolvedProperty) => {
        $scope.$emit(property, resolvedProperty) // pass down to child scopes
        resolve(resolvedProperty)
      })
    }
  })
}
