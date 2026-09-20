import path from 'node:path'
import type { Options } from '@wdio/types'

/**
 * Configuration shared by every platform.
 * Platform-specific capabilities live in wdio.android.conf.ts / wdio.ios.conf.ts.
 *
 * Specs are split into:
 *   - test/specs/*.spec.ts          shared flows (run on every platform)
 *   - test/specs/<platform>/*.spec.ts  platform-specific behaviour
 * Each platform config extends `specs` with its own folder.
 */
export const config: Options.Testrunner = {
  runner: 'local',

  specs: [path.join(process.cwd(), 'test/specs/*.spec.ts')],
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
   * Reset the app to a known state before every test. The app persists the
   * session between launches, so without this a state change from one test
   * (e.g. being logged in) could leak into the next one.
   */
  beforeTest: async function () {
    const { resetApp } = await import('../test/support/app')
    await resetApp()
  },
}
