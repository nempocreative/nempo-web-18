import { describe, expect, it } from "vitest";
import content from "@/data/ggs-hair-studio-content.json";
import pria from "../../scripts/ggs-hair-studio/pricelist-pria.json";
import wanita from "../../scripts/ggs-hair-studio/pricelist-wanita.json";
import { servicesFromPricelists, rupiahLabel, lowestPrice } from "../../scripts/ggs-hair-studio/pricelist-services";
import { whatsappFor, serviceWaText, bookingWaText } from "../../scripts/ggs-hair-studio/ggs-whatsapp";

const services = servicesFromPricelists(pria, wanita);
const find = (name: string) => services.find((s) => s.name === name)!;

describe("GGS home page services", () => {
  it("books men's services on the barber WhatsApp 0813-3335-9200", () => {
    expect(whatsappFor(find("Dewasa (only cut)"))).toBe("6281333359200");
    expect(serviceWaText(find("Dewasa (only cut)"))).toContain("Halo GGS Barber Studio");
  });

  it("books women's services on the GGS Beauty WhatsApp 0823-4277-7723", () => {
    expect(whatsappFor(find("Potong rambut"))).toBe("6282342777723");
    expect(serviceWaText(find("Potong rambut"))).toContain("Halo GGS Beauty");
  });

  it("uses the price list prices, not the old sample prices", () => {
    expect(find("Dewasa (only cut)").priceLabel).toBe("Rp35.000");
    expect(find("Paket GPS (Ganteng Pisan Sob)").priceLabel).toBe("Rp100.000");
    expect(find("Potong rambut").priceLabel).toBe("Rp50.000");
    expect(services.some((s) => s.name === "Signature Cut")).toBe(false);
  });

  it("keeps ranges and 'Mulai' wording from the list", () => {
    expect(rupiahLabel("50.000 – 100.000")).toBe("Rp50.000 – 100.000");
    expect(rupiahLabel("Mulai 100.000")).toBe("Mulai Rp100.000");
    expect(lowestPrice("650.000 – 1.000.000")).toBe(650000);
  });

  it("shows 8 men's and 8 women's highlights on the home page", () => {
    expect(services.filter((s) => s.featured && s.audience === "pria")).toHaveLength(8);
    expect(services.filter((s) => s.featured && s.audience === "wanita")).toHaveLength(8);
  });

  it("the booking form sends a chosen men's service to the barber", () => {
    const chosen = find("Paket G (Ganteng)");
    expect(whatsappFor(chosen)).toBe("6281333359200");
    expect(bookingWaText({ name: "Asep", service: chosen, date: "", time: "", notes: "" })).toContain("Paket G (Ganteng) (Rp45.000, 15 menit)");
  });

  it("the site serves the generated price-list services", () => {
    expect(content.services).toEqual(services);
  });
});
