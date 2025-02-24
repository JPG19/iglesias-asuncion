import React, {
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import { MyContext } from "../../../src/pages/_app";
import { debounce } from "lodash";

const DraggableSlider = ({ handleSearch }: any) => {
  const { currentPosition } = useContext(MyContext);
  const [value, setValue] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Effect to handle value changes
  useEffect(() => {
    const debouncedValue = debounce(() => {
      handleSearch("distance", value);
    }, 500)

    debouncedValue()
  }, [value, handleSearch]);

  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => handleMove(e);
    const handleGlobalEnd = () => handleEnd();

    if (isDragging) {
      window.addEventListener("mousemove", handleGlobalMove);
      window.addEventListener("mouseup", handleGlobalEnd);
      window.addEventListener("touchmove", handleGlobalMove);
      window.addEventListener("touchend", handleGlobalEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMove);
      window.removeEventListener("mouseup", handleGlobalEnd);
      window.removeEventListener("touchmove", handleGlobalMove);
      window.removeEventListener("touchend", handleGlobalEnd);
    };
  }, [isDragging]);

  if (!currentPosition.latitude || !currentPosition.longitude) {
    return null;
  }

  const handleStart = (event: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    updateValue(event);
  };

  const handleMove = (event: MouseEvent | TouchEvent) => {
    if (isDragging) {
      updateValue(event);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const updateValue = (
    event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
  ) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const clientX =
      "touches" in event
        ? event.touches[0].clientX
        : "clientX" in event
        ? event.clientX
        : 0;
    const x = clientX - rect.left;
    const width = rect.width;

    const newValue = Math.min(Math.max((x / width) * 100, 0), 100);
    setValue(Math.round(newValue));
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="mb-2 text-center text-lg font-medium text-white">
        Maximos kilometros de distancia: {value}
      </div>
      <div
        ref={sliderRef}
        className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <div
          className="absolute h-full bg-blue-500 rounded-full"
          style={{ width: `${value}%` }}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-blue-500 transform -translate-x-1/2 shadow-md transition-shadow ${
            isDragging ? "shadow-lg" : ""
          }`}
          style={{ left: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default DraggableSlider;
