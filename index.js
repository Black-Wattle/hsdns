const crypto = require('crypto')
const fetch = require('node-fetch')

const inquirer = require('inquirer')
const chalk = require('chalk')
const figlet = require('figlet')
const shell = require('shelljs')
const clear = require('clear')
const clui = require('clui')
const Spinner = clui.Spinner

const server = require('./server')
const db = require('./db')

// Setup Default server
const defaultServer = 'dns.hsd.tools'

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
      const object = {
        server: defaultServer,
        token: generateToken()
      }
      db.set('settings', object)
      console.log(`You've reset the CLI`)
      break
    default:
      outputHelp('Could not find that command!')
      break
  }
}

const setupAccount = async settings => {
  if (!settings) {
    console.log(chalk.blue('Welcome to hsdns! 👋'))
    const spinner = new Spinner('Generating account keys..')
    // Create Settings
    const settingObj = {
      server: defaultServer,
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
  console.log('      record add', chalk.cyan('"zone IN TXT \'goes here\'"'))
  console.log('      record remove', chalk.cyan('record-ID'))
  console.log('      server', chalk.cyan('server'))
  console.log('      reset-cli')
}

run()
