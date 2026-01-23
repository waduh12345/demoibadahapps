export type LocaleCode = "id" | "en" | "ar" | "fr" | "kr" | "jp";

export interface SirahStory {
  id: string;
  slug: string;
  title: string;
  category: "nabi" | "muhammad" | "istri" | "sahabat" | "ulama";
  excerpt: string;
  content: string; // HTML string sederhana
  image?: string;
}

// Data Dummy Multi-Bahasa
export const SIRAH_DATA: Record<LocaleCode, SirahStory[]> = {
  id: [
    {
      id: "1",
      slug: "nabi-adam",
      title: "Nabi Adam AS",
      category: "nabi",
      excerpt:
        "Kisah manusia pertama yang diciptakan Allah SWT dan khalifah pertama di bumi.",
      content: "<p>Allah SWT menciptakan Nabi Adam dari tanah...</p>",
    },
    {
      id: "2",
      slug: "kelahiran-nabi",
      title: "Kelahiran Nabi Muhammad SAW",
      category: "muhammad",
      excerpt: "Peristiwa agung kelahiran penghulu para Nabi di tahun Gajah.",
      content: "<p>Nabi Muhammad SAW lahir di Makkah pada hari Senin...</p>",
    },
    {
      id: "3",
      slug: "khadijah",
      title: "Siti Khadijah RA",
      category: "istri",
      excerpt: "Wanita pertama yang beriman dan istri tercinta Rasulullah.",
      content: "<p>Khadijah binti Khuwailid adalah istri pertama Nabi...</p>",
    },
    {
      id: "4",
      slug: "abu-bakar",
      title: "Abu Bakar Ash-Shiddiq",
      category: "sahabat",
      excerpt: "Sahabat terdekat Nabi dan Khalifah pertama umat Islam.",
      content:
        "<p>Abu Bakar adalah orang yang paling membenarkan peristiwa Isra Mi'raj...</p>",
    },
    {
      id: "5",
      slug: "imam-syafii",
      title: "Imam Syafi'i",
      category: "ulama",
      excerpt: "Sang Nasirus Sunnah, pendiri mazhab Syafi'i yang masyhur.",
      content: "<p>Imam Syafi'i lahir di Gaza, Palestina...</p>",
    },
  ],
  en: [
    {
      id: "1",
      slug: "nabi-adam",
      title: "Prophet Adam (AS)",
      category: "nabi",
      excerpt:
        "The story of the first human created by Allah and the first Caliph on earth.",
      content: "<p>Allah SWT created Prophet Adam from soil...</p>",
    },
    {
      id: "2",
      slug: "kelahiran-nabi",
      title: "Birth of Prophet Muhammad (PBUH)",
      category: "muhammad",
      excerpt:
        "The great event of the birth of the master of Prophets in the Year of the Elephant.",
      content: "<p>Prophet Muhammad (PBUH) was born in Mecca on Monday...</p>",
    },
    {
      id: "3",
      slug: "khadijah",
      title: "Khadijah bint Khuwaylid",
      category: "istri",
      excerpt:
        "The first woman to believe and the beloved wife of the Messenger of Allah.",
      content: "<p>Khadijah was the first wife of the Prophet...</p>",
    },
    {
      id: "4",
      slug: "abu-bakar",
      title: "Abu Bakr As-Siddiq",
      category: "sahabat",
      excerpt: "The Prophet's closest companion and the first Caliph of Islam.",
      content:
        "<p>Abu Bakr was the one who most confirmed the Isra Mi'raj...</p>",
    },
    {
      id: "5",
      slug: "imam-syafii",
      title: "Imam Shafi'i",
      category: "ulama",
      excerpt:
        "The Nasirus Sunnah, founder of the famous Shafi'i school of thought.",
      content: "<p>Imam Shafi'i was born in Gaza, Palestine...</p>",
    },
  ],
  ar: [
    {
      id: "1",
      slug: "nabi-adam",
      title: "آدم عليه السلام",
      category: "nabi",
      excerpt: "قصة أول إنسان خلقه الله وأول خليفة في الأرض.",
      content: "<p>خلق الله آدم عليه السلام من تراب...</p>",
    },
    {
      id: "2",
      slug: "kelahiran-nabi",
      title: "مولد النبي محمد ﷺ",
      category: "muhammad",
      excerpt: "الحدث العظيم لمولد سيد الأنبياء في عام الفيل.",
      content: "<p>ولد النبي محمد ﷺ في مكة يوم الاثنين...</p>",
    },
    {
      id: "3",
      slug: "khadijah",
      title: "خديجة بنت خويلد",
      category: "istri",
      excerpt: "أول امرأة آمنت وزوجة الرسول الحبيبة.",
      content: "<p>خديجة بنت خويلد هي أول زوجة للنبي...</p>",
    },
    {
      id: "4",
      slug: "abu-bakar",
      title: "أبو بكر الصديق",
      category: "sahabat",
      excerpt: "أقرب أصحاب النبي وأول خليفة للمسلمين.",
      content: "<p>أبو بكر هو الصديق الذي صدق حادثة الإسراء والمعراج...</p>",
    },
    {
      id: "5",
      slug: "imam-syafii",
      title: "الإمام الشافعي",
      category: "ulama",
      excerpt: "ناصر السنة، مؤسس المذهب الشافعي المشهور.",
      content: "<p>ولد الإمام الشافعي في غزة، فلسطين...</p>",
    },
  ],
  fr: [
    {
      id: "1",
      slug: "nabi-adam",
      title: "Prophète Adam (AS)",
      category: "nabi",
      excerpt:
        "L'histoire du premier homme créé par Allah et premier Calife sur terre.",
      content: "<p>Allah a créé Adam à partir de terre...</p>",
    },
    // ... (data dummy lainnya disederhanakan agar tidak terlalu panjang)
  ],
  kr: [
    {
      id: "1",
      slug: "nabi-adam",
      title: "아담 선지자",
      category: "nabi",
      excerpt: "알라가 창조한 최초의 인간이자 지상의 첫 칼리파 이야기.",
      content: "<p>알라께서는 흙으로 아담을 창조하셨습니다...</p>",
    },
  ],
  jp: [
    {
      id: "1",
      slug: "nabi-adam",
      title: "預言者アダム",
      category: "nabi",
      excerpt:
        "アッラーによって創造された最初の人間であり、地上の最初のカリフの物語。",
      content: "<p>アッラーは土からアダムを創造されました...</p>",
    },
  ],
};

// Fallback untuk bahasa yang datanya belum lengkap di dummy (fr, kr, jp)
// Kita isi sisa array dengan data bahasa Inggris agar tidak error
const fillMissingData = () => {
  (["fr", "kr", "jp"] as LocaleCode[]).forEach((lang) => {
    if (SIRAH_DATA[lang].length < 5) {
      SIRAH_DATA[lang] = SIRAH_DATA.id; // Fallback ke ID atau EN
    }
  });
};
fillMissingData();