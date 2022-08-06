import styles from './Home.module.css';
import Logo from '../components/UI/Logo';
import Map from '../components/Map/Map';
import Navbar from '../components/UI/Navbar';

const Home = () => {
  return (
    <div>
      <div className={styles.header}>
        <Logo />
        <Map></Map>
      </div>
      <Navbar />
    </div>
  );
};

export default Home;
