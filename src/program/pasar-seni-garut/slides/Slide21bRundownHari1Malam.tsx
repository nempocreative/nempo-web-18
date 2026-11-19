import RundownHari3 from '../components/RundownHari3';
import { DAFTAR_SHOLAT_HARI_1, HARI_ACARA, PUNCAK_HARI_1_MALAM, RUNDOWN_HARI_1_MALAM, SOROTAN_HARI_1_MALAM } from '../jadwal';

export default function Slide21bRundownHari1Malam() {
  return (
    <RundownHari3
      rows={RUNDOWN_HARI_1_MALAM}
      sorotan={SOROTAN_HARI_1_MALAM}
      puncak={PUNCAK_HARI_1_MALAM}
      tanggal={HARI_ACARA.pembukaan}
      nomor="01"
      sesi="Malam"
      judul="OPENING"
      kutipan={"Grand Opening &\nKesenian Sunda"}
      waktuSholat={DAFTAR_SHOLAT_HARI_1}
      footerSlide={22}
    />
  );
}
