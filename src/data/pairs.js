// Lahat ng 12 pares ng "Match It Right!"
// a = Hanay A (pahayag), b = Hanay B (tamang sagot)
export const pairs = [
  {
    id: 1,
    a: { tl: "Nagbibigay-halaga sa tao.", en: "That which gives value to a person." },
    b: { tl: "Buhay", en: "Life" },
  },
  {
    id: 2,
    a: { tl: "Nawawalan ng halaga ang tao kapag siya ay...", en: "A person loses value when he or she is..." },
    b: { tl: "Kapag patay na", en: "When a person is dead" },
  },
  {
    id: 3,
    a: { tl: "Taong nagtagumpay laban sa kamatayan.", en: "The One who triumphed over death." },
    b: { tl: "Panginoong Jesucristo", en: "The Lord Jesus Christ" },
  },
  {
    id: 4,
    a: { tl: "Iglesia na may pangakong hindi pagtatagumpayan ng kamatayan.", en: "The Church with the promise that death will not prevail." },
    b: { tl: "Iglesia Ni Cristo", en: "Iglesia Ni Cristo" },
  },
  {
    id: 5,
    a: { tl: "Mga bagay na dapat munang hanapin ng tao.", en: "The things that a person must seek first." },
    b: { tl: "Kaharian at ang Katuwiran", en: "The Kingdom and His righteousness" },
  },
  {
    id: 6,
    a: { tl: "Kahariang ipinahahanap muna ng Panginoong Jesucristo.", en: "The Kingdom that the Lord Jesus Christ commands people to seek first." },
    b: { tl: "Ang kaharian ng Anak na kinaroroonan ng katubusan", en: "The Kingdom of the Son, where redemption is found" },
  },
  {
    id: 7,
    a: { tl: "Iglesia na kinaroroonan ng katubusan at siyang kaharian ng ating Panginoong Jesucristo.", en: "The Church where redemption is found and which is the Kingdom of our Lord Jesus Christ." },
    b: { tl: "Iglesia Ni Cristo", en: "Iglesia Ni Cristo" },
  },
  {
    id: 8,
    a: { tl: "Ang katuwirang dapat hanapin ng tao.", en: "The righteousness that a person must seek." },
    b: { tl: "Ebanghelyo", en: "The Gospel" },
  },
  {
    id: 9,
    a: { tl: "Ang Ebanghelyo.", en: "The Gospel." },
    b: { tl: "Mga salita ng Diyos", en: "The words of God" },
  },
  {
    id: 10,
    a: { tl: "Panahon kung kailan tinatanggap ang Ebanghelyo o katuwiran.", en: "The time when the Gospel or righteousness is received." },
    b: { tl: "Tuwing Pagsamba", en: "During Worship Service" },
  },
  {
    id: 11,
    a: { tl: "Siya na dapat ibigin at sundin.", en: "The One whom we must love and obey." },
    b: { tl: "Ang Diyos", en: "God" },
  },
  {
    id: 12,
    a: { tl: "Paninindigang hinahanap ng Diyos sa atin.", en: "The steadfastness that God seeks from us." },
    b: { tl: "Hindi nawawalan ng pag-asa", en: "Never losing hope" },
  },
];

// Kinukuha ang mga pares sa napiling wika, sa mas simpleng anyo:
// { id, left: "pahayag", right: "sagot" }
export function getPairs(lang) {
  return pairs.map((p) => ({
    id: p.id,
    left: p.a[lang],
    right: p.b[lang],
  }));
}