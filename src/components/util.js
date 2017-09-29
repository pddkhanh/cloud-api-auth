/**
 * Module dependencies.
 */
const _ = require('lodash')
const glob = require('glob')

/**
* Get files by glob patterns
*/
const getGlobbedPaths = (globPatterns, excludes) => {
  // URL paths regex
  const urlRegex = new RegExp('^(?:[a-z]+:)?//', 'i')

  // The output array
  let output = []

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(globPattern => {
      output = _.union(output, getGlobbedPaths(globPattern, excludes))
    })
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns)
    } else {
      let files = glob.sync(globPatterns)
      if (excludes) {
        files = files.map(file => {
          let rs = file
          if (_.isArray(excludes)) {
            for (const i in excludes) {
              if (Object.prototype.hasOwnProperty.call(excludes, i)) {
                rs = file.replace(excludes[i], '')
              }
            }
          } else {
            rs = file.replace(excludes, '')
          }
          return rs
        })
      }
      output = _.union(output, files)
    }
  }

  return output
}

module.exports.getGlobbedPaths = getGlobbedPaths
