import classes from "./Header.module.css";
import { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ReactComponent as IconLocation } from "../assets/iconLocation.svg";
import { ReactComponent as IconNearMe } from "../assets/iconNearMe.svg";
import bankDataJson from "../data/data_map.json";

const Header = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [showAllBanks, setShowAllBanks] = useState(true);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [showNearestBanks, setShowNearestBanks] = useState(false);
  const [nearestBanksData, setNearestBankData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [showSearchData, setShowSearchData] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const searchInputRef = useRef();

  navigator.geolocation.getCurrentPosition(function (position) {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
  });

  const getFiveNearest = (range, fuels) => {          // Ova funkcija gi pronaogja najbliskite pet od prethodno                                                                              // Ova funkcija gi pronaogja najbliskite pet od prethodno
    range.sort(function (a, b) {return a - b});      // povikanata funkcija arePointsNear() i so toa se pronaogjat                                                                      // povikanata funkcija arePointsNear() i so toa se pronaogjat
    for (let i = 0; i < 5; i++) {                   // najbliskite pet benzinski                                                                // najbliskite pet benzinski
        for (let j = 0; j < range.length; j++) {
            if (range[i] === fuels[j].rangeFuel) {
                let fuelsParts = fuels[j].station.split('/');
            }
        }
    }
}


  const arePointsNear = (
    myLatitude,
    myLongitude,
    bankLatitude,
    bankLongitude,
    km
  ) => {                                                     //Ova funkcija gi pronaogja benzinskite vo opseg od odredeni
    let ky = 40000 / 360;                                    // kilometri spored momentalna lokacija na korisnikot.
    let kx = Math.cos((Math.PI * myLatitude) / 180.0) * ky;  // Promenlivite myLatitude/myLongitude se za lokacijata na
    let dx = Math.abs(myLongitude - bankLongitude) * kx;  // Promenlivite myLatitude/myLongitude se za lokacijata na
    let dy = Math.abs(myLatitude - bankLatitude) * ky; // benzinskata za koja se proveruva dali e vo toj opseg.
    return Math.sqrt(dx * dx + dy * dy) <= km;
  };


  const allBanks = (
    <MapContainer
      center={[41.6137143, 21.743258]}
      zoom={8}
      scrollWheelZoom={true}
    >
      {bankDataJson.map((bank) => (
        <Marker key={bank.id} position={[bank.latitude, bank.longitude]}>
          <Popup>
            <h2>{bank.name}</h2>
            <p>{bank.addr_street}</p>
          </Popup>
        </Marker>
      ))}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );

  const userLocation = (
    <MapContainer
      center={[latitude, longitude]}
      zoom={12}
      scrollWheelZoom={true}
    >
      <Marker key={"user-location"} position={[latitude, longitude]}>
        <Popup>
          <h2>User Location</h2>
        </Popup>
      </Marker>

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );

  const showUserLocationHandler = () => {
    setShowUserLocation(true);
    setShowAllBanks(false);
    setShowSearchData(false);
    setShowNearestBanks(false);
  };

  const showAllBanksHandler = () => {
    setShowAllBanks(true);
    setShowUserLocation(false);
    setShowSearchData(false);
    setShowNearestBanks(false);
  };

  const showBanksNearMeHandler = () => {
    let nearestBanks = [];
    let searchNearestBanks = null;

    bankDataJson.forEach((bank) => {
      let area = arePointsNear(
        latitude,
        longitude,
        bank.latitude,
        bank.longitude,
        40
      );
      if (area) {
        nearestBanks.push(
          <Marker key={bank.id} position={[bank.latitude, bank.longitude]}>
            <Popup>
              <h2>{bank.name}</h2>
              <p>{bank.addr_street}</p>
            </Popup>
          </Marker>
        );
      }
    });

    searchNearestBanks = (
      <MapContainer
        center={[latitude, longitude]}
        zoom={12}
        scrollWheelZoom={true}
      >
        {nearestBanks}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    );

    setNearestBankData(searchNearestBanks);
    setShowNearestBanks(true);
    setShowAllBanks(false);
    setShowUserLocation(false);
    setShowSearchData(false);
  };

  const showSearchBanksHandler = () => {
    const searchQuery = searchInputRef.current.value;
    const dataBanks = [];
    let searchDataBanks = null;
    let counter = 0;
    if (searchQuery.trim() !== "") {
      bankDataJson.forEach((bank) => {
        if (bank.name === searchQuery) {
          counter++;
          dataBanks.push(
            <Marker key={bank.id} position={[bank.latitude, bank.longitude]}>
              <Popup>
                <h2>{bank.name}</h2>
                <p>{bank.addr_street}</p>
              </Popup>
            </Marker>
          );
        }
      });
      searchDataBanks = (
        <MapContainer
          center={[41.6137143, 21.743258]}
          zoom={8}
          scrollWheelZoom={true}
        >
          {dataBanks}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      );
      setSearchData(searchDataBanks);
    } else {
      setSearchError(true);
    }
    setSearchError(counter === 0);
    setShowSearchData(true);
    setShowNearestBanks(false);
    setShowAllBanks(false);
    setShowUserLocation(false);
  };

  return (
    <header className={classes["header"]}>
      <div className={classes["header__background"]}>
        <div className={classes["header__content"]}>
          <h1>Search Banks in Macedonia</h1>
          <label htmlFor="search">Enter bank name</label>
          <div className={classes["form-group"]}>
            <input
              type="text"
              placeholder="Стопанска Банка...etc"
              id="search"
              ref={searchInputRef}
            />
            {searchError && <p>No results found</p>}
          </div>

          <button onClick={showSearchBanksHandler}>Search</button>
          <div className={classes["header_btn-container"]}>
            <button
              className={classes["header__btn-inline"]}
              onClick={showUserLocationHandler}
            >
              Your Location <IconLocation />
            </button>
            <button
              className={classes["header__btn-inline"]}
              onClick={showBanksNearMeHandler}
            >
              Banks Near Me <IconNearMe />
            </button>
            <button
              className={classes["header__btn-inline"]}
              onClick={showAllBanksHandler}
            >
              Show All banks
            </button>
          </div>
        </div>
      </div>
      {showAllBanks && allBanks}
      {showUserLocation && userLocation}
      {showNearestBanks && nearestBanksData}
      {showSearchData && searchData}
    </header>
  );
};

export default Header;
