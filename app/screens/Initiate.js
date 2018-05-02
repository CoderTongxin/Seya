import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    AsyncStorage,
} from 'react-native';
import {Icon} from 'react-native-elements';
import { Button } from 'react-native-elements'
import t from 'tcomb-form-native';

const _ = require('lodash');
const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.pickerTouchable.normal.height = 36;
stylesheet.pickerTouchable.error.height = 36;

const dateFormat = require('dateformat');

const Form = t.form.Form;

const options = {
    order: ['title', 'description', 'category', 'date', 'time'],
    fields: {
        category: {
            nullOption: {value: '', text: 'Please select activity type'},
            error: 'Please tell others what kind of activity you are initiating',
            stylesheet: stylesheet,
        },
        title: {
            placeholder: 'Please write an activity title',
            error: 'A beautiful title can attract people to join your activity',
        },
        description: {
            placeholder: 'Please write a brief activity description'
        },
        date: {
            mode: 'date',
            error: 'Invalid date',
            config: {
                format: ((date) => dateFormat(date, "fullDate")),
            },
        },
        time: {
            mode: 'time',
            error: 'Invalid time',
            config: {
                format: ((time) => dateFormat(time, "shortTime")),
            },
        }
    },
};

const Category = t.enums({
    Food: 'Food',
    Sport: 'Sport',
    Shopping: 'Shopping',
    Movie: 'Movie',
    Study: 'Study',
    Game: 'Game',
    Pet: 'Pet',
    Other: 'Other',
});

const Activity = t.struct({
    category: Category,
    title: t.String,
    description: t.maybe(t.String),
    date: t.Date,
    time: t.Date,
});


export default class Initiate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userLocation: null,
        }
    }

    handleSubmit = () => {
        const value = this._form.getValue();
        if(value){
            this.props.navigation.navigate(("InitiateStep2"),
                {
                    actInfo: value,
                });
        }
    };

    render() {
        return (
            <ScrollView style={styles.container}>
                <Form
                    ref={c => this._form = c}
                    type={Activity}
                    options={options}
                />
                <Button
                    large
                    title="Next"
                    onPress={this.handleSubmit}
                />
            </ScrollView>

        );
    }
}

Initiate.navigationOptions = ({navigation}) => ({
    title: 'Initiate',
    headerTitleStyle: {textAlign: "center", flex: 1},
    headerLeft: (<View></View>),
    headerRight:
        <View style={{paddingRight: 10}}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Icon name="account-circle" size={25} color="#808080"/>
            </TouchableOpacity>
        </View>,
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
});