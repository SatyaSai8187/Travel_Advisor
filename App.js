import React, { useState, useEffect} from 'react'; 
import { CssBaseline, Grid } from '@material-ui/core';

import getPlacesData from './api/index';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

const App = () => {
    const [places, setPlaces] = useState([]);
    const [childCliked, setChildClicked] = useState(null);
    const [filteredPlaces, setFilteredPlaces] = useState([]);

    const [coordinates, setCoorinates] = useState({});
    const [bounds, setBounds] = useState({});

    const [isLoading, setLoading] = useState(false);
    const[type, setType] = useState('restaurants');
    const[rating, setRating] = useState('');

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(({ coords: {latitude, longitude} }) =>{
            setCoorinates({ lat: latitude, lng: longitude });
        });
    }, []);
    useEffect(() => {
        const filteredPlaces = places.filter((place) => place.rating > rating)
 
        setFilteredPlaces(filteredPlaces);
    }, [rating]);

    useEffect(() => {
       if(bounds.sw && bounds.ne) {
            setIsLoading(true)

            getPlacesData(type, bounds.sw, bounds.ne)
            .then((data) => {
                setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
                setFilteredPlaces([])
                setLoading(false);
            })
        }
    }, [coordinates, bounds]);

    console.log(places)
    console.log(filteredPlaces)

      return (
        <>
            <CssBaseline />
            <Header setCoordinates={setCoorinates} />
            <Grid container spacing={3} style={{ width: '100% '}}>
                <Grid item xs={12} md={4}>
                    <List 
                     places={filteredPlaces.length ? filteredPlace : places}
                     childCliked={childCliked}
                     isLoading={isLoading}
                     type={type}
                     setType={setType}
                     rating={rating}
                     setRating={setRating}
                      />
               </Grid>
                <Grid item xs={12} md={8}>
                    <Map
                       setCoorinates={setCoorinates}
                       setBounds={setBounds}
                       coordinates={coordinates}
                       places={filteredPlaces.length ? filteredPlace : places}
                       setChildClicked={setChildClicked}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default App;
