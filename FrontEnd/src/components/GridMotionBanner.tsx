import GridMotion from "../libs/reactbits/GridMotion";

function GridMotionBanner() {
  const items = [
    <img key="item-1" src="./Card1.png" />,
    <img key="item-2" src="./Card1.png" />,
    <img key="item-3" src="./Card1.png" />,
    <img key="item-4" src="./Card1.png" />,
    <img key="item-5" src="./Card1.png" />,
    <img key="item-6" src="./Card1.png" />,
    <img key="item-7" src="./Card1.png" />,
    <img key="item-1" src="./Card1.png" />,
    <img key="item-2" src="./Card1.png" />,
    <img key="item-3" src="./Card1.png" />,
    <img key="item-4" src="./Card1.png" />,
    <img key="item-5" src="./Card1.png" />,
    <img key="item-6" src="./Card1.png" />,
    <img key="item-7" src="./Card1.png" />,
    <img key="item-1" src="./Card1.png" />,
    <img key="item-2" src="./Card1.png" />,
    <img key="item-3" src="./Card1.png" />,
    <img key="item-4" src="./Card1.png" />,
    <img key="item-5" src="./Card1.png" />,
    <img key="item-6" src="./Card1.png" />,
    <img key="item-7" src="./Card1.png" />,
    <img key="item-2" src="./Card1.png" />,
    <img key="item-3" src="./Card1.png" />,
    <img key="item-4" src="./Card1.png" />,
    <img key="item-5" src="./Card1.png" />,
    <img key="item-6" src="./Card1.png" />,
    <img key="item-7" src="./Card1.png" />,
    <img key="item-7" src="./Card1.png" />,
    // Puedes añadir más si lo deseas
  ];

  return (
    <div className="flex flex-col items-center justify-center w-12/12 h-12/12 rounded-2xl">
      <GridMotion items={items} />
    </div>
  );
}

export default GridMotionBanner;
