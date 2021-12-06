
import classes from './BanksMap.module.css';

const BanksMap = () => {
  return (
    <div className={classes['banks-map']}>
      <div className={classes["banks-map__container"]}>
        <iframe
          id="gmap_canvas"
          title="banks map"
          src="https://maps.google.com/maps?q=banks%20near%20skopje&t=&z=13&ie=UTF8&iwloc=&output=embed"
          frameBorder="0"
          scrolling="no"
          width= '100%'
          height='100%'
        ></iframe>
      </div>
    </div>
  );
};

export default BanksMap;
