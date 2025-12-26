const Header = () => {
  return (
    <header className="bg-hero bg-center bg-cover bg-no-repeat sm:p-16 py-16 px-8 flex justify-center lg:items-center max-lg:flex-col w-full sm:gap-16 gap-0">
      <div className="flex-1 flex flex-col  gap-10">
        <div className="flex justify-center sm:justify-start">
            <img
            src="/logo.png"
            alt="logo"
            width={230}
            height={230}
            className="object-contain"
            />
        </div>

        <h1 className="sm:text-6xl text-5xl text-white lg:max-w-lg font-bold leading-[120%]">
          Explore The <span className="red-gradient">Diverse Realms</span> of
          Anime Magic
        </h1>
      </div>

      <div className="lg:flex-1 relative w-full h-[50vh] flex justify-center mt-10 sm:mt-0">
        <img
          src="./Aizen.webp"
          alt="anime"
          className="object-contain w-full h-full"
        />
      </div>
    </header>
  );
};

export default Header;
