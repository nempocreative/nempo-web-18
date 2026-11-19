import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PROGRAM_NEMPO } from "@/data/program";
import {
  HARI_ACARA,
  KADENSI,
  RUNDOWN_HARI_1_MALAM,
  RUNDOWN_HARI_1_PAGI,
  RUNDOWN_HARI_2,
  RUNDOWN_HARI_3_MALAM,
  RUNDOWN_HARI_3_PAGI,
  TANGGAL_ACARA,
  WAKTU_SHOLAT_HARI_1,
  durasi,
  menitDurasi,
} from "./jadwal";

const kegiatan = (rows: { activity: string }[]) => rows.map((r) => r.activity).join(" | ");

describe("Pasar Seni Garut 2026 schedule", () => {
  it("runs 29–31 December 2026", () => {
    expect(TANGGAL_ACARA).toBe("29–31 Desember 2026");
    expect(HARI_ACARA).toEqual({
      pembukaan: "Selasa, 29 Desember 2026",
      pasanggiri: "Rabu, 30 Desember 2026",
      puncak: "Kamis, 31 Desember 2026",
    });
  });

  // Owner rule: the activity is a monthly routine, not a once-a-year event.
  it("is a monthly routine activity, not an annual one", () => {
    expect(KADENSI).toBe("Rutin setiap bulan");

    const dir = resolve(process.cwd(), "src/program/pasar-seni-garut");
    const files = [
      "deck.tsx",
      "manifest.json",
      ...readdirSync(resolve(dir, "slides")).map((f) => `slides/${f}`),
    ];
    for (const file of files) {
      expect(readFileSync(resolve(dir, file), "utf8")).not.toMatch(
        /event\s+tahunan|program\s+tahunan|festival\s+tahunan|ikon\s+tahunan/i,
      );
    }

    const kartu = PROGRAM_NEMPO.find((p) => p.slug === "pasar-seni-garut");
    expect(kartu?.ringkas).toMatch(/rutin digelar setiap bulan/i);
    expect(kartu?.sorotan).toContain("Rutin setiap bulan");
  });

  // Owner rule: day 1 starts at 08.00 and is finished by 22.00.
  it("day 1 starts at 08.00 and finishes at 22.00", () => {
    expect(RUNDOWN_HARI_1_PAGI[0]?.time.startsWith("08.00")).toBe(true);
    expect(RUNDOWN_HARI_1_MALAM.at(-1)?.time.endsWith("22.00")).toBe(true);
  });

  it("day 1 follows the owner's running order, morning then night", () => {
    expect(RUNDOWN_HARI_1_PAGI.map((r) => r.activity)).toEqual([
      "Registrasi Tenant & Final Briefing",
      "Technical Meeting Pasanggiri",
      "ISHOMA & Sholat Zuhur",
      "Penampilan Band 1",
      "Penampilan Band 2",
      "Penampilan Band 3",
      "Jeda Sholat Ashar",
      "Penampilan Band 4",
      "Istirahat & Sholat Maghrib",
    ]);
    expect(RUNDOWN_HARI_1_MALAM.map((r) => r.activity)).toEqual([
      "Persiapan Grand Opening",
      "Sholat Isya",
      "Mapag (Opsional)",
      "Bumper Opening",
      "Penampilan 1 — Rajah",
      "Penampilan 2 — Pupuh dengan Penari Latar",
      "Monolog",
      "Teater & Silat",
      "MC Masuk",
      "Sambutan & Pemukulan Goong",
      "Ice Breaking",
      "Penampilan Tari",
      "Musik Penutupan",
      "Closing MC",
    ]);
  });

  // Owner rule: technical meeting Pasanggiri runs 09.00–12.00.
  it("day 1 technical meeting runs 09.00 – 12.00", () => {
    expect(RUNDOWN_HARI_1_PAGI.find((r) => r.activity === "Technical Meeting Pasanggiri")?.time).toBe("09.00 – 12.00");
  });

  // Owner rule: bands start after Zuhur and finish at 17.00.
  it("day 1 bands start after the Zuhur break and end at 17.00", () => {
    const zuhur = RUNDOWN_HARI_1_PAGI.find((r) => r.activity.includes("Zuhur"))!;
    const band = RUNDOWN_HARI_1_PAGI.filter((r) => r.activity.startsWith("Penampilan Band"));
    expect(band).toHaveLength(4);
    expect(band[0]!.time.startsWith(zuhur.time.split(" – ")[1]!)).toBe(true);
    expect(band.at(-1)!.time.endsWith("17.00")).toBe(true);
  });

  // Owner rule: day 1 includes prayer times; each break covers at least the first 20 minutes after the prayer begins.
  it("day 1 lists Zuhur, Ashar, Maghrib and Isya breaks around their start times", () => {
    const semua = [...RUNDOWN_HARI_1_PAGI, ...RUNDOWN_HARI_1_MALAM];
    const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
    for (const [nama, masuk] of [
      ["Zuhur", WAKTU_SHOLAT_HARI_1.zuhur],
      ["Ashar", WAKTU_SHOLAT_HARI_1.ashar],
      ["Maghrib", WAKTU_SHOLAT_HARI_1.maghrib],
      ["Isya", WAKTU_SHOLAT_HARI_1.isya],
    ] as const) {
      const baris = semua.find((r) => r.activity.includes(`Sholat ${nama}`));
      expect(baris, nama).toBeDefined();
      expect(baris!.adzan, nama).toBe(masuk);
      const [mulai, selesai] = baris!.time.split(" – ").map(toMin);
      expect(mulai! <= toMin(masuk) + 15 && selesai! >= toMin(masuk) + 20, nama).toBe(true);
    }
  });

  it("day 1 rows run back to back with no gaps or overlaps", () => {
    const rows = [...RUNDOWN_HARI_1_PAGI, ...RUNDOWN_HARI_1_MALAM];
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i]!.time.split(" – ")[0]).toBe(rows[i - 1]!.time.split(" – ")[1]);
    }
  });

  // Owner rule: rundown rows show their duration in minutes.
  it("formats row durations", () => {
    expect(durasi("08.00 – 09.00")).toBe("60 menit");
    expect(durasi("09.00 – 12.00")).toBe("180 menit");
    expect(durasi("13.00 – 13.45")).toBe("45 menit");
    expect(durasi("15.45 – 17.00")).toBe("75 menit");
    expect(durasi("09.00")).toBe("—");
    expect(menitDurasi("21.50 – 22.00")).toBe(10);
  });

  it("every ranged row in every rundown has a positive duration", () => {
    for (const rows of [RUNDOWN_HARI_1_PAGI, RUNDOWN_HARI_1_MALAM, RUNDOWN_HARI_2, RUNDOWN_HARI_3_PAGI, RUNDOWN_HARI_3_MALAM]) {
      for (const r of rows) {
        const m = menitDurasi(r.time);
        if (m !== null) expect(m, r.time).toBeGreaterThan(0);
      }
    }
  });

  it("day 2 holds the Pasanggiri for all four categories and crowns the Duta", () => {
    const k = kegiatan(RUNDOWN_HARI_2);
    for (const c of ["TK", "SD 1–3", "SD 4–6", "SMP–SMA"]) expect(k).toContain(c);
    expect(k).toContain("Penobatan Duta Pasar Seni");
  });

  it("day 3 morning carries the owner's programme: talkshow, tari, gondang, games, dongeng, puisi, ketuk tilu, musik etnik", () => {
    const k = kegiatan(RUNDOWN_HARI_3_PAGI);
    for (const item of [
      "Talkshow UMKM",
      "Penampilan Gondang Babakan Loa",
      "Games Sunda",
      "Penampilan Dongeng Sunda",
      "Puisi Garut",
      "Ketuk Tilu Klagar",
      "Musik Etnik",
    ]) {
      expect(k).toContain(item);
    }
    expect(RUNDOWN_HARI_3_PAGI.filter((r) => r.activity === "Penampilan Tari")).toHaveLength(2);
  });

  it("day 3 night opens with Saduli Ragap, shows all four winners' dances, then closes with Bagendit, kaulinan, wiradomba, bajidor", () => {
    const k = kegiatan(RUNDOWN_HARI_3_MALAM);
    expect(k).toContain("Bubuka Karinding — Saduli Ragap");
    expect(k).toContain("Tarawangsa — Saduli Ragap");
    expect(k).toContain("Opening MC");
    for (const c of ["TK", "SD 1–3", "SD 4–6", "SMP–SMA"]) {
      expect(k).toContain(`Tarian Pemenang — Kategori ${c}`);
    }
    expect(RUNDOWN_HARI_3_MALAM.filter((r) => r.activity.startsWith("Tarian Pemenang"))).toHaveLength(4);
    expect(k).toContain("Ice Breaking");
    expect(k).toContain("Musik Etnik — 2 Lagu");
    expect(k).toContain("Musikal Tari Teater Bagendit");
    expect(k).toContain("Kaulinan Barudak");
    expect(k).toContain("Wiradomba");
    expect(k).toContain("Etnik Bajidor");
    expect(RUNDOWN_HARI_3_MALAM.filter((r) => r.activity === "MC Masuk")).toHaveLength(2);
  });

  it("day 3 morning ends with the awards and the night ends with the closing", () => {
    expect(RUNDOWN_HARI_3_PAGI.at(-1)?.activity).toContain("Trophy Bergilir");
    expect(RUNDOWN_HARI_3_MALAM.at(-1)?.activity).toContain("Penutupan");
  });
});
