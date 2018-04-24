import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Header from 'react-navigation/src/views/Header/Header';
import {Icon} from 'react-native-elements';

export default class Profile extends React.Component {
    render() {
        return (
            <View style={{flex: 1}}>
                <Header
                    scene={{index: 0}}
                    scenes={[{index: 0, isActive: true}]}
                    navigation={{state: {index: 0}}}
                    getScreenDetails={() => ({
                        options: {
                            headerTitleStyle: {textAlign: "center", flex: 1},
                            title: 'Profile',
                            headerLeft: (<View></View>),
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
                <View style={styles.container}>
                    <Text>
                        Welcome to Profile screen!
                    </Text>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});