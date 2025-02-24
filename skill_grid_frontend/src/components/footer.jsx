function Footer() {
    return (
        <>
            <div className="flex bg-black-700 w-full justify-between items-center md:pl-12 500:pl-5 md:pr-12 500:pr-5 pt-6 pb-6">
                <p className="md:text-lg 500:text-sm text-white font-inter">© 2024 SkillGrid. All rights reserved.</p>
                <div className="flex items-center gap-2">
                    <img className="md:h-[80px] 500:h-12" src="/footer_app_logo.png" />
                    <p className="font-caprasimo text-white md:text-3xl 500:text-xl">SkillGrid.</p>
                </div>
            </div>
        </>
    )
}

export default Footer;