import BanksMap from "./BanksMap";
import classes from './Header.module.css';

const Header = () => {
    return(
        <header className={classes['header']}>
            <div className={classes['header__background']}>
                <div className={classes['header__content']}>
                    <h1>Search Banks in Skopje</h1>
                    <label htmlFor="search">Enter bank name</label>
                    <input type="text" placeholder="Stopanska Banka...etc" id='search'/>
                    <button>Search</button>
                </div>
            </div>
            <BanksMap />
        </header>
    )
}

export default Header;