import BackButton from "./ui/BackButton";

const BackWTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex justify-between width-100 mar-btm30">
      <BackButton />
      <h1 className="text-center bright-text">{title}</h1>
      <div style={{ width: "45px" }}></div>
    </div>
  );
};

export default BackWTitle;
