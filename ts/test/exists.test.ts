
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { JinaSearchSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = JinaSearchSDK.test()
    equal(testsdk instanceof JinaSearchSDK, true,
      'JinaSearchSDK.test() must return a client synchronously')
  })

})
