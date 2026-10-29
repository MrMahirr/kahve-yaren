/** Alt çizgili girdi görünümü; hatalıyken (aria-invalid) kalın kiremit çizgi. */
export const fieldControlClasses =
  'w-full rounded-none border-0 border-b border-gri-kahve bg-transparent px-0.5 font-body text-[17px] leading-normal text-telve outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-gri-kahve focus:border-zeytin focus:shadow-[0_1.5px_0_0_var(--color-zeytin)] aria-invalid:border-b-2 aria-invalid:border-kiremit aria-invalid:shadow-none sm:text-lg'

/** Bir alanın hata metni öğesinin kimliği; girdinin aria-describedby değeri. */
export const errorId = (id: string) => `${id}-hata`
