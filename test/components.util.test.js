process.env.NODE_ENV = 'test'
const expect = require('chai').expect

const util = require('../src/components/util')

describe('components/utils', () => {
  it('should able to run without error', () => {
    const paths = util.getGlobbedPaths('./src/components/**/*.js')
    expect(paths).is.not.empty
  })

  it('should able to run without error with array', () => {
    const paths = util.getGlobbedPaths([
      './src/components/**/*.js',
      './src/models/**/*.js',
    ])
    expect(paths).is.not.empty
  })

  it('should able to run without error with url', () => {
    const paths = util.getGlobbedPaths('https://sample.com')
    expect(paths).is.not.empty
  })

  it('should able to run without error when has exclude', () => {
    const paths = util.getGlobbedPaths('./src/components/**/*.js', 'jwt.js')
    expect(paths).is.not.empty
  })

  it('should able to run without error when has exclude array', () => {
    const paths = util.getGlobbedPaths('./src/components/**/*.js', [
      'jwt.js',
      'index.js',
    ])
    expect(paths).is.not.empty
  })
})
