import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { join } from 'node:path'
import assert from 'node:assert/strict'

const guide = name => readFileSync(join(process.cwd(),'public','rehber','a1',name),'utf8')
const source = guide('content.js')
const sections = runInNewContext(source+'\nsections',{})
assert.equal(sections.length,4,'4 ÖSD ZA1 skills')
const tasks=sections.flatMap(section=>section.tasks)
assert.equal(tasks.length,11,'11 ÖSD ZA1 tasks')
assert.equal(new Set(tasks.map(task=>task.id)).size,11,'unique task IDs')
for(const item of tasks)for(const key of ['what','example','steps','think','tip','wrong','right','remember'])assert.ok(item[key],item.id+' missing '+key)
const html=guide('index.html')
for(const name of ['content.js','app.js','style.css','ux-review.js','ux-review.css'])assert.ok(html.includes(name),name+' not linked')
assert.ok(html.includes('/#/guide'),'App return link missing')
assert.ok(guide('app.js').includes('https://osd.aydadil.com/a1/assets/model/'),'official page image URL missing')
const react=readFileSync(join(process.cwd(),'src','App.tsx'),'utf8')
assert.ok(react.includes("path === '/guide'"),'guide route missing')
assert.ok(react.includes("href={'/rehber/a1/#'+item.id}"),'task deep links missing')
const worker=readFileSync(join(process.cwd(),'public','sw.js'),'utf8')
assert.ok(worker.includes("'/rehber/a1/index.html'"),'guide offline precache missing')
console.log('ÖSD ZA1 rehber kontrolü başarılı: 4 bölüm, 11 görev, 8 açıklama alanı, tüm temel bağlantılar.')
