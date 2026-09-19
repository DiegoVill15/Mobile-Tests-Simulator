import path from 'node:path'
import type { Options } from '@wdio/types'

/**
 * Configuration shared by every platform.
 * Platform-specific capabilities live in wdio.android.conf.ts / wdio.ios.conf.ts.
 */
export const config: Options.Testrunner = {
  runner: 'local',

  specs: [path.join(process.cwd(), 'test/specs/**/*.spec.ts')],
  exclude: [],

  maxInstances: 1,

  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 3,

  services: ['appium'],
  framework: 'mocha',
  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 120_000,
  },

  /**
   * Reset the app before every test so tests do not depend on the state left by
   * a previous one (e.g. being logged in, or the login autofill list no longer
   * being rendered after a failed attempt).
   */
  beforeTest: async function () {
    const { resetApp } = await import('../test/support/app')
    await resetApp()
  },
}
