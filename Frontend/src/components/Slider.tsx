import * as RadixSlider from "@radix-ui/react-slider";

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number[];
  onValueChange: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
}

function Slider({
  min,
  max,
  step,
  value,
  onValueChange,
  onValueCommit,
  onPointerDown,
  onPointerUp,
}: SliderProps) {
  return (
    <div className="relative w-full h-full">
      <RadixSlider.Root
        onValueChange={onValueChange}
        onValueCommit={onValueCommit}
        value={value}
        min={min}
        max={max}
        step={step}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="relative flex items-center select-none touch-none w-full h-2 group"
      >
        <RadixSlider.Track className="bg-neutral-600 relative grow rounded-full h-[3px]">
          <RadixSlider.Range className="absolute bg-white group-hover:bg-violet-500 rounded-full h-full" />
        </RadixSlider.Track>
        <RadixSlider.Thumb className="block bg-white w-[10px] h-[10px] group-hover:scale-110 rounded-full" />
      </RadixSlider.Root>
    </div>
  );
}

export default Slider;
