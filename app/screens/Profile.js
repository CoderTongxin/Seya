import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    AsyncStorage,
    Dimensions,
    Image
} from 'react-native';
import Header from 'react-navigation/src/views/Header/Header';
import {Avatar, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {firebaseRef} from "../servers/Firebase";
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;


export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.state = {
            user: '',
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('user', (err, result) => {
           firebaseRef.database().ref('users/'+result).once('value').then((user)=>{
               this.setState({
                   user: user.val()
               });
           })
        });
    }

    logout() {
        firebaseRef.auth().signOut().then(function () {
            AsyncStorage.removeItem('user', () => {
                this.props.navigation.navigate('Login');
            })
        }.bind(this)).catch((error) => {
            Alert.alert(error.message)
        });
    }


    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    {/*The key part to rewrite Header and make a icon to close the modal screen*/}
                    <Header
                        scene={{index: 0}}
                        scenes={[{index: 0, isActive: true}]}
                        navigation={{state: {index: 0}}}
                        getScreenDetails={() => ({
                            options: {
                                headerTitleStyle: {textAlign: "center", flex: 1},
                                title: 'Profile',
                                headerRight: (
                                    <View style={{paddingRight: 10}}>
                                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                            <Icon name="close" size={25} color="#808080"/>
                                        </TouchableOpacity>
                                    </View>
                                )

                            }
                        })}
                    />

                    {/*Edit here to add any functions*/}
                    <View style={styles.contentContainer}>
                        <View style={styles.headContainer}>
                            <View style={styles.avatarContainer}>
                                <Avatar
                                    xlarge
                                    rounded
                                    source={{
                                        uri: this.state.user.avatar,
                                    }}
                                    activeOpacity={0.7}
                                    overlayContainerStyle={{backgroundColor: 'transparent'}}
                                />
                            </View>
                            <View style={styles.infoContainer}>
                                <View style={styles.textContainer}>
                                    <Text style={styles.usernameText}>
                                        {this.state.user.username}
                                    </Text>
                                </View>
                                {this.state.user.email ?
                                    <View style={styles.textContainer}>
                                        <Icon
                                            name='envelope'
                                            size={15}
                                            color='#000'
                                        />
                                        <Text style={styles.emailText}>
                                            {this.state.user.email}
                                        </Text>

                                    </View> :
                                    <View/>
                                }
                                {/*<View style={styles.divider}/>*/}
                                <Image style={{width:SCREEN_WIDTH*0.8,height:200}}
                                       source={{uri: 'https://www.eurogif.com/files/uploads/2018/04/mCYny9f2c.gif'}}/>
                            </View>
                            <View style={styles.footerContainer}>
                                <View style={styles.divider}/>
                                <View style={styles.buttonContainer}>
                                    <Button
                                        title='Log out'
                                        icon={
                                            <Icon
                                                name='sign-out'
                                                size={18}
                                                color='white'
                                            />}
                                        buttonStyle={{
                                            backgroundColor: "#c0392b",
                                            borderRadius: 5,
                                            shadowOffset: {width: 0, height: 2},
                                            shadowOpacity: 0.8,
                                            shadowColor: 'rgba(0,0,0,0.3)'
                                        }}
                                        containerStyle={{height: 45}}
                                        onPress={this.logout}/>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(241,240,241,1)',
        height:SCREEN_HEIGHT
    },
    contentContainer: {
        flex:1,
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: 5,
        height:'100%',
        alignItems: 'center',
        paddingVertical: 5,
    },
    headContainer: {
        flex:1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatarContainer: {
        marginVertical: 5
    },
    infoContainer: {
        alignItems: 'center',
    },
    usernameText: {
        fontFamily: 'bold',
        fontSize: 25,
        color: 'rgba(98,93,144,1)',
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emailText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#000',
    },
    activityContainer: {
        marginTop: 15,
    },
    divider: {
        width: SCREEN_WIDTH,
        borderWidth: 0.5,
        borderColor: 'rgba(222, 223, 226, 1)',
        marginVertical: 8,
        height: 1,
    },
    footerContainer: {
        flex:1,
        justifyContent: 'flex-end'
    },
    buttonContainer: {
        alignItems: 'center',
    },
});