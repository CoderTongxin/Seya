import React from 'react';
import {
    Text,
    View,
    Alert,
    StyleSheet
} from 'react-native';
import {Button} from 'react-native-elements';
import Logo from '../components/Logo';
import {firebaseRef} from '../servers/Firebase'
import SubmitButton from '../components/SubmitButton';
import Loader from '../components/Loader';
// import {styles} from "../common/style/styles";
import {HomeScreenRoot} from "../config/Route";
import {storeUserInfo} from '../common/js/userInfo';
import t from 'tcomb-form-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

const Form = t.form.Form;
const Options = {
    fields: {
        email: {
            placeholder: 'Enter your email here',
            error: 'Email cannot be blank',
            keyboardType: "email-address"
        },
        username: {
            placeholder: 'Enter your username here',
            error: 'Username cannot be blank',
        },
        gender: {
            error: 'Gender cannot be blank'
        },
        password: {
            placeholder: 'Enter your password here',
            error: 'Password cannot be blank',
            password: true,
            secureTextEntry: true
        }
    },
};
const GENDER_OPTIONS = t.enums({female: 'female', male: 'male', other: 'other'});

const UserInfo = t.struct({
    email: t.String,
    username: t.String,
    gender: GENDER_OPTIONS,
    password: t.String
});

export default class SignUp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isAuthenticated: false,
        };
        this.signup = this.signup.bind(this);
        this._goBack = this._goBack.bind(this);
    }

    signup = () => {
        let userInfo = this.refs.form.getValue();
        if (userInfo) {
            this.setState({loading: true});
            firebaseRef.auth().createUserWithEmailAndPassword(userInfo.email, userInfo.password)
                .then((loggedInUser) => {
                    const user = {
                        username: userInfo.username,
                        email: userInfo.email,
                        gender: userInfo.gender,
                        uid: loggedInUser.uid,
                        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS505a3eKGNwX5SB6AMA0K7sr4uvozsp5HK8o2Fpqv0IZ4MsEHVrA'
                    };
                    firebaseRef.database().ref('users/' + loggedInUser.uid).set(user).then(() => {
                            this.storeUserInfo(user)
                        }
                    );
                }).catch(function (error) {
                this.setState({loading: false});
                Alert.alert(error.message);
            }.bind(this));
        }
    };

    storeUserInfo(user) {
        this.setState({loading: false});
        storeUserInfo(user);
        this.props.navigation.navigate('HomeScreenRoot');
    }

    _goBack() {
        this.props.navigation.navigate('Login');
    }


    render() {
        return (
            <KeyboardAwareScrollView>
                <View style={styles.container}>
                    <Loader loading={this.state.loading}/>
                    <Logo/>

                    <Form
                        ref='form'
                        type={UserInfo}
                        options={Options}
                    />
                    <Button
                        title="Submit"
                        onPress={this.signup}
                    />
                    <View style={styles.footerView}>
                        <Text style={{color: '#000000'}}>
                            Already have an account?
                        </Text>
                        <Button
                            title="Login"
                            clear
                            activeOpacity={0.5}
                            titleStyle={{color: '#616161', fontSize: 15}}
                            containerStyle={{marginTop: -10}}
                            onPress={this._goBack}
                        />
                    </View>
                </View>
            </KeyboardAwareScrollView>

        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff'
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    footerView: {
        marginTop: 20,
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
})