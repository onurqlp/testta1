import type { PictureKind } from './content'

// Özgün, CSS/SVG çizimleri. Sınavın telifli resimleri veya fotoğrafları kullanılmaz.
export default function Picture({ kind }: { kind: PictureKind }) {
  const vehicle = (rail: boolean) => <><rect x="15" y="29" width="90" height="48" rx="12" fill="#dceafa" stroke="#315f91" strokeWidth="3"/><rect x="25" y="37" width="28" height="19" rx="4" fill="#8fc4e6"/><rect x="60" y="37" width="28" height="19" rx="4" fill="#8fc4e6"/><path d="M20 65h80" stroke="#315f91" strokeWidth="3"/><circle cx="34" cy="81" r="8" fill="#314963"/><circle cx="87" cy="81" r="8" fill="#314963"/>{rail&&<path d="M14 94h94M20 100l10-8M47 100l10-8M76 100l10-8" stroke="#9cabb9" strokeWidth="3"/>}</>
  const art: Record<PictureKind, React.ReactNode> = {
    bus: vehicle(false),
    train: vehicle(true),
    bakery: <><path d="M20 42h80v47H20Z" fill="#f9e7ca" stroke="#916735" strokeWidth="3"/><path d="M20 39h80l-8-18H28Z" fill="#e0a76d"/><rect x="55" y="55" width="30" height="34" fill="#fff"/><path d="M29 64q12-17 23 0l-2 8H31Z" fill="#bb7e44"/><path d="m36 52 8 14m-13-5 14-5" stroke="#8a5737" strokeWidth="2"/></>,
    post: <><rect x="34" y="27" width="55" height="67" rx="6" fill="#e8b5a5" stroke="#a65b50" strokeWidth="3"/><rect x="43" y="39" width="37" height="9" rx="2" fill="#fff6e9"/><path d="M39 64h45" stroke="#a65b50" strokeWidth="5"/><rect x="10" y="13" width="50" height="30" rx="3" fill="#fff" stroke="#7f93ae" strokeWidth="3"/><path d="m11 15 24 16 24-16" fill="none" stroke="#7f93ae" strokeWidth="2"/></>,
    doctor: <><circle cx="60" cy="28" r="17" fill="#f2d5b9"/><path d="M31 97V65c0-20 12-28 29-28s29 8 29 28v32" fill="#f8fbff" stroke="#7391ae" strokeWidth="3"/><path d="M50 46v20q0 17 12 17t12-17V46" fill="none" stroke="#4d789e" strokeWidth="4"/><circle cx="74" cy="84" r="7" fill="#b7d6e4" stroke="#4d789e" strokeWidth="3"/></>,
    park: <><path d="M61 57v45" stroke="#986c43" strokeWidth="11"/><circle cx="60" cy="30" r="23" fill="#8bc7a3"/><circle cx="38" cy="52" r="21" fill="#6bac8b"/><circle cx="82" cy="53" r="23" fill="#99d3ac"/><path d="M14 100h91" stroke="#73a683" strokeWidth="4"/></>,
    library: <><rect x="17" y="18" width="86" height="78" rx="5" fill="#e5bc92"/><path d="M21 47h78M21 72h78" stroke="#9a6a42" strokeWidth="4"/><path d="M29 24v18m11-18v18m14-18v18m12-18v18m15-18v18M30 52v16m14-16v16m15-16v16m16-16v16M30 77v14m14-14v14m15-14v14m16-14v14" strokeWidth="8" stroke="#477eb6"/></>,
    hotel: <><rect x="18" y="31" width="84" height="62" rx="5" fill="#e2d4f0" stroke="#8873a8" strokeWidth="3"/><path d="M32 45h56" stroke="#8873a8" strokeWidth="3"/><rect x="29" y="61" width="62" height="19" rx="3" fill="#fff"/><rect x="31" y="60" width="16" height="11" rx="4" fill="#becfed"/><path d="M28 80v10m64-10v10" stroke="#8873a8" strokeWidth="4"/></>,
    clothes: <><path d="m40 21-22 20 14 14 10-7v48h37V48l10 7 14-14-22-20-12 7H51Z" fill="#a1bceb" stroke="#4d70a6" strokeWidth="3"/><path d="M51 28q10 17 18 0" stroke="#4d70a6" strokeWidth="3" fill="none"/><path d="M60 47v35" stroke="#4d70a6" strokeWidth="3"/></>,
    cinema: <><rect x="15" y="22" width="90" height="65" rx="5" fill="#2f4967"/><rect x="24" y="30" width="72" height="45" rx="3" fill="#b8d7f0"/><path d="m58 43 18 10-18 10Z" fill="#e7a556"/><path d="M31 93h58" stroke="#8eabba" strokeWidth="5"/></>,
    restaurant: <><ellipse cx="60" cy="60" rx="37" ry="26" fill="#fbf7e9" stroke="#a3b2c5" strokeWidth="5"/><ellipse cx="60" cy="60" rx="23" ry="15" fill="#f5d18b"/><path d="M30 31v-13m-5 0v21m10-21v21m63-20c-13 16-14 31-3 39v24" stroke="#8b96a7" strokeWidth="4" fill="none"/></>,
    pool: <><path d="M10 71q12-12 24 0t24 0t24 0t28 0M10 86q12-12 24 0t24 0t24 0t28 0" fill="none" stroke="#68aadd" strokeWidth="6"/><path d="M35 67V28q0-13 13-13h4M51 67V28q0-13 13-13h4" fill="none" stroke="#8293ac" strokeWidth="4"/><circle cx="85" cy="38" r="8" fill="#e2b8a4"/></>
  }
  return <svg className="lesen-illustration" width="116" height="110" viewBox="0 0 120 110" aria-hidden="true" role="img" focusable="false">
    <rect x="4" y="4" width="112" height="102" rx="17" fill="#f4f8fc"/>{art[kind]}
  </svg>
}
