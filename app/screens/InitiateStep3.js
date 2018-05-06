import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    AsyncStorage,
    ImageBackground,
    Dimensions
} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import MapView from 'react-native-maps';
import {firebaseRef} from "../servers/Firebase";
const {width} = Dimensions.get("window");
const CARD_HEIGHT = width;


const dateFormat = require('dateformat');
const foodDefaultImage = {uri: "https://www.rd.com/wp-content/uploads/2017/10/02_Fruit_Healthy-Holiday-Food-Gifts-Instead-of-Fruit-Cake_632353679-Avdeyukphoto-760x506.jpg"};
const sportDefaultImage = {uri: "http://www.youthvillage.co.za/wp-content/uploads/2014/10/football-fiesta-salisbury.jpg"};
const shoppingDefaultImage = {uri: "https://optinmonster.com/wp-content/uploads/2016/03/Reduce-Shopping-Cart-Abandonment.png"};
const movieDefaultImage = {uri: "https://st.depositphotos.com/2185383/4533/v/950/depositphotos_45330093-stock-illustration-cinema-concept.jpg"};
const studyDefaultImage = {uri: "http://www.nebrija.com/medios/actualidadnebrija/wp-content/uploads/sites/2/2016/11/bbva-educacion-1920x0-c-f-787x459.jpg"};
const gameDefaultImage = {uri: "https://images.unsplash.com/10/wii.jpg?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=592b3b24ffafc20dbe8b0a1df97ef5c6&w=1000&q=80"};
const petDefaultImage = {uri: "http://yourdost-blog-images.s3-ap-southeast-1.amazonaws.com/wp-content/uploads/2016/01/03170233/cute-cat.jpg"};
const otherDefaultImage = {uri: "https://static1.squarespace.com/static/51277219e4b08376dc025505/t/55f17df3e4b0d3922cc4c416/1441889779581/?format=300w"};


export default class InitiateStep2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            usersPlaces: [],
            pinLocation: null,
            userLocation: null,
        }
    }

    componentDidMount() {

        AsyncStorage.getItem('user', (err, result) => {
            const user = JSON.parse(result);
            this.setState({
                user: user
            });
        });


        navigator.geolocation.getCurrentPosition(position => {
                this.setState({
                    userLocation: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.03,
                        longitudeDelta: 0.01,
                    }
                });
            },
            err => console.log(err)
        );
    }

    defaultImageSetting(category) {
        switch (category) {
            case 'Food':
                return foodDefaultImage;
            case 'Sport':
                return sportDefaultImage;
            case 'Shopping':
                return shoppingDefaultImage;
            case 'Movie':
                return movieDefaultImage;
            case 'Study':
                return studyDefaultImage;
            case 'Game':
                return gameDefaultImage;
            case 'Pet':
                return petDefaultImage;
            default:
                return otherDefaultImage;
        }
    }

    createAct(actInfo, actTime) {
        let image = this.defaultImageSetting(actInfo.category);

        const actPostRef = firebaseRef.database().ref('activities');

        // Generate a reference to a new location and add some data using push()
        const newActPostRef = actPostRef.push();

        // Get the unique key generated by push()
        const postId = newActPostRef.key;

        let createInfo = {
            id: postId,
            category: actInfo.category,
            title: actInfo.title,
            description: actInfo.description,
            time: {
                date: dateFormat(actTime.date, "fullDate"),
                time: dateFormat(actTime.time, "shortTime"),
            },
            location: {
                latitude: this.state.userLocation.latitude,
                longitude: this.state.userLocation.longitude,
            },
            owner: {
                uid: this.state.user.uid,
                username: this.state.user.username
            },
            status: 'open',
            image: image,
        };

        let activityInfo = {
            actId: postId
        };

        let partInfo = {
            uid: this.state.user.uid,
            username: this.state.user.username
        };

        newActPostRef.set(createInfo).then(() => {
            //console.log('adding location');
        }).catch((error) => {
            console.log(error);
        });

        firebaseRef.database().ref('activities/' + postId + '/participants/' + this.state.user.uid).set(partInfo).then(() => {
            //console.log('adding location');
        }).catch((error) => {
            console.log(error);
        });

        firebaseRef.database().ref('users/' + this.state.user.uid + '/activities/' + postId).set(activityInfo).then(() => {
            //console.log('adding activity to users');
        }).catch((error) => {
            console.log(error);
        });


        this.props.navigation.navigate(("InitiateStepEnd"))

    }

    render() {

        let userLocationMarker = null;

        if (this.state.userLocation) {
            userLocationMarker = <
                MapView.Marker
                draggable
                coordinate={this.state.userLocation}
                onDragEnd={(e) => this.setState({userLocation: e.nativeEvent.coordinate})}
            />
        }

        const {params} = this.props.navigation.state;
        const actInfo = params ? params.actInfo : null;
        const actTime = params ? params.actTime : null;

        return (

            <ImageBackground
                source={require('../../assets/image/colorful.jpg')}
                style={{width: '100%', height: '100%'}}
            >
                <View style={styles.container}>
                    <View style={styles.formContainer}>
                        <View style={styles.mapContainer}>
                            <MapView style={styles.map}
                                     initialRegion={{
                                         latitude: -36.84705474575118,
                                         longitude: 174.76480531990111,
                                         latitudeDelta: 0.03,
                                         longitudeDelta: 0.01,
                                     }}
                            >
                                {userLocationMarker}

                            </MapView>
                        </View>

                        <Button
                            style={styles.button}
                            buttonStyle={{
                                borderRadius: 0,
                                marginLeft: 0,
                                marginRight: 0,
                                marginBottom: 0,
                                backgroundColor: "#1DA1F2"
                            }}
                            title='Next'
                            onPress={() => this.createAct(actInfo, actTime)}
                        />

                    </View>
                </View>
            </ImageBackground>
        )
            ;
    }
}
let load = true;
InitiateStep2.navigationOptions = ({navigation}) => ({
    title: 'Initiate',
    headerStyle: {
        elevation: 2,
        shadowOpacity: 1,
        backgroundColor: '#1DA1F2',
    },
    headerTitleStyle: {textAlign: "center", flex: 1},
    headerTintColor: '#fff',
    headerLeft:
        <View style={{paddingLeft: 10}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={25} color="#FFFFFF"/>
            </TouchableOpacity>
        </View>,
    headerRight:
        <View style={{paddingRight: 10}}>
            <TouchableOpacity onPress={() => {
                if (load) {
                    load = false;
                    navigation.navigate('Profile');
                    setTimeout(() => {
                        load = true;
                    }, 700);
                }
            }}>
                <Icon name='user' type='evilicon' size={28} color='#fff'/>
            </TouchableOpacity>
        </View>,
});

const styles = StyleSheet.create({
    mapContainer: {
        flex:1,
        marginBottom: 15,
        elevation: 2,
        backgroundColor: "#FFF",
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: {x: 2, y: -2},
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        elevation: 2,
        padding:15,
        backgroundColor: "#FFF",
        margin: 15,
        shadowColor: "#000",
        shadowRadius: 2,
        shadowOpacity: 0.3,
        shadowOffset: {x: 2, y: -2},
        height:CARD_HEIGHT,
    },
    button: {
        elevation: 2,
        backgroundColor: "#FFF",
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: {x: 2, y: -2},
    }

});