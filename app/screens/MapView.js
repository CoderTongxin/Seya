import React from 'react';
import {StyleSheet, View, Button, TouchableOpacity} from 'react-native';
import Map from '../components/Map'
import Header from 'react-navigation/src/views/Header/Header';
import {Icon} from 'react-native-elements';

export default class MapView extends React.Component {


    render() {
        return (
            <View style={{flex: 1}}>
                {/*The key part to rewrite Header and make a icon to close the modal screen*/}
                <Header
                    scene={{index: 0}}
                    scenes={[{index: 0, isActive: true}]}
                    navigation={{state: {index: 0}}}
                    getScreenDetails={() => ({
                        options: {
                            headerTitleStyle: {textAlign: "center", flex: 1},
                            title: 'Map View',
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

                {/*Edit here to add any functions*/}
                <View style={styles.container}>
                    <Map/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});