import styles from './Navbar.module.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faUser,
  faList,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const id = localStorage.getItem('id');
  return (
    <footer className={styles.navbar}>
      <nav>
        <ul>
          <li>
            <NavLink to="/">
              <FontAwesomeIcon icon={faHouse} size="2x" color="white" />
            </NavLink>
          </li>
          <li>
            <NavLink to={`/profile/${id}`}>
              <FontAwesomeIcon icon={faUser} size="2x" color="white" />
            </NavLink>
          </li>
          <li>
            <NavLink to={`/transactions/${id}`}>
              <FontAwesomeIcon icon={faList} size="2x" color="white" />
            </NavLink>
          </li>
          <li>
            <NavLink to={`/wallet/${id}`}>
              <FontAwesomeIcon icon={faWallet} size="2x" color="white" />
            </NavLink>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Navbar;
