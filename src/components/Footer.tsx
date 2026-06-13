export default function Footer() {
  return (
    <footer className="border-t border-[#e8e3d8] mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-serif text-[#1c1a16] font-semibold tracking-wide">Wandering & Working</p>
        <p className="text-sm text-[#8a8074]">© {new Date().getFullYear()} — a life in motion.</p>
      </div>
    </footer>
  );
}
