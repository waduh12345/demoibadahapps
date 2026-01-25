export interface HariBesar {
  id: string;
  name: string;
  description: string;
  date: {
    month: number; // 1-12 (Muharram - Dzulhijjah)
    day: number; // 1-30
  };
  type: "wajib" | "sunnah" | "sejarah" | "peringatan";
  color: string;
  icon: string;
}

export const hariBesarData: HariBesar[] = [
  // Muharram (Bulan 1)
  {
    id: "1",
    name: "Tahun Baru Hijriyah",
    description:
      "Hari pertama tahun baru dalam kalender Hijriyah, menandai hijrahnya Nabi Muhammad SAW dari Mekkah ke Madinah pada tahun 622 M.",
    date: { month: 1, day: 1 },
    type: "sejarah",
    color: "bg-blue-500",
    icon: "📅",
  },
  {
    id: "2",
    name: "Hari Asyura",
    description:
      "Hari ke-10 Muharram, hari bersejarah dimana Nabi Musa AS diselamatkan dari Firaun. Dianjurkan berpuasa sunnah.",
    date: { month: 1, day: 10 },
    type: "sunnah",
    color: "bg-green-500",
    icon: "🌊",
  },

  // Rabiul Awal (Bulan 3)
  {
    id: "3",
    name: "Maulid Nabi Muhammad SAW",
    description:
      "Hari kelahiran Nabi Muhammad SAW pada 12 Rabiul Awal. Hari yang penuh berkah untuk memperbanyak sholawat dan amal shalih.",
    date: { month: 3, day: 12 },
    type: "sunnah",
    color: "bg-purple-500",
    icon: "🕌",
  },

  // Rajab (Bulan 7)
  {
    id: "4",
    name: "Isra' Mi'raj",
    description:
      "Peristiwa agung dimana Nabi Muhammad SAW melakukan perjalanan dari Masjidil Haram ke Masjidil Aqsa, kemudian naik ke langit ke-7.",
    date: { month: 7, day: 27 },
    type: "sejarah",
    color: "bg-indigo-500",
    icon: "🌙",
  },

  // Sya'ban (Bulan 8)
  {
    id: "5",
    name: "Nisfu Sya'ban",
    description:
      "Pertengahan bulan Sya'ban, malam yang penuh berkah dimana Allah mengampuni dosa-dosa hamba-Nya yang bertaubat.",
    date: { month: 8, day: 15 },
    type: "sunnah",
    color: "bg-pink-500",
    icon: "✨",
  },

  // Ramadhan (Bulan 9)
  {
    id: "6",
    name: "Awal Ramadhan",
    description:
      "Bulan suci Ramadhan dimulai. Bulan penuh berkah dimana umat Islam diwajibkan berpuasa dan memperbanyak ibadah.",
    date: { month: 9, day: 1 },
    type: "wajib",
    color: "bg-emerald-500",
    icon: "🌙",
  },
  {
    id: "7",
    name: "Lailatul Qadar",
    description:
      "Malam yang lebih baik dari seribu bulan, biasanya terjadi pada 10 malam terakhir Ramadhan. Malam turunnya Al-Quran.",
    date: { month: 9, day: 27 },
    type: "sunnah",
    color: "bg-yellow-500",
    icon: "⭐",
  },

  // Syawal (Bulan 10)
  {
    id: "8",
    name: "Hari Raya Idul Fitri",
    description:
      "Hari raya umat Islam setelah menunaikan ibadah puasa Ramadhan. Hari kemenangan dan kegembiraan.",
    date: { month: 10, day: 1 },
    type: "wajib",
    color: "bg-green-600",
    icon: "🎉",
  },
  {
    id: "9",
    name: "Puasa Syawal",
    description:
      "Puasa sunnah 6 hari di bulan Syawal setelah Idul Fitri. Pahalanya setara dengan puasa setahun penuh.",
    date: { month: 10, day: 2 },
    type: "sunnah",
    color: "bg-green-400",
    icon: "🌱",
  },

  // Dzulhijjah (Bulan 12)
  {
    id: "10",
    name: "Hari Arafah",
    description:
      "Hari ke-9 Dzulhijjah, hari wukuf di Arafah bagi jamaah haji. Dianjurkan berpuasa sunnah bagi yang tidak berhaji.",
    date: { month: 12, day: 9 },
    type: "sunnah",
    color: "bg-orange-500",
    icon: "🏔️",
  },
  {
    id: "11",
    name: "Hari Raya Idul Adha",
    description:
      "Hari raya kurban, memperingati kesabaran Nabi Ibrahim AS dan Nabi Ismail AS. Hari berkurban dan berbagi.",
    date: { month: 12, day: 10 },
    type: "wajib",
    color: "bg-red-500",
    icon: "🐑",
  },
  {
    id: "12",
    name: "Hari Tasyrik",
    description:
      "Hari-hari Tasyrik (11, 12, 13 Dzulhijjah) adalah hari-hari yang dilarang berpuasa. Waktu untuk menyantap daging kurban.",
    date: { month: 12, day: 11 },
    type: "sunnah",
    color: "bg-red-400",
    icon: "🍖",
  },
];

// Nama-nama bulan Hijriyah
export const namaBulanHijriyah = [
  "Muharram",
  "Safar",
  "Rabiul Awal",
  "Rabiul Akhir",
  "Jumadil Awal",
  "Jumadil Akhir",
  "Rajab",
  "Sya'ban",
  "Ramadhan",
  "Syawal",
  "Dzulqa'dah",
  "Dzulhijjah",
];

// Nama-nama hari dalam bahasa Indonesia
export const namaHari = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

// Fungsi untuk mengkonversi tanggal Masehi ke Hijriyah
// Menggunakan algoritma yang akurat berdasarkan Julian Day Number
export function toHijriyah(date: Date): {
  year: number;
  month: number;
  day: number;
} {
  // Ambil komponen tanggal
  const gDay = date.getDate();
  const gMonth = date.getMonth() + 1; // 1-12
  const gYear = date.getFullYear();

  // Konversi ke Julian Day Number
  const a = Math.floor((14 - gMonth) / 12);
  const y = gYear + 4800 - a;
  const m = gMonth + 12 * a - 3;
  
  const julianDay = gDay + Math.floor((153 * m + 2) / 5) + 
                   365 * y + Math.floor(y / 4) - 
                   Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // Epoch Islamic Calendar (Julian Day untuk 1 Muharram 1 AH = 16 Juli 622 M)
  const islamicEpoch = 1948440;
  
  // Hitung jumlah hari sejak epoch
  let daysSinceEpoch = julianDay - islamicEpoch;
  
  // Siklus 30 tahun Hijriyah (10631 hari)
  const cycle = Math.floor(daysSinceEpoch / 10631);
  daysSinceEpoch = daysSinceEpoch % 10631;
  
  // Tahun kabisat dalam siklus 30 tahun (sistem Kuwaiti)
  const leapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
  
  // Hitung tahun dalam siklus
  let hijriYear = 0;
  let remainingDays = daysSinceEpoch;
  
  for (let year = 1; year <= 30; year++) {
    const isLeap = leapYears.includes(year);
    const daysInYear = isLeap ? 355 : 354;
    
    if (remainingDays < daysInYear) {
      hijriYear = year;
      break;
    }
    
    remainingDays -= daysInYear;
  }
  
  // Hitung tahun total
  hijriYear = cycle * 30 + hijriYear;
  
  // Panjang bulan Hijriyah (default)
  const monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
  
  // Cek apakah tahun kabisat
  const yearInCycle = ((hijriYear - 1) % 30) + 1;
  const isLeapYear = leapYears.includes(yearInCycle);
  
  if (isLeapYear) {
    monthLengths[11] = 30; // Dzulhijjah menjadi 30 hari
  }
  
  // Hitung bulan dan hari
  let hijriMonth = 1;
  let hijriDay = 1;
  
  for (let i = 0; i < 12; i++) {
    if (remainingDays < monthLengths[i]) {
      hijriMonth = i + 1;
      hijriDay = Math.floor(remainingDays) + 1;
      break;
    }
    remainingDays -= monthLengths[i];
  }
  
  // Pastikan nilai dalam range yang valid
  hijriYear = Math.max(1, hijriYear);
  hijriMonth = Math.min(12, Math.max(1, hijriMonth));
  hijriDay = Math.min(monthLengths[hijriMonth - 1], Math.max(1, hijriDay));

  return {
    year: hijriYear,
    month: hijriMonth,
    day: hijriDay,
  };
}

// Fungsi untuk mendapatkan jumlah hari dalam bulan Hijriyah
export function getHijriMonthDays(year: number, month: number): number {
  const hijriMonthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
  const leapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
  const isLeapYear = leapYears.includes((year % 30) || 30);
  
  if (isLeapYear && month === 12) {
    return 30;
  }
  return hijriMonthLengths[month - 1];
}

// Fungsi untuk mendapatkan hari dalam minggu untuk tanggal Hijriyah
export function getHijriDayOfWeek(year: number, month: number, day: number): number {
  // Epoch Hijriyah: 16 Juli 622 M adalah hari Kamis (4)
  const hijriEpoch = new Date(622, 6, 16); // 16 Juli 622 M
  const epochDayOfWeek = hijriEpoch.getDay(); // 4 (Kamis)
  
  let totalDays = 0;
  
  // Hitung total hari dari epoch (tahun 1 H hari 1)
  for (let y = 1; y < year; y++) {
    const leapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
    const isLeap = leapYears.includes((y % 30) || 30);
    totalDays += isLeap ? 355 : 354;
  }
  
  // Hitung hari dari awal tahun sampai bulan yang dimaksud
  const hijriMonthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
  const leapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
  const isLeapYear = leapYears.includes((year % 30) || 30);
  
  for (let m = 1; m < month; m++) {
    if (isLeapYear && m === 12) {
      totalDays += 30; // Dzulhijjah di tahun kabisat
    } else {
      totalDays += hijriMonthLengths[m - 1];
    }
  }
  
  // Tambahkan hari
  totalDays += day - 1;
  
  // Hitung hari dalam minggu (0 = Minggu, 1 = Senin, ..., 6 = Sabtu)
  return (epochDayOfWeek + totalDays) % 7;
}

// Fungsi untuk mendapatkan hari besar berdasarkan tanggal Hijriyah
export function getHariBesar(month: number, day: number): HariBesar | null {
  return (
    hariBesarData.find(
      (hari) => hari.date.month === month && hari.date.day === day
    ) || null
  );
}
