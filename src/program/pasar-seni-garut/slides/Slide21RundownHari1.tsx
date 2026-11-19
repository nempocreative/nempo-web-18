import RundownHari3 from '../components/RundownHari3';
import { DAFTAR_SHOLAT_HARI_1, HARI_ACARA, PUNCAK_HARI_1_PAGI, RUNDOWN_HARI_1_PAGI, SOROTAN_HARI_1_PAGI } from '../jadwal';

export default function Slide21RundownHari1() {
  return (
    <RundownHari3
      rows={RUNDOWN_HARI_1_PAGI}
      sorotan={SOROTAN_HARI_1_PAGI}
      puncak={PUNCAK_HARI_1_PAGI}
      tanggal={HARI_ACARA.pembukaan}
      nomor="01"
      sesi="Pagi – Sore"
      judul="OPENING"
      kutipan={"Technical Meeting &\nPanggung Band"}
      waktuSholat={DAFTAR_SHOLAT_HARI_1}
      footerSlide={21}
    />
  );
}
