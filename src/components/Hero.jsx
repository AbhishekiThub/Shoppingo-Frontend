const Hero = () => {

  return (

    <div className="max-w-7xl mx-auto px-4 mt-6">

      <div className="rounded-2xl overflow-hidden relative">

        <img
          src="/hero-banner.png"
          alt="shopping banner"
          className="w-full h-[320px] object-cover fade-in"
        />

        <div className="absolute inset-0 flex flex-col justify-center pl-10 bg-black/30">

          <h1 className="text-4xl font-bold text-white fade-up">
            Discover Amazing Deals
          </h1>

          <p className="text-white mt-2 fade-up">
            Shop top brands at unbeatable prices
          </p>

          <button className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold w-fit fade-up">
            Shop Now
          </button>

        </div>

      </div>

    </div>

  );

};

export default Hero;