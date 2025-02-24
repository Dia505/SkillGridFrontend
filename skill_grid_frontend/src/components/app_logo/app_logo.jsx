import { useNavigate } from "react-router-dom"

function AppLogo() {
    const navigate = useNavigate();

    return(
        <>
            <div className="flex items-center gap-2 bg-purple-700 cursor-pointer" onClick={() => navigate("/")}>
                <img className="h-[50px]" src="src/assets/app_logo.png"/>
                <p className="font-caprasimo text-purple-50 text-2xl">SkillGrid.</p>
            </div>
        </>
    )
}

export default AppLogo