import appLogo from '../../assets/app_logo2.png';  

function AppLogo2() {
    return(
        <>
            <div className="flex items-center gap-2 bg-purple-50 cursor-pointer">
                <img className="h-[50px]" src={appLogo}/>
                <p className="font-caprasimo text-purple-400 text-2xl">SkillGrid.</p>
            </div>
        </>
    )
}

export default AppLogo2