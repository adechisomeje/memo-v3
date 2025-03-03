import React from "react";

const Tiers = () => {
  return (
    <section className="w-[90%] mx-auto max-w-[1159px] py-[120px] flex flex-col gap-12 relative ">
      <div className="flex flex-col gap-8 justify-center items-center">
        <div className="flex flex-col gap-2 text-center w-[70%] mx-auto">
          <h6 className="text-[40px] leading-[54.56px] font-bold text-accent-primary">
            Memo vendor tiers
          </h6>
          <p className="text-neutral-30 font-semibold text-xl !leading-[30px]">
            If you're part of our basic, premium or Enterprise plan, your store
            will be highlighted to memo customers.
          </p>
        </div>
        <div className="flex items-center">
          <button className="bg-accent-30 uppercase w-[111px] h-[44px] rounded-[22px] px-2 text-white text-[10px] !leading-[13.64px] font-normal">
            monthly
          </button>
          <button className="bg-transparent uppercase w-[111px] h-[44px] rounded-[22px] px-2  text-neutral-30  text-[10px] !leading-[13.64px] font-normal">
            yearly
          </button>
        </div>
      </div>
    </section>
  );
};

export default Tiers;
