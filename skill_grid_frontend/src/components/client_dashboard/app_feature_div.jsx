function AppFeatureDiv({ bgColor, featureImg, title, subtitle }) {
    return (
        <div className={`1175:w-[21.7vw] 589:w-[80vw] 500:w-[90vw] 921:h-[26vw] 800:h-[35vw]  ${bgColor} flex flex-col items-center justify-center rounded-lg pl-8 pr-8 800:py-0 500:py-5 1200:gap-4`}>
            <img className="1200:h-[12vw] 800:h-[10vw] 500:h-[15vw]" src={featureImg}/>
            <p className="font-Inter font-semibold 1200:text-xl 500:text-lg text-center">{title}</p>
            <p className="font-Inter font-light 800:text-sm text-center">{subtitle}</p>
        </div>
    );
}

export default AppFeatureDiv;
