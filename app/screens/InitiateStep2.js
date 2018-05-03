import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import MapView from 'react-native-maps';
import {firebaseRef} from "../servers/Firebase";

const dateFormat = require('dateformat');

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
            this.setState({
                user: JSON.parse(result)
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

    createAct(actInfo) {
        let createInfo = {
            category: actInfo.category,
            title: actInfo.title,
            description: actInfo.description,
            time: {
                date: dateFormat(actInfo.date, "fullDate"),
                time: dateFormat(actInfo.time, "shortTime"),
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
        };



        const actPostRef = firebaseRef.database().ref('activities');

        // Generate a reference to a new location and add some data using push()
        const newActPostRef = actPostRef.push();

        // Get the unique key generated by push()
        const postId = newActPostRef.key;

        let userInfo = {
            actId : postId
        };

        let partInfo = {
            uid : this.state.user.uid,
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

        firebaseRef.database().ref('users/' + this.state.user.uid + '/activities/' + postId).set(userInfo).then(() => {
            //console.log('adding location');
        }).catch((error) => {
            console.log(error);
        });


        this.props.navigation.navigate(("InitiateStep3"))

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

        return (
            <View style={styles.container}>
                <Button
                    onPress={() => this.createAct(actInfo)}
                    title="Initiate the Activity!"
                    color="#841584"
                />
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
        );
    }
}

InitiateStep2.navigationOptions = ({navigation}) => ({
    title: 'Initiate',
    headerStyle: {
        elevation: 2,
        shadowOpacity: 1,
        backgroundColor: '#2E3347',
    },
    headerTitleStyle: {textAlign: "center", flex: 1},
    headerTintColor: '#fff',
    headerLeft:
        <View style={{paddingLeft: 10}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={25} color="#808080"/>
            </TouchableOpacity>
        </View>,
    headerRight:
        <View style={{paddingRight: 10}}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Icon name="account-circle" size={25} color="white"/>
            </TouchableOpacity>
        </View>,
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    map: {
        width: '100%',
        height: '100%',
    }

});