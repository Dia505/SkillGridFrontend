function AppFeatureDiv({ bgColor, featureImg, title, subtitle }) {
    return (
        <div className={`w-[331px] h-[390px] ${bgColor} flex flex-col items-center justify-center rounded-lg pl-8 pr-8 gap-4`}>
            <img className="h-[186px]" src={featureImg}/>
            <p className="font-Inter font-semibold text-xl text-center">{title}</p>
            <p className="font-Inter font-light text-based text-center">{subtitle}</p>
        </div>
    );
}

export default AppFeatureDiv;
