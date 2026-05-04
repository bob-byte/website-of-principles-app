import logo from '../assets/logo-orange.png';
import language from '../assets/language-white.png';

function Header(){
    return(
        <header>
            <a className="logo__btn" href="#App.jsx">
                <img src={logo} alt="Logo" />
                Home
            </a>
            
            <ul>
                <li>
                    <a href="#">Private Policity</a>
                </li>
                <li>
                    <a href="#">User Agreement</a>
                </li>
                <li>
                    <a href="#">Settings</a>
                </li>
            </ul>

            <div className='nav__btns'>
                <button className='language__btn'>
                    <img src={language} alt="Language" />
                    <p>EN</p>
                </button>
                <button className='getStarted__btn'>Get started</button>
            </div>
        </header>
    )
}

export default Header;