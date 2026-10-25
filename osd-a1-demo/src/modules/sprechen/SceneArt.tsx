import type { SceneIcon } from './content'

// AYDA'nın özgün, herhangi bir telifli sınav resmini kopyalamayan mini çizimleri.
export default function SceneArt({kind,title}:{kind:SceneIcon;title:string}) {
 const caf=kind==='cafe',station=kind==='station',market=kind==='market',
 doctor=kind==='doctor',school=kind==='school',party=kind==='party'
 return <svg viewBox="0 0 340 196" role="img" aria-label={title+' için özgün sahne çizimi'} className="spr-scene-art">
  <rect width="340" height="196" rx="19" fill="#eaf3fa"/>
  <rect x="12" y="12" width="316" height="172" rx="13" fill="#f8fbfe" stroke="#d9e7f2"/>
  {caf&&<><rect x="24" y="25" width="90" height="42" rx="6" fill="#d5e6f2"/><text x="69" y="52" textAnchor="middle" fill="#52728e" fontSize="16" fontWeight="bold">CAFÉ</text><path d="M40 160h260" stroke="#b4cadc" strokeWidth="5"/><rect x="113" y="116" width="108" height="12" rx="5" fill="#bb936e"/><path d="M124 128v33m86-33v33" stroke="#b9916d" strokeWidth="6"/><rect x="164" y="100" width="16" height="16" rx="4" fill="white" stroke="#6894ad" strokeWidth="2"/><path d="M180 105q10 0 0 8" fill="none" stroke="#6894ad" strokeWidth="2"/></>}
  {station&&<><rect x="37" y="26" width="114" height="34" rx="7" fill="#d0e3f1"/><text x="94" y="47" textAnchor="middle" fill="#507996" fontSize="12" fontWeight="bold">BAHNHOF</text><rect x="173" y="33" width="106" height="48" rx="8" fill="#b4d8ef" stroke="#7699b5"/><rect x="184" y="40" width="26" height="23" rx="3" fill="white"/><rect x="216" y="40" width="26" height="23" rx="3" fill="white"/><circle cx="197" cy="79" r="5" fill="#4f7394"/><circle cx="253" cy="79" r="5" fill="#4f7394"/><path d="M172 87h117" stroke="#718fa5" strokeWidth="4"/><rect x="106" y="132" width="151" height="24" rx="4" fill="#c8b38d"/></>}
  {market&&<><rect x="25" y="25" width="294" height="25" rx="5" fill="#b7d9c4"/><text x="172" y="42" textAnchor="middle" fill="#39755e" fontWeight="bold" fontSize="15">SUPERMARKT</text><rect x="30" y="70" width="94" height="12" rx="5" fill="#bad2e3"/><rect x="30" y="86" width="94" height="12" rx="5" fill="#bad2e3"/><circle cx="43" cy="65" r="11" fill="#e7af75"/><circle cx="74" cy="65" r="11" fill="#a4c795"/><circle cx="105" cy="65" r="11" fill="#e6a783"/><rect x="143" y="131" width="116" height="22" rx="5" fill="#7e9eaf"/></>}
  {doctor&&<><rect x="23" y="22" width="115" height="43" rx="8" fill="#d5e7f1"/><path d="M80 32v24m-12-12h24" stroke="#b65c62" strokeWidth="8" strokeLinecap="round"/><rect x="145" y="112" width="151" height="16" rx="5" fill="#bfd2dd"/><rect x="179" y="78" width="16" height="20" rx="3" fill="#fff" stroke="#aabed0"/><path d="M187 81v14m-6-7h12" stroke="#b85b62" strokeWidth="3"/></>}
  {school&&<><rect x="24" y="24" width="114" height="53" rx="6" fill="#cfe3f1"/><text x="81" y="46" fontSize="12" textAnchor="middle" fill="#4b769a">DEUTSCH</text><text x="81" y="64" fontSize="16" textAnchor="middle" fill="#3a6d8e" fontWeight="bold">A1</text><rect x="122" y="126" width="132" height="14" rx="5" fill="#b4a18a"/><rect x="153" y="112" width="40" height="12" rx="2" fill="#e5edf7" stroke="#8ba4be"/></>}
  {party&&<><path d="M25 29q45 23 90 0t95 0t103 0" stroke="#bd8b63" strokeWidth="3" fill="none"/>{[46,99,166,231,298].map((x,i)=><path key={i} d={'M'+x+' 26l-8 18 16 0Z'} fill={i%2?'#97b3da':'#e6b28e'}/>)}
     <rect x="115" y="131" width="116" height="14" rx="5" fill="#bea18c"/><rect x="157" y="111" width="33" height="21" rx="3" fill="#e5bdc6"/><path d="M174 102v9" stroke="#d89d44" strokeWidth="2"/><circle cx="174" cy="99" r="4" fill="#e6b650"/></>}
  <g><circle cx="134" cy="88" r="16" fill="#e9c4a8"/><path d="M109 143v-28q0-20 25-20t25 20v28" fill="#83b6bd" stroke="#56898e" strokeWidth="2"/><path d="M123 78q12-11 22 0" stroke="#655446" strokeWidth="4" fill="none"/></g>
  <g><circle cx="267" cy="86" r="16" fill="#eacbb0"/><path d="M243 145v-29q0-21 24-21t24 21v29" fill="#abafd9" stroke="#858eb7" strokeWidth="2"/><path d="M256 75q11-9 21 0" stroke="#6b5949" strokeWidth="4" fill="none"/></g>
  <path d="M160 105q27-18 54 0" stroke="#8da8ba" strokeWidth="2" strokeDasharray="4 6" fill="none"/>
 </svg>
}
