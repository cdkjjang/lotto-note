// 생활반장 노트 시리즈 크로스링크 — 허브·형제 노트로 연결 (자기 자신 제외)
const FAMILY = [
  {
    name: "생활반장 홈",
    url: "https://lifebanjang.com",
    desc: "노트 시리즈 전체 보기",
  },
  {
    name: "이사노트",
    url: "https://isa.lifebanjang.com",
    desc: "월세 일할계산·복비·전월세 정산",
  },
  {
    name: "경조사노트",
    url: "https://gyeongjosa.lifebanjang.com",
    desc: "축의금·부의금·위로 문구",
  },
  {
    name: "자동차노트",
    url: "https://car.lifebanjang.com",
    desc: "자동차세·검사·과태료",
  },
  {
    name: "사주노트",
    url: "https://saju.lifebanjang.com",
    desc: "사주 명식·오행·운세",
  },
];

export default function FamilyLinks() {
  return (
    <nav aria-label="생활반장 노트 시리즈" className="mb-5">
      <p className="mb-2 font-semibold text-foreground">생활반장 노트 시리즈</p>
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {FAMILY.map((site) => (
          <li key={site.url}>
            <a href={site.url} className="hover:text-accent">
              <span className="font-semibold">{site.name}</span>
              <span className="ml-1.5 text-xs">— {site.desc}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
