import { Loader } from "../Icons";
import { Logo } from ".";

const Loading = () => {
  return (
    <div className="w-full h-screen max-sm:h-[70vh] relative flex-center">
      <div>
        <Loader width={64} height={64} />
      </div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Logo width={180} />
      </div>
    </div>
  );
};

export default Loading;
