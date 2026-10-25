import { statSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
const names=['alltag-01','unterwegs-02'].flatMap(set=>[1,2,3].map(n=>set+'-aufgabe'+n+'.mp3'))
for (const name of names) {
 const path=resolve('public/audio',name)
 const {size}=statSync(path)
 const head=readFileSync(path).subarray(0,4)
 // MP3s may begin with ID3 tag or MPEG audio-frame sync.
 if(size<10000||!(head.toString('ascii',0,3)==='ID3'||(head[0]===0xff&&(head[1]&0xe0)===0xe0)))
    throw Error('Missing/corrupt MP3: '+name+' / '+size)
 console.log('Verified',name,size+' bytes')
}
console.log('All '+names.length+' actual MP3 files present')
