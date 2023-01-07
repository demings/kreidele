export function CurrentWord({ word }: { word: string }) {
  return (
    <div className="bg-slate-100 flex justify-center select-none border-b p-1 text-slate-700">
      {word.toLocaleUpperCase()}
    </div>
  );
}
