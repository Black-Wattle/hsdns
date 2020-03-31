#!/usr/bin/env node
const crypto = require('crypto')
const fetch = require('node-fetch')

const chalk = require('chalk')
const server = require('./server')
const db = require('./db')

// Setup Default server
const defaultServer = 'ns.hsd.tools'

let argv = process.argv // Args
let argc = argv.length // Arg length

const run = async () => {
  // Fetch Settings
  let settings = db.get('settings')
  // Setup account if necessary
  setupAccount(settings)

  //
  switch (argv[2]) {
    case 'zone':
      if (!argv[3]) return outputHelp('Missing required parameters')
      await server.handleZone(settings, argv)
      break
    case 'record':
      if (!argv[3]) return outputHelp('Missing required parameters')
      await server.handleRecord(settings, argv)
      break
    case 'server':
      if (!argv[3])
        return console.log(chalk.cyan.bold(settings.server), 'is your server.')

      const serverObj = {
        server: argv[3],
        ssl: argv[4] === 'no-ssl' ? false : true,
        token: settings.token
      }
      db.set('settings', serverObj)
      console.error(chalk.green(`SUCCESS!`))
      console.log(`Now using ${argv[3]} as the server`)
      break

    case 'reset-cli':
      console.error(
        chalk.red(
          `WARNING! You are trying to reset the CLI and delete your keys.`
        )
      )
      console.log('You will loose DNS control over your domains')

      console.log(
        'If you are sure you want to do this type:',
        chalk.blue('hsdns delete-my-keys')
      )
      break
    case 'delete-my-keys':
      db.remove()
      console.log(`You've reset the CLI`)
      console.log(`Bye 😢`)
      break
    case 'help':
      console.log('')
      console.log('Here are the commands you are able to use:')
      outputHelp()
      break
    default:
      outputHelp('Could not find that command!')
      break
  }
}

const setupAccount = async settings => {
  if (!settings) {
    console.log(chalk.cyan.bold('Welcome to hsdns! 👋'))
    console.log(
      'This tool is a little CLI that lets you manage DNS records for a Zone.'
    )
    console.log(
      "Out of the box it works with HSD.tools' free DNS server but you can run you own."
    )
    console.log(
      'Set one up today: https://github.com/Black-Wattle/hsdns-server'
    )
    // Create Settings
    const settingObj = {
      server: defaultServer,
      ssl: true,
      token: generateToken()
    }
    db.set('settings', settingObj)
    return
  }
}

// Generate random token
const generateToken = () => {
  /// generate key
  return crypto.randomBytes(48).toString('hex')
}

// Help commands
const outputHelp = message => {
  console.log('')
  if (message) {
    console.log(chalk.red('Error:'), message)
    console.log('-----------------------------')
  }
  console.log('      zone info', chalk.cyan('zoneName'))
  console.log('      zone add', chalk.cyan('zoneName'))
  console.log('      zone remove', chalk.cyan('zoneName'))
  console.log(
    '      record add',
    chalk.cyan('zoneName "zoneName. IN A 8.8.8.8"')
  )
  console.log('      record remove', chalk.cyan('zoneName record-id'))
  console.log('      server', chalk.cyan('server-url-or-ip'))
  console.log('      reset-cli')
}

run()
