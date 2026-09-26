import { asset } from "@/components/figmaAssets";

// Additional entries are approved demo content, not verified customer reviews.
// Replace these records and remove `example` when real customer data is supplied.
export const testimonials = [
  { name: "Nadia Putri", role: "Pelanggan • Jakarta", image: asset.image13, example: true,
    quote: "Pesan untuk ulang tahun sahabat dan hasilnya cantik sekali. Pilihan warnanya lembut, bunganya segar, dan kartu ucapannya bikin hadiah terasa lebih personal." },
  { name: "Alya Prameswari", role: "Marketing Manager", image: asset.image8, example: false,
    quote: "Bunganya bagus banget, pas sampai masih fresh dan penataannya juga rapi. Yang paling suka itu warnanya ternyata lebih cantik dari yang saya bayangkan." },
  { name: "Rania Safitri", role: "Pelanggan • Bandung", image: asset.image11, example: true,
    quote: "Suka banget dengan rangkaian bunganya. Admin membantu memilih warna yang pas, pengirimannya rapi, dan hadiahnya sampai tepat untuk momen spesial kami." },
  { name: "Citra Lestari", role: "Pelanggan • Surabaya", image: asset.image7, example: true,
    quote: "Pertama kali pesan bunga online dan prosesnya mudah. Buketnya sesuai pilihan, kemasannya cantik, dan penerimanya senang sekali. Terima kasih, Sekar Wangi!" },
  { name: "Dinda Maharani", role: "Pelanggan • Semarang", image: asset.image6, example: true,
    quote: "Rangkaian untuk acara keluarga terlihat elegan dan segar. Detail kecilnya diperhatikan, dari warna bunga sampai pita. Jadi hadiah yang berkesan untuk orang tersayang." },
] as const;
