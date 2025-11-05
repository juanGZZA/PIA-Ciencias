const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')
const fs = require('fs')

const dbDir = path.join(__dirname, '..', 'data')
const dbFile = path.join(dbDir, 'db.json')
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({ users: [], products: [], orders: [] }, null, 2))

const adapter = new FileSync(dbFile)
const db = low(adapter)

db.defaults({ users: [], products: [], orders: [] }).write()

function genId(prefix = '') {
	return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

module.exports = db
module.exports.genId = genId
