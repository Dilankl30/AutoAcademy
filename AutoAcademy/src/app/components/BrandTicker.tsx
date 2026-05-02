const brands = ['Toyota', 'Hyundai', 'Kia', 'Chevrolet', 'Nissan', 'Mazda', 'Ford', 'BMW'];

export default function BrandTicker() {
  const loopBrands = [...brands, ...brands];

  return (
    <section className="bg-white dark:bg-slate-900 py-4 border-b border-gray-100 dark:border-slate-800 overflow-hidden">
      <p className="text-center text-gray-500 dark:text-slate-400 text-sm mb-3">Marcas que confían en AutoAcademy</p>
      <div className="relative">
        <div className="flex w-max animate-[scroll_24s_linear_infinite] gap-10 px-6">
          {loopBrands.map((brand, index) => (
            <div key={`${brand}-${index}`} className="text-gray-400 dark:text-slate-500 font-semibold text-xl whitespace-nowrap">
              {brand}
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}
