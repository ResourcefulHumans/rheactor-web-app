/* global window */

/**
 * Fix URLs where the ! has been encoded as %21, happens usually in links from emails
 */
if (window.location.hash.substr(1, 3) === '%21') {
  window.location.hash = '!' + window.location.hash.substr(4)
}
