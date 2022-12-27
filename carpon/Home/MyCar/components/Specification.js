import React , {Component}  from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import color from "../../../color";

export default class Specification extends Component{
    render(){
        const specification = {
            size: {title: '寸法'},
            weight: {title: '寸法'},
            efficient: {title: '性能'},
            detail1: {title: '諸装置'},
            detail2: {title: 'エンジン主要諸元'},
        };
        return(
              <View>
                  <View style={styles.g2}>
                      <Text style={{fontWeight: 'bold'}}>諸元</Text>
                  </View>
                  {
                      Object.keys(specification).map((k, i) => {
                          return (
                              <View
                                  key={i}
                                  style={{
                                      borderTopWidth: 1,
                                      borderColor: '#CED0CE',
                                      padding: 15,
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignItems: 'center'
                                  }}>
                                  <Text style={{fontSize: 14, fontWeight: 'bold'}}>{specification[k].title}</Text>
                                  <View><Icon name="angle-down" size={30}/></View>
                              </View>
                          )
                      })
                  }
              </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#F5F5F5',
        flex: 1
    },
    g2: {
        marginVertical: 10,
        paddingVertical: 15,
        paddingLeft: 20,
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderBottomColor: color.active
    },
});
