export function CurrentWord({ word }: { word: string }) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="shadow-md bg-slate-100 px-4 py-2 flex items-center content-center">
        {word.toLocaleUpperCase()}
      </div>
    </div>
  );
}
