function Footer() {
    return (
        <>
            <div className="flex bg-black w-full justify-between items-center pl-12 pr-12 pt-6 pb-6">
                <p className="text-lg text-white font-inter">© 2024 SkillGrid. All rights reserved.</p>
                <div className="flex items-center gap-2">
                    <img className="h-[80px]" src="/footer_app_logo.png" />
                    <p className="font-caprasimo text-white text-3xl">SkillGrid.</p>
                </div>
            </div>
        </>
    )
}

export default Footer;