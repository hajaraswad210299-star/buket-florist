import FigmaIcon from "@/components/site/FigmaIcon";

/** Floating WhatsApp consultation button (bottom-right). */
export default function WhatsappFab() {
  return (
    <a
      href="#"
      aria-label="Konsultasi sekarang melalui WhatsApp"
      className="group fixed z-50 bottom-5 right-5 lg:bottom-8 lg:right-8 flex items-center transition-transform duration-300 hover:scale-105"
    >
      <span className="relative z-10 -mr-1 flex items-center p-[10px] rounded-[90px] bg-[#7a70ba]">
        <FigmaIcon name="whatsapp" className="size-[24px]" />
      </span>
      <span className="hidden sm:flex h-[44px] items-center justify-center px-[16px] py-[10px] rounded-[90px] bg-[#7a70ba]">
        <span className="capitalize leading-[1.6] text-[14px] text-white whitespace-nowrap">
          Konsultasi sekarang
        </span>
      </span>
    </a>
  );
}
