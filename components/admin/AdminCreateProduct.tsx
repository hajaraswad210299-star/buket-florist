"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { uploadProductImage } from "@/app/admin/actions";
import { saveAdminProduct } from "@/lib/admin-save-client";
import { productAsset } from "@/components/figmaAssets";
import { IconArrowLeft, IconChevronDown } from "@/components/site/icons";
import { IconUpload, IconImage, IconSave, IconGrip, IconDoc } from "@/components/admin/icons";

/* --------------------------- small building blocks --------------------------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-[8px]">
      <span className="text-[#3f425a] text-[14px] font-medium">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full bg-white border border-[#e1e2ea] rounded-[10px] px-[16px] py-[12px] text-[15px] text-[#3f425a] placeholder:text-[#a5a8c0] outline-none transition-colors focus:border-[#928ac7]";

function RichSection({ title, value, onChange }: { title: string; value: { heading: string; body: string }; onChange: (value: { heading: string; body: string }) => void }) {
  return (
    <div className="flex items-stretch gap-[10px]">
      <span className="hidden md:flex items-center text-[#c3c5d5]"><IconGrip className="size-[16px]" /></span>
      <div className="flex-1 min-w-px bg-white border border-[#ececf1] rounded-[14px] p-[18px] flex flex-col gap-[16px]">
        <p className="flex items-center gap-[8px] font-semibold text-[#544997] text-[15px]">
          <IconDoc className="size-[17px]" /> {title}
        </p>
        <Field label="Heading">
          <input className={inputCls} placeholder="Judul bagian" value={value.heading} onChange={e => onChange({ ...value, heading: e.target.value })} maxLength={120} />
        </Field>
        <div className="flex flex-col gap-[8px]">
          <span className="text-[#3f425a] text-[14px] font-medium">Body Text</span>
          <div className="rounded-[10px] border border-[#e1e2ea] overflow-hidden">

            <textarea
              className="w-full h-[130px] resize-none bg-[#f7f7fb] px-[16px] py-[12px] text-[15px] text-[#3f425a] placeholder:text-[#a5a8c0] outline-none"
              placeholder="Describe your content..."
              value={value.body} onChange={e => onChange({ ...value, body: e.target.value })} maxLength={10000}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- page --------------------------------- */

function formatRp(v: string) {
  const n = Number(v.replace(/\D/g, ""));
  if (!n) return "Rp 0";
  return "Rp " + n.toLocaleString("id-ID");
}

export default function AdminCreateProduct({ product }: { product?: Product }) {
  const router = useRouter();
  const [title, setTitle] = useState(product?.name ?? "");
  const [size, setSize] = useState(product?.size_cm?.toString() ?? "");
  const [jenis, setJenis] = useState(product?.product_group ?? "Bunga");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(product?.tags?.length ? product.tags : product ? [product.category] : []);
  const [thumb, setThumb] = useState<string | null>(product?.image_url ?? null);
  const [images, setImages] = useState<string[]>(product?.gallery ?? []);
  const [stok, setStok] = useState(product?.stock.toString() ?? "");
  const [harga, setHarga] = useState(product?.price.toString() ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [cities, setCities] = useState(product?.delivery_cities.join(", ") ?? "");
  const [sections, setSections] = useState(["Detail Buket", "Perawatan Bunga", "Pengiriman & Pengembalian"].map((heading, i) => product?.content_sections?.[i] ?? { heading, body: i === 0 ? product?.description ?? "" : "" }));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  async function upload(files: File[], cover: boolean) {
    if (uploading || busy) return;
    setError(""); setUploading(true);
    try {
      if (!files.length || (!cover && images.length + files.length > 12)) throw new Error("Maksimal 12 foto galeri.");
      for (const file of files) {
        const data = new FormData(); data.set("file", file);
        const result = await uploadProductImage(data);
        if (!result.ok) throw new Error(result.error);
        if (cover) setThumb(result.url); else setImages(previous => [...previous, result.url]);
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Upload gagal. Silakan coba lagi."); }
    finally { setUploading(false); }
  }
  async function save(active: boolean) {
    if (submitting.current || uploading) return;
    submitting.current = true; setBusy(true); setError("");
    try {
      if (!harga.trim() || !stok.trim() || !/^\d+$/.test(harga) || !/^\d+$/.test(stok)) throw new Error("Isi harga dan stok dengan angka bulat tanpa titik.");
      await saveAdminProduct(product?.id ?? null, {
        name: title, slug, product_group: jenis, category: tags[0] ?? "", tags,
        size_cm: size ? Number(size) : null, price: Number(harga), stock: Number(stok),
        image_url: thumb ?? "", gallery: images, delivery_cities: cities.split(",").map(v => v.trim()).filter(Boolean),
        description: sections[0].body, content_sections: sections, is_active: active,
      });
      router.push("/admin/products?saved=1"); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Produk gagal disimpan."); }
    finally { submitting.current = false; setBusy(false); }
  }

  const thumbInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  const priceLabel = formatRp(harga);
  const previewImg = thumb ?? images[0] ?? productAsset.p8;

  return (
    <main className="bg-white lg:rounded-[20px] min-h-screen lg:min-h-[calc(100vh-16px)] overflow-hidden">
      {/* topbar */}
      <div className="flex items-center gap-[14px] px-[24px] lg:px-[32px] h-[68px] border-b border-[#eef0f3]">
        <a
          href="/admin/products"
          aria-label="Kembali"
          className="flex items-center justify-center size-[38px] rounded-[10px] border border-[#e1e2ea] text-[#3f425a] transition-all duration-200 hover:bg-[#f2f3f7] hover:-translate-x-0.5"
        >
          <IconArrowLeft className="size-[18px]" />
        </a>
        <p className="text-[16px]">
          <span className="text-[#8b8f99]">Product</span>
          <span className="text-[#c3c5d5] mx-[8px]">/</span>
          <span className="font-semibold text-[#1d211d]">{product ? "Edit Product" : "Add New Product"}</span>
        </p>
      </div>

      <div className="px-[24px] lg:px-[32px] py-[24px] flex flex-col xl:flex-row gap-[24px]">
        {/* ------------------------------ left ------------------------------ */}
        <div className="flex-1 min-w-px flex flex-col gap-[24px]">
          {/* product details */}
          <div className="bg-[#fafafa] border border-[#ececf1] rounded-[16px] p-[20px] lg:p-[24px] flex flex-col gap-[20px]">
            <p className="font-semibold text-[#1d211d] text-[16px]">Product Details</p>

            <textarea
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (!product) setSlug(e.target.value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }}
              rows={2}
              placeholder="Tambahkan Judul Product…"
              className="w-full resize-none bg-[#f1f1f6] rounded-[12px] px-[22px] py-[20px] font-ivy text-[28px] leading-[1.2] text-[#3f425a] placeholder:text-[#b3aed6] outline-none transition-shadow focus:ring-2 focus:ring-[#928ac7]/40"
            />

            <Field label="Slug (alamat produk)"><input value={slug} onChange={e => setSlug(e.target.value)} className={inputCls} placeholder="buket-lavender" /></Field>
            <Field label="Kota Pengiriman (pisahkan dengan koma)"><input value={cities} onChange={e => setCities(e.target.value)} className={inputCls} placeholder="Jakarta Pusat, Bandung" /></Field>
            <Field label="Size Diameter">
              <div className="relative">
                <input value={size} onChange={(e) => setSize(e.target.value)} className={inputCls + " pr-[52px]"} placeholder="E.g 40" />
                <span className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#8b8f99] text-[14px]">CM</span>
              </div>
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <Field label="Jenis">
                <div className="relative">
                  <select
                    value={jenis}
                    onChange={(e) => setJenis(e.target.value)}
                    className={inputCls + " appearance-none pr-[40px] cursor-pointer"}
                  >
                    <option value="Bunga">Buket Bunga</option>
                    <option value="Karangan Papan Bunga">Karangan Papan</option>
                    <option value="kado dan Cakes">Kado &amp; Cakes</option>
                  </select>
                  <IconChevronDown className="absolute right-[14px] top-1/2 -translate-y-1/2 size-[16px] text-[#8b8f99] pointer-events-none" />
                </div>
              </Field>
              <Field label="Kategori">
                <div className="relative">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className={inputCls + " pr-[44px]"}
                    placeholder="Buket Bungan Balon"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    aria-label="Tambah kategori"
                    className="absolute right-[8px] top-1/2 -translate-y-1/2 flex items-center justify-center size-[30px] rounded-[8px] text-[#8b8f99] transition-colors hover:bg-[#eceaf6] hover:text-[#544997]"
                  >
                    ↵
                  </button>
                </div>
              </Field>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-[8px] -mt-[8px]">
                {tags.map((t) => (
                  <span key={t} className="group flex items-center gap-[8px] bg-[#efeaf9] text-[#544997] text-[13px] font-medium pl-[12px] pr-[8px] py-[6px] rounded-full">
                    {t}
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((x) => x !== t))}
                      aria-label={`Hapus ${t}`}
                      className="flex items-center justify-center size-[16px] rounded-full text-[#7a70ba] transition-colors hover:bg-[#544997] hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* thumbnail */}
            <Field label="Thumbnail Cover">
              <button
                type="button"
                onClick={() => thumbInput.current?.click()}
                className="group relative w-full overflow-hidden rounded-[12px] border border-dashed border-[#cbc7e0] bg-[#f7f7fb] transition-colors hover:border-[#928ac7] hover:bg-[#f1eff9]"
              >
                {thumb ? (
                  <img alt="" src={thumb} className="w-full h-[190px] object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-[10px] py-[44px]">
                    <span className="flex items-center justify-center size-[46px] rounded-full bg-white text-[#544997] shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                      <IconUpload className="size-[22px]" />
                    </span>
                    <p className="text-[#3f425a] text-[14px] font-medium">Klik untuk upload foto</p>
                    <p className="text-[#8b8f99] text-[13px]">PNG, JPG, WebP (maks. 5 MB)</p>
                  </div>
                )}
              </button>
              <input
                ref={thumbInput}
                type="file"
                accept="image/png,image/jpeg,image/webp" disabled={busy || uploading}
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void upload([f], true);
                  e.target.value = "";
                }}
              />
            </Field>
          </div>

          {/* image gallery */}
          <div className="bg-[#fafafa] border border-[#ececf1] rounded-[16px] p-[20px] lg:p-[24px]">
            <p className="flex items-center gap-[8px] font-semibold text-[#544997] text-[15px] mb-[16px]">
              <IconImage className="size-[18px]" /> IMAGE
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-[14px]">
              {images.map((src, i) => (
                <div key={i} className="group relative aspect-square rounded-[12px] overflow-hidden bg-[#efeef4]">
                  <img alt="" src={src} className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, x) => x !== i))}
                    className="absolute top-[8px] right-[8px] flex items-center justify-center size-[26px] rounded-full bg-black/50 text-white text-[14px] opacity-100 sm:opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 hover:bg-[#f3205c]"
                    aria-label="Hapus foto"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => galleryInput.current?.click()}
                className="group flex flex-col items-center justify-center gap-[8px] aspect-square rounded-[12px] border border-dashed border-[#cbc7e0] bg-[#f7f7fb] text-[#8b8f99] transition-colors hover:border-[#928ac7] hover:bg-[#f1eff9]"
              >
                <span className="flex items-center justify-center size-[38px] rounded-full bg-white text-[#544997] shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                  <IconUpload className="size-[18px]" />
                </span>
                <span className="text-[13px] font-medium text-[#3f425a]">Tambahkan Foto</span>
                <span className="text-[12px]">PNG, JPG, WebP · maks. 5 MB</span>
              </button>
              <input
                ref={galleryInput}
                type="file"
                accept="image/png,image/jpeg,image/webp" disabled={busy || uploading}
                multiple
                hidden
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (files.length) void upload(files, false);
                  e.target.value = "";
                }}
              />
            </div>
          </div>

          {/* rich sections */}
          <p className="text-[#544997] text-[14px] font-medium">Informasi Pokok Produk</p>
          {sections.map((section, index) => <RichSection key={index} title={["Detail Buket", "Perawatan Bunga", "Pengiriman & Pengembalian"][index]} value={section} onChange={value => setSections(previous => previous.map((s, i) => i === index ? value : s))} />)}
        </div>

        {/* ------------------------------ right ------------------------------ */}
        <div className="w-full xl:w-[330px] shrink-0 flex flex-col gap-[20px]">
          {/* pricing */}
          <div className="bg-[#fafafa] border border-[#ececf1] rounded-[16px] p-[20px] flex flex-col gap-[16px]">
            <p className="font-semibold text-[#1d211d] text-[16px]">Pricing &amp; Stok</p>
            <Field label="Stok">
              <input value={stok} onChange={(e) => setStok(e.target.value)} className={inputCls} placeholder="e.g 200" inputMode="numeric" />
            </Field>
            <Field label="Harga">
              <div className="relative">
                <input value={harga} onChange={(e) => setHarga(e.target.value)} className={inputCls + " pr-[44px]"} placeholder="0.00" inputMode="numeric" />
                <span className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#8b8f99] text-[14px]">Rp</span>
              </div>
            </Field>
            <div className="bg-white border border-[#ececf1] rounded-[12px] p-[6px]">
              <p className="text-[#8b8f99] text-[12px] px-[10px] pt-[6px]">Preview Harga Akhir</p>
              <div className="flex items-center justify-between bg-[#fafafa] rounded-[10px] px-[14px] py-[12px] mt-[6px]">
                <span className="text-[#3f425a] text-[14px] font-medium">Harga Akhir</span>
                <span className="text-[#544997] text-[15px] font-bold">{priceLabel}</span>
              </div>
            </div>
          </div>

          {/* preview card */}
          <div className="bg-[#fafafa] border border-[#ececf1] rounded-[16px] p-[20px]">
            <p className="font-semibold text-[#1d211d] text-[16px] mb-[14px]">Pratinjau Kartu Produk</p>
            <div className="flex flex-col gap-[12px]">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[12px] bg-[#efeef4]">
                <img alt="" src={previewImg} className="absolute inset-0 size-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="flex flex-col items-center gap-[4px] text-center pb-[4px]">
                <p className="text-[#3f425a] text-[15px] font-medium">{title.trim() || "Pesona Lavender Mewah"}</p>
                <p className="text-[#544997] text-[18px] font-bold">{priceLabel}</p>
              </div>
            </div>
          </div>

          {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
          {(busy || uploading) && <p role="status">{uploading ? "Mengunggah gambar..." : "Menyimpan produk..."}</p>}
          <p className="text-sm text-[#696f96]">Kategori pertama menjadi kategori utama. Draft tidak tampil di katalog.</p>
          {/* actions */}
          <div className="flex items-center gap-[12px]">
            <button type="button" disabled={busy || uploading} onClick={() => save(false)} className="disabled:opacity-50 group flex-1 flex items-center justify-center gap-[8px] h-[48px] rounded-[10px] border border-[#e1e2ea] text-[#3f425a] text-[14px] font-medium transition-colors hover:bg-[#f2f3f7]">
              Save as Draft
              <IconSave className="size-[17px] text-[#8b8f99] transition-colors group-hover:text-[#544997]" />
            </button>
            <button type="button" disabled={busy || uploading} onClick={() => save(true)} className="group flex-1 flex items-center justify-center gap-[8px] h-[48px] rounded-[10px] bg-[#544997] text-white text-[14px] font-medium transition-colors hover:bg-[#443a86]">
              Publish
              <span className="transition-transform duration-500 group-hover:rotate-180">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="size-[17px]">
                  <circle cx="12" cy="12" r="8.4" />
                  <path d="M3.7 12h16.6M12 3.6c2.3 2.3 3.6 5.3 3.6 8.4s-1.3 6.1-3.6 8.4c-2.3-2.3-3.6-5.3-3.6-8.4S9.7 5.9 12 3.6Z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
