import { useEffect, useRef, useState } from "react";
import AppButton from "./AppButton";
import LegalPageLink from "./legal/LegalPageLink";
import { openAppStore } from "../utils/openAppStore";
import { useTranslation } from "../locale/LocaleProvider";
import logoOrange from "../assets/logo-orange.png";
import logoBlue from "../assets/logo-blue.png";

function Header(){
    const { locale, setLocale, theme, setTheme, translate } = useTranslation();
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const themeMenuRef = useRef(null);
    const logo = theme.includes("blue") ? logoBlue : logoOrange;
    const navigationLinks = [
        { key: "header.privacyPolicy", href: "/privacypolicy" },
        { key: "header.userAgreement", href: "/useragreement" },
        { key: "header.settings", href: "/settings" },
    ];
    const themeOptions = [
        { value: "dark-orange", className: "theme-swatch--dark-orange", ariaLabel: translate("header.themeDarkOrange") },
        { value: "dark-blue", className: "theme-swatch--dark-blue", ariaLabel: translate("header.themeDarkBlue") },
        { value: "light-orange", className: "theme-swatch--light-orange", ariaLabel: translate("header.themeLightOrange") },
        { value: "light-blue", className: "theme-swatch--light-blue", ariaLabel: translate("header.themeLightBlue") },
    ];
    const activeThemeOption = themeOptions.find((option) => option.value === theme) ?? themeOptions[0];

    useEffect(() => {
        const onDocumentPointerDown = (event) => {
            if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
                setIsThemeMenuOpen(false);
            }
        };

        document.addEventListener("pointerdown", onDocumentPointerDown);
        return () => document.removeEventListener("pointerdown", onDocumentPointerDown);
    }, []);

    return(
        <>
            <header>
                <a className="logo__btn" href="/">
                    <img src={logo} alt={translate("header.logoAlt")} />
                    {translate("header.home")}
                </a>
                
                <ul className="header__nav-list">
                    {navigationLinks.map((link) => (
                        <li key={link.key}>
                            {link.href.startsWith("/") ? (
                                <LegalPageLink href={link.href} className="legal-page-link--nav">
                                    {translate(link.key)}
                                </LegalPageLink>
                            ) : (
                                <a href={link.href}>{translate(link.key)}</a>
                            )}
                        </li>
                    ))}
                </ul>

                <div className='nav__btns'>
                    <div className="theme-select" ref={themeMenuRef}>
                        <button
                            type="button"
                            className="theme-select__trigger"
                            aria-label={translate("header.themeAria")}
                            aria-haspopup="listbox"
                            aria-expanded={isThemeMenuOpen}
                            onClick={() => {
                                setIsThemeMenuOpen((prev) => !prev);
                            }}
                        >
                            <span className={`theme-swatch ${activeThemeOption.className} is-active`} aria-hidden="true" />
                        </button>
                        {isThemeMenuOpen && (
                            <div className="theme-select__menu" role="listbox" aria-label={translate("header.themeAria")}>
                                {themeOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={`theme-swatch ${option.className}${theme === option.value ? " is-active" : ""}`}
                                        aria-label={option.ariaLabel}
                                        aria-selected={theme === option.value}
                                        onClick={() => {
                                            setTheme(option.value);
                                            setIsThemeMenuOpen(false);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <select
                        className="header-language-select"
                        value={locale}
                        onChange={(e) => setLocale(e.target.value)}
                        aria-label={translate("header.languageAria")}
                    >
                        <option value="en">EN</option>
                        <option value="uk">УКР</option>
                    </select>
                    <AppButton variant="primary" onClick={openAppStore}>
                        {translate("header.getStarted")}
                    </AppButton>
                </div>
            </header>
            <nav className="mobile-navbar" aria-label="Mobile navigation">
                <ul className="mobile-navbar__list">
                    {navigationLinks.map((link) => (
                        <li key={`mobile-${link.key}`}>
                            {link.href.startsWith("/") ? (
                                <LegalPageLink href={link.href} className="legal-page-link--nav">
                                    {translate(link.key)}
                                </LegalPageLink>
                            ) : (
                                <a href={link.href}>{translate(link.key)}</a>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    )
}

export default Header;