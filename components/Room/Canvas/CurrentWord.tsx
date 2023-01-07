export function CurrentWord({ word }: { word: string }) {
  return (
    <div className="absolute translate-x-36 translate-y-2 flex items-center justify-center select-none">
      <div className="shadow-md bg-slate-100 px-4 py-2 flex items-center content-center">
        {word.toLocaleUpperCase()}
      </div>
    </div>
  );
}
